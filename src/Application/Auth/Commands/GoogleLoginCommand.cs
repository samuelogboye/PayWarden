using MediatR;
using PayWarden.Application.Common.Models;

namespace PayWarden.Application.Auth.Commands;

public record GoogleLoginCommand(string GoogleToken) : IRequest<AuthResult>;
