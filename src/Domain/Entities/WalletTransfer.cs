using PayWarden.Domain.Common;

namespace PayWarden.Domain.Entities;

public class WalletTransfer : BaseEntity
{
    public string Reference { get; set; } = string.Empty;
    public Guid SenderWalletId { get; set; }
    public Guid ReceiverWalletId { get; set; }
    public decimal Amount { get; set; }
    public Guid DebitTransactionId { get; set; }
    public Guid CreditTransactionId { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    public Wallet SenderWallet { get; set; } = null!;
    public Wallet ReceiverWallet { get; set; } = null!;
    public Transaction DebitTransaction { get; set; } = null!;
    public Transaction CreditTransaction { get; set; } = null!;
}
