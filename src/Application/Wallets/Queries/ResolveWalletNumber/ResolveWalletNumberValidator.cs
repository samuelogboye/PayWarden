using FluentValidation;

namespace PayWarden.Application.Wallets.Queries.ResolveWalletNumber;

public class ResolveWalletNumberValidator : AbstractValidator<ResolveWalletNumberQuery>
{
    public ResolveWalletNumberValidator()
    {
        RuleFor(x => x.WalletNumber)
            .NotEmpty().WithMessage("Wallet number is required")
            .Length(10, 50).WithMessage("Wallet number must be between 10 and 50 characters");
    }
}
