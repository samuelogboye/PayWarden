using PayWarden.Application.Common.Models;

namespace PayWarden.Application.Common.Interfaces;

public interface IGoogleAuthService
{
    Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string googleToken);
}
