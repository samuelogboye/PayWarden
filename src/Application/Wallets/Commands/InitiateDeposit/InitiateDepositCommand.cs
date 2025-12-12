using MediatR;

namespace PayWarden.Application.Wallets.Commands.InitiateDeposit;

public record InitiateDepositCommand(decimal Amount) : IRequest<DepositInitializationResult>;
