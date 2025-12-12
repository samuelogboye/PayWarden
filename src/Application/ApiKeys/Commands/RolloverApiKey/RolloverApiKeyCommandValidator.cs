using FluentValidation;
using PayWarden.Application.Common.Constants;

namespace PayWarden.Application.ApiKeys.Commands.RolloverApiKey;

public class RolloverApiKeyCommandValidator : AbstractValidator<RolloverApiKeyCommand>
{
    public RolloverApiKeyCommandValidator()
    {
        RuleFor(x => x.OldKeyId)
            .NotEmpty()
            .WithMessage("Old API key ID is required");

        RuleFor(x => x.ExpiryDuration)
            .NotEmpty()
            .WithMessage("Expiry duration is required")
            .Must(ExpiryDurations.IsValid)
            .WithMessage("Expiry duration must be one of: 1H, 1D, 1M, 1Y");
    }
}
