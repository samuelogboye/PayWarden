using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using PayWarden.Application.Common.Interfaces;
using PayWarden.Infrastructure.Auth;
using PayWarden.Infrastructure.Persistence;
using PayWarden.Infrastructure.Services;
using System.Text;

namespace PayWarden.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider =>
            provider.GetRequiredService<ApplicationDbContext>());

        // Add Authentication Services
        var jwtSettings = new JwtSettings();
        configuration.GetSection("JwtSettings").Bind(jwtSettings);
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Secret))
            };
        });

        // Configure HMAC Settings for API Keys
        services.Configure<HmacSettings>(configuration.GetSection("HmacSettings"));

        // Add Services
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IApiKeyService, ApiKeyService>();
        services.AddScoped<IApiKeyContext, ApiKeyContext>();

        // Add HttpContextAccessor
        services.AddHttpContextAccessor();

        return services;
    }
}
