namespace PayWarden.Application.Common.Interfaces;

public interface IApiKeyContext
{
    Guid? ApiKeyId { get; }
    Guid? UserId { get; }
    string[] Permissions { get; }
    bool IsAuthenticated { get; }
    bool HasPermission(string permission);
}
