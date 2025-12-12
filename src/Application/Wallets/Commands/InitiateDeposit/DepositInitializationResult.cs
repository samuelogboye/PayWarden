namespace PayWarden.Application.Wallets.Commands.InitiateDeposit;

public class DepositInitializationResult
{
    public string AuthorizationUrl { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string AccessCode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
