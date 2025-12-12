using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Infrastructure.Auth;

public class ApiKeyAuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiKeyAuthenticationMiddleware> _logger;

    public ApiKeyAuthenticationMiddleware(RequestDelegate next, ILogger<ApiKeyAuthenticationMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext, IApiKeyService apiKeyService)
    {
        // Check for x-api-key header
        if (context.Request.Headers.TryGetValue("x-api-key", out var apiKeyHeader))
        {
            var plainKey = apiKeyHeader.ToString();

            // Hash the provided key
            var hashedKey = apiKeyService.HashApiKey(plainKey);

            // Find API key in database
            var apiKey = await dbContext.ApiKeys
                .Include(k => k.User)
                .FirstOrDefaultAsync(k => k.KeyHash == hashedKey && k.IsActive);

            if (apiKey != null)
            {
                // Check if expired
                if (apiKey.HasExpired)
                {
                    _logger.LogWarning("Expired API key used: {KeyId}", apiKey.Id);
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsJsonAsync(new { message = "API key has expired" });
                    return;
                }

                // Update last used timestamp (fire and forget to avoid blocking)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        apiKey.LastUsedAt = DateTime.UtcNow;
                        await dbContext.SaveChangesAsync();
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Failed to update LastUsedAt for API key {KeyId}", apiKey.Id);
                    }
                });

                // Create claims and set user identity
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, apiKey.UserId.ToString()),
                    new Claim("ApiKeyId", apiKey.Id.ToString()),
                    new Claim(ClaimTypes.Email, apiKey.User.Email)
                };

                // Add permission claims
                foreach (var permission in apiKey.Permissions)
                {
                    claims.Add(new Claim("Permission", permission));
                }

                var identity = new ClaimsIdentity(claims, "ApiKey");
                context.User = new ClaimsPrincipal(identity);

                _logger.LogInformation("API key authenticated for user {UserId}, key {KeyId}", apiKey.UserId, apiKey.Id);
            }
        }

        await _next(context);
    }
}
