namespace PayWarden.Application.Common.Interfaces;

public interface IApiKeyService
{
    ApiKeyGenerationResult GenerateApiKey();
    string HashApiKey(string plainKey);
    bool VerifyApiKey(string plainKey, string hash);
}

public class ApiKeyGenerationResult
{
    public string PlainKey { get; set; } = string.Empty;
    public string HashedKey { get; set; } = string.Empty;
}
