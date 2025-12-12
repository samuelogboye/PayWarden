namespace PayWarden.Application.Wallets.Commands.TransferFunds;

public class TransferFundsResult
{
    public string TransferReference { get; set; } = string.Empty;
    public string SenderWalletNumber { get; set; } = string.Empty;
    public string RecipientWalletNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal NewBalance { get; set; }
    public DateTime TransferredAt { get; set; }
    public string? Description { get; set; }
}
