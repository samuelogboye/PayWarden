using MediatR;
using Microsoft.EntityFrameworkCore;
using PayWarden.Application.Common.Interfaces;

namespace PayWarden.Application.Wallets.Queries.ResolveWalletNumber;

public class ResolveWalletNumberQueryHandler : IRequestHandler<ResolveWalletNumberQuery, ResolveWalletNumberResult>
{
    private readonly IApplicationDbContext _context;

    public ResolveWalletNumberQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ResolveWalletNumberResult> Handle(ResolveWalletNumberQuery request, CancellationToken cancellationToken)
    {
        var wallet = await _context.Wallets
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.WalletNumber == request.WalletNumber, cancellationToken);

        if (wallet == null)
        {
            throw new InvalidOperationException($"Wallet with number '{request.WalletNumber}' not found");
        }

        return new ResolveWalletNumberResult
        {
            WalletNumber = wallet.WalletNumber,
            AccountName = wallet.User.Name
        };
    }
}
