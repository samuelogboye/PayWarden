namespace PayWarden.Application.ApiKeys.Commands.CreateApiKey;

public class CreateApiKeyResult
{
    public string ApiKey { get; set; } = string.Empty;
    public Guid KeyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string[] Permissions { get; set; } = Array.Empty<string>();
    public DateTime ExpiresAt { get; set; }
}
