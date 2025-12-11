using MediatR;
using Microsoft.EntityFrameworkCore;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Application.Common.Models;
using PayWarden.Domain.Entities;

namespace PayWarden.Application.Auth.Commands;

public class GoogleLoginCommandHandler : IRequestHandler<GoogleLoginCommand, AuthResult>
{
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public GoogleLoginCommandHandler(
        IGoogleAuthService googleAuthService,
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _googleAuthService = googleAuthService;
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResult> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        // Validate Google token
        var googleUserInfo = await _googleAuthService.ValidateGoogleTokenAsync(request.GoogleToken);
        if (googleUserInfo == null)
        {
            throw new UnauthorizedAccessException("Invalid Google token");
        }

        // Check if user exists
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.GoogleId == googleUserInfo.GoogleId, cancellationToken);

        if (user == null)
        {
            // Create new user
            user = new User
            {
                Id = Guid.NewGuid(),
                GoogleId = googleUserInfo.GoogleId,
                Email = googleUserInfo.Email,
                Name = googleUserInfo.Name,
                ProfilePictureUrl = googleUserInfo.PictureUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);

            // Create wallet for new user
            var wallet = new Wallet
            {
                Id = Guid.NewGuid(),
                WalletNumber = GenerateWalletNumber(),
                Balance = 0,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync(cancellationToken);
        }

        // Generate JWT token
        var token = _jwtTokenGenerator.GenerateToken(user.Id, user.Email);

        return new AuthResult
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email,
            Name = user.Name
        };
    }

    private static string GenerateWalletNumber()
    {
        // Generate a 13-digit wallet number
        var random = new Random();
        return string.Join("", Enumerable.Range(0, 13).Select(_ => random.Next(0, 10)));
    }
}
