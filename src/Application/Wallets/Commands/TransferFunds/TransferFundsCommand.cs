using MediatR;

namespace PayWarden.Application.Wallets.Commands.TransferFunds;

public record TransferFundsCommand(
    string RecipientWalletNumber,
    decimal Amount,
    string? Description = null
) : IRequest<TransferFundsResult>;
