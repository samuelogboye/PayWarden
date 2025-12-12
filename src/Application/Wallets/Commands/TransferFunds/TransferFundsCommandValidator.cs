using FluentValidation;

namespace PayWarden.Application.Wallets.Commands.TransferFunds;

public class TransferFundsCommandValidator : AbstractValidator<TransferFundsCommand>
{
    public TransferFundsCommandValidator()
    {
        RuleFor(x => x.RecipientWalletNumber)
            .NotEmpty().WithMessage("Recipient wallet number is required")
            .Length(10, 50).WithMessage("Wallet number must be between 10 and 50 characters");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero")
            .LessThanOrEqualTo(10000000).WithMessage("Amount cannot exceed 10,000,000");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}
