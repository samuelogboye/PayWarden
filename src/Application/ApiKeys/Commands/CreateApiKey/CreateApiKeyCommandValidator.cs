using FluentValidation;
using PayWarden.Application.Common.Constants;

namespace PayWarden.Application.ApiKeys.Commands.CreateApiKey;

public class CreateApiKeyCommandValidator : AbstractValidator<CreateApiKeyCommand>
{
    public CreateApiKeyCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("API key name is required")
            .MaximumLength(100)
            .WithMessage("API key name cannot exceed 100 characters");

        RuleFor(x => x.Permissions)
            .NotEmpty()
            .WithMessage("At least one permission is required")
            .Must(BeValidPermissions)
            .WithMessage("All permissions must be valid. Valid permissions: deposit, transfer, read");

        RuleFor(x => x.ExpiryDuration)
            .NotEmpty()
            .WithMessage("Expiry duration is required")
            .Must(ExpiryDurations.IsValid)
            .WithMessage("Expiry duration must be one of: 1H, 1D, 1M, 1Y");
    }

    private bool BeValidPermissions(string[] permissions)
    {
        return permissions.All(Permissions.IsValid);
    }
}
