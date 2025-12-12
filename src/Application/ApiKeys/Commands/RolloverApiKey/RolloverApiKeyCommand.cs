using MediatR;
using PayWarden.Application.ApiKeys.Commands.CreateApiKey;

namespace PayWarden.Application.ApiKeys.Commands.RolloverApiKey;

public record RolloverApiKeyCommand(
    Guid OldKeyId,
    string ExpiryDuration
) : IRequest<CreateApiKeyResult>;
