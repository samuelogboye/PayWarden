using Microsoft.EntityFrameworkCore;
using PayWarden.Domain.Entities;

namespace PayWarden.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Wallet> Wallets { get; }
    DbSet<ApiKey> ApiKeys { get; }
    DbSet<Transaction> Transactions { get; }
    DbSet<WalletTransfer> WalletTransfers { get; }
    DbSet<WebhookEvent> WebhookEvents { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
