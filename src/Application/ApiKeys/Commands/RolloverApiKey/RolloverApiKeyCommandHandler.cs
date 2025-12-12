using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PayWarden.Application.ApiKeys.Commands.CreateApiKey;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Application.Common.Services;
using PayWarden.Domain.Entities;

namespace PayWarden.Application.ApiKeys.Commands.RolloverApiKey;

public class RolloverApiKeyCommandHandler : IRequestHandler<RolloverApiKeyCommand, CreateApiKeyResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IApiKeyService _apiKeyService;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<RolloverApiKeyCommandHandler> _logger;

    public RolloverApiKeyCommandHandler(
        IApplicationDbContext context,
        IApiKeyService apiKeyService,
        ICurrentUserService currentUserService,
        ILogger<RolloverApiKeyCommandHandler> logger)
    {
        _context = context;
        _apiKeyService = apiKeyService;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<CreateApiKeyResult> Handle(RolloverApiKeyCommand request, CancellationToken cancellationToken)
    {
        // Get current user ID
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Fetch old API key
        var oldApiKey = await _context.ApiKeys
            .Include(k => k.User)
            .FirstOrDefaultAsync(k => k.Id == request.OldKeyId, cancellationToken);

        if (oldApiKey == null)
        {
            throw new InvalidOperationException("API key not found");
        }

        // Validate that the key belongs to the current user
        if (oldApiKey.UserId != userId)
        {
            _logger.LogWarning("User {UserId} attempted to rollover API key {KeyId} that doesn't belong to them",
                userId, request.OldKeyId);
            throw new InvalidOperationException("You can only rollover your own API keys");
        }

        // Validate that the key is expired
        if (!oldApiKey.HasExpired)
        {
            throw new InvalidOperationException("API key must be expired before it can be rolled over");
        }

        // Parse expiry duration for new key
        var expiresAt = ExpiryDurationParser.ParseToDateTime(request.ExpiryDuration);

        // Generate new API key
        var apiKeyGeneration = _apiKeyService.GenerateApiKey();

        // Create new API key with cloned permissions
        var newApiKey = new ApiKey
        {
            Id = Guid.NewGuid(),
            KeyHash = apiKeyGeneration.HashedKey,
            Name = oldApiKey.Name, // Keep the same name
            Permissions = oldApiKey.Permissions, // Clone permissions
            ExpiresAt = expiresAt,
            IsActive = true,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        // Mark old key as inactive
        oldApiKey.IsActive = false;
        oldApiKey.UpdatedAt = DateTime.UtcNow;

        _context.ApiKeys.Add(newApiKey);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("API key {OldKeyId} rolled over to {NewKeyId} for user {UserId}",
            oldApiKey.Id, newApiKey.Id, userId);

        return new CreateApiKeyResult
        {
            ApiKey = apiKeyGeneration.PlainKey, // Only time user sees plain key
            KeyId = newApiKey.Id,
            Name = newApiKey.Name,
            Permissions = newApiKey.Permissions,
            ExpiresAt = newApiKey.ExpiresAt
        };
    }
}
