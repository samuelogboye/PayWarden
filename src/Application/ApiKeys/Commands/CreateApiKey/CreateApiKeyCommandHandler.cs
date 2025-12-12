using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Constants;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Application.Common.Services;
using PayWarden.Domain.Entities;

namespace PayWarden.Application.ApiKeys.Commands.CreateApiKey;

public class CreateApiKeyCommandHandler : IRequestHandler<CreateApiKeyCommand, CreateApiKeyResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IApiKeyService _apiKeyService;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<CreateApiKeyCommandHandler> _logger;

    public CreateApiKeyCommandHandler(
        IApplicationDbContext context,
        IApiKeyService apiKeyService,
        ICurrentUserService currentUserService,
        ILogger<CreateApiKeyCommandHandler> logger)
    {
        _context = context;
        _apiKeyService = apiKeyService;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<CreateApiKeyResult> Handle(CreateApiKeyCommand request, CancellationToken cancellationToken)
    {
        // Get current user ID
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Check if user has reached max active keys (5)
        var activeKeysCount = await _context.ApiKeys
            .CountAsync(k => k.UserId == userId && k.IsActive, cancellationToken);

        if (activeKeysCount >= 5)
        {
            _logger.LogWarning("User {UserId} attempted to create more than 5 API keys", userId);
            throw new InvalidOperationException("Maximum of 5 active API keys allowed per user");
        }

        // Validate permissions
        foreach (var permission in request.Permissions)
        {
            if (!Permissions.IsValid(permission))
            {
                throw new InvalidOperationException($"Invalid permission: {permission}");
            }
        }

        // Parse expiry duration
        var expiresAt = ExpiryDurationParser.ParseToDateTime(request.ExpiryDuration);

        // Generate API key
        var apiKeyGeneration = _apiKeyService.GenerateApiKey();

        // Create API key entity
        var apiKey = new ApiKey
        {
            Id = Guid.NewGuid(),
            KeyHash = apiKeyGeneration.HashedKey,
            Name = request.Name,
            Permissions = request.Permissions,
            ExpiresAt = expiresAt,
            IsActive = true,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("API key {KeyId} created for user {UserId} with permissions: {Permissions}",
            apiKey.Id, userId, string.Join(", ", request.Permissions));

        return new CreateApiKeyResult
        {
            ApiKey = apiKeyGeneration.PlainKey, // Only time user sees plain key
            KeyId = apiKey.Id,
            Name = apiKey.Name,
            Permissions = apiKey.Permissions,
            ExpiresAt = apiKey.ExpiresAt
        };
    }
}
