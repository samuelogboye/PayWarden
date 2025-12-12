using MediatR;

namespace PayWarden.Application.Wallets.Queries.GetWalletBalance;

public record GetWalletBalanceQuery : IRequest<WalletBalanceDto>;
