namespace PayWarden.Application.Wallets.Queries.GetWalletBalance;

public class WalletBalanceDto
{
    public Guid WalletId { get; set; }
    public string WalletNumber { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public DateTime CreatedAt { get; set; }
}
