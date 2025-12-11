using PayWarden.Domain.Common;

namespace PayWarden.Domain.Entities;

public class Wallet : BaseEntity
{
    public string WalletNumber { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public Guid UserId { get; set; }
    public byte[] RowVersion { get; set; } = Array.Empty<byte>(); // For concurrency control

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
