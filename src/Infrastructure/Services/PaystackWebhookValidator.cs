using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace PayWarden.Infrastructure.Services;

public interface IPaystackWebhookValidator
{
    bool ValidateSignature(string payload, string signature);
}

public class PaystackWebhookValidator : IPaystackWebhookValidator
{
    private readonly PaystackSettings _settings;
    private readonly ILogger<PaystackWebhookValidator> _logger;

    public PaystackWebhookValidator(
        IOptions<PaystackSettings> settings,
        ILogger<PaystackWebhookValidator> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public bool ValidateSignature(string payload, string signature)
    {
        try
        {
            // Compute HMAC SHA512 hash
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(_settings.SecretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            var computedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

            // Constant-time comparison
            var isValid = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computedSignature),
                Encoding.UTF8.GetBytes(signature));

            if (!isValid)
            {
                _logger.LogWarning("Invalid Paystack webhook signature");
            }

            return isValid;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating Paystack webhook signature");
            return false;
        }
    }
}
