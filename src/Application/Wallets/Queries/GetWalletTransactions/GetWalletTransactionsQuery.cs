using MediatR;

namespace PayWarden.Application.Wallets.Queries.GetWalletTransactions;

public record GetWalletTransactionsQuery(
    int PageNumber = 1,
    int PageSize = 20
) : IRequest<TransactionListDto>;
