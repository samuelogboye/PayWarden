namespace PayWarden.Application.Common.Interfaces;

public interface IPaystackService
{
    Task<PaystackInitializeResponse> InitializeTransactionAsync(decimal amount, string email, string reference);
    Task<PaystackVerifyResponse> VerifyTransactionAsync(string reference);
}

public class PaystackInitializeResponse
{
    public bool Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public PaystackInitializeData? Data { get; set; }
}

public class PaystackInitializeData
{
    public string AuthorizationUrl { get; set; } = string.Empty;
    public string AccessCode { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
}

public class PaystackVerifyResponse
{
    public bool Status { get; set; }
    public string Message { get; set; } = string.Empty;
    public PaystackVerifyData? Data { get; set; }
}

public class PaystackVerifyData
{
    public string Reference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
}
