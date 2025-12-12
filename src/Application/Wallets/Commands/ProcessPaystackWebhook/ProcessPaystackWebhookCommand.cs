using MediatR;

namespace PayWarden.Application.Wallets.Commands.ProcessPaystackWebhook;

public record ProcessPaystackWebhookCommand(
    string Event,
    PaystackWebhookData Data
) : IRequest<Unit>;

public class PaystackWebhookData
{
    public string Reference { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public long Amount { get; set; }  // Amount in kobo
    public string Customer { get; set; } = string.Empty;
}
