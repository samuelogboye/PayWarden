using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Infrastructure.Services;

public class ApiKeyContext : IApiKeyContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ApiKeyContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? ApiKeyId
    {
        get
        {
            var apiKeyIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("ApiKeyId");
            return Guid.TryParse(apiKeyIdClaim, out var apiKeyId) ? apiKeyId : null;
        }
    }

    public Guid? UserId
    {
        get
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }

    public string[] Permissions => _httpContextAccessor.HttpContext?.User?
        .FindAll("Permission")
        .Select(c => c.Value)
        .ToArray() ?? Array.Empty<string>();

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

    public bool HasPermission(string permission)
    {
        return Permissions.Contains(permission, StringComparer.OrdinalIgnoreCase);
    }
}
