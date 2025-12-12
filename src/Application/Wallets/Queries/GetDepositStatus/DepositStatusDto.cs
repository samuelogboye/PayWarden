namespace PayWarden.Application.Wallets.Queries.GetDepositStatus;

public class DepositStatusDto
{
    public string Reference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaystackStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
