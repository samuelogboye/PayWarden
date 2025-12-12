using MediatR;

namespace PayWarden.Application.Wallets.Queries.GetDepositStatus;

public record GetDepositStatusQuery(string Reference) : IRequest<DepositStatusDto>;
