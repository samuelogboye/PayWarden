using MediatR;

namespace PayWarden.Application.ApiKeys.Commands.CreateApiKey;

public record CreateApiKeyCommand(
    string Name,
    string[] Permissions,
    string ExpiryDuration
) : IRequest<CreateApiKeyResult>;
