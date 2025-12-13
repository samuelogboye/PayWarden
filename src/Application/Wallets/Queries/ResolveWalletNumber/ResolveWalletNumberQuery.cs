using MediatR;

namespace PayWarden.Application.Wallets.Queries.ResolveWalletNumber;

public class ResolveWalletNumberQuery : IRequest<ResolveWalletNumberResult>
{
    public string WalletNumber { get; set; } = string.Empty;
}
