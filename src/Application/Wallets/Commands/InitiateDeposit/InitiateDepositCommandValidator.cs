using FluentValidation;

namespace PayWarden.Application.Wallets.Commands.InitiateDeposit;

public class InitiateDepositCommandValidator : AbstractValidator<InitiateDepositCommand>
{
    public InitiateDepositCommandValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0)
            .WithMessage("Amount must be greater than zero")
            .LessThanOrEqualTo(10000000)
            .WithMessage("Amount cannot exceed 10,000,000");
    }
}
