using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Infrastructure.Services;

public class ApiKeyService : IApiKeyService
{
    private readonly HmacSettings _hmacSettings;

    public ApiKeyService(IOptions<HmacSettings> hmacSettings)
    {
        _hmacSettings = hmacSettings.Value;
    }

    public ApiKeyGenerationResult GenerateApiKey()
    {
        // Format: pwk_{GUID}_{RandomBytes}
        var guid = Guid.NewGuid().ToString("N");
        var randomBytes = RandomNumberGenerator.GetBytes(16);
        var randomString = Convert.ToBase64String(randomBytes)
            .Replace("/", "")
            .Replace("+", "")
            .Replace("=", "")[..12];

        var plainKey = $"pwk_{guid}_{randomString}";
        var hashedKey = HashApiKey(plainKey);

        return new ApiKeyGenerationResult
        {
            PlainKey = plainKey,
            HashedKey = hashedKey
        };
    }

    public string HashApiKey(string plainKey)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_hmacSettings.Secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(plainKey));
        return Convert.ToBase64String(hash);
    }

    public bool VerifyApiKey(string plainKey, string hash)
    {
        var computedHash = HashApiKey(plainKey);

        // Use constant-time comparison to prevent timing attacks
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(computedHash),
            Encoding.UTF8.GetBytes(hash)
        );
    }
}

public class HmacSettings
{
    public string Secret { get; set; } = string.Empty;
}
