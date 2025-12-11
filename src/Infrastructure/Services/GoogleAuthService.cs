using Google.Apis.Auth;
using Microsoft.Extensions.Logging;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Application.Common.Models;

namespace PayWarden.Infrastructure.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(ILogger<GoogleAuthService> logger)
    {
        _logger = logger;
    }

    public async Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string googleToken)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken);

            return new GoogleUserInfo
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name,
                PictureUrl = payload.Picture
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to validate Google token");
            return null;
        }
    }
}
