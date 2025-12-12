using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Infrastructure.Services;

public class PaystackService : IPaystackService
{
    private readonly HttpClient _httpClient;
    private readonly PaystackSettings _settings;
    private readonly ILogger<PaystackService> _logger;

    public PaystackService(
        HttpClient httpClient,
        IOptions<PaystackSettings> settings,
        ILogger<PaystackService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;

        // Configure HttpClient
        _httpClient.BaseAddress = new Uri(_settings.BaseUrl);
        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _settings.SecretKey);
    }

    public async Task<PaystackInitializeResponse> InitializeTransactionAsync(
        decimal amount,
        string email,
        string reference)
    {
        try
        {
            // Paystack expects amount in kobo (smallest currency unit)
            var amountInKobo = (long)(amount * 100);

            var requestData = new
            {
                email,
                amount = amountInKobo,
                reference,
                currency = "NGN"
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync("/transaction/initialize", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Paystack initialization failed: {StatusCode} - {Response}",
                    response.StatusCode, responseBody);
                throw new InvalidOperationException($"Paystack initialization failed: {responseBody}");
            }

            var result = JsonSerializer.Deserialize<PaystackInitializeResponse>(responseBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result ?? throw new InvalidOperationException("Failed to deserialize Paystack response");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Paystack transaction");
            throw;
        }
    }

    public async Task<PaystackVerifyResponse> VerifyTransactionAsync(string reference)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/transaction/verify/{reference}");
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Paystack verification failed: {StatusCode} - {Response}",
                    response.StatusCode, responseBody);
                throw new InvalidOperationException($"Paystack verification failed: {responseBody}");
            }

            var result = JsonSerializer.Deserialize<PaystackVerifyResponse>(responseBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            return result ?? throw new InvalidOperationException("Failed to deserialize Paystack response");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying Paystack transaction");
            throw;
        }
    }
}
