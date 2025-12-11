using PayWarden.Domain.Common;
using PayWarden.Domain.Enums;

namespace PayWarden.Domain.Entities;

public class Transaction : BaseEntity
{
    public string Reference { get; set; } = string.Empty;
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public Guid WalletId { get; set; }
    public TransactionStatus Status { get; set; }
    public string? Description { get; set; }
    public string? PaystackReference { get; set; }
    public Guid? RelatedTransferId { get; set; }

    // Navigation properties
    public Wallet Wallet { get; set; } = null!;
    public WalletTransfer? WalletTransfer { get; set; }
}
