using MediatR;
using Microsoft.EntityFrameworkCore;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Application.Wallets.Queries.GetWalletTransactions;

public class GetWalletTransactionsQueryHandler : IRequestHandler<GetWalletTransactionsQuery, TransactionListDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetWalletTransactionsQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<TransactionListDto> Handle(GetWalletTransactionsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        // Get user's wallet
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);

        if (wallet == null)
        {
            throw new InvalidOperationException("Wallet not found for user");
        }

        // Get total count
        var totalCount = await _context.Transactions
            .CountAsync(t => t.WalletId == wallet.Id, cancellationToken);

        // Get paginated transactions ordered by most recent first
        var transactions = await _context.Transactions
            .Where(t => t.WalletId == wallet.Id)
            .OrderByDescending(t => t.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Reference = t.Reference,
                Type = t.Type.ToString(),
                Amount = t.Amount,
                Status = t.Status.ToString(),
                Description = t.Description,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new TransactionListDto
        {
            Transactions = transactions,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
