using MediatR;
using Microsoft.EntityFrameworkCore;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Application.Wallets.Queries.GetWalletBalance;

public class GetWalletBalanceQueryHandler : IRequestHandler<GetWalletBalanceQuery, WalletBalanceDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetWalletBalanceQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<WalletBalanceDto> Handle(GetWalletBalanceQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedAccessException("User is not authenticated");

        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId, cancellationToken);

        if (wallet == null)
        {
            throw new InvalidOperationException("Wallet not found for user");
        }

        return new WalletBalanceDto
        {
            WalletId = wallet.Id,
            WalletNumber = wallet.WalletNumber,
            Balance = wallet.Balance,
            CreatedAt = wallet.CreatedAt
        };
    }
}
