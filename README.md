# PayWarden

Modern fintech-ready wallet API powering deposits, transfers, service-to-service access, and real-time Paystack webhook processing.

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

- **Google OAuth + JWT Authentication** - Secure user authentication with Google OAuth 2.0
- **API Key Management** - Service-to-service authentication with permission-based access control
- **Wallet Management** - Automatic wallet creation, balance tracking, transaction history
- **Paystack Integration** - Secure deposit flow with webhook processing
- **Wallet-to-Wallet Transfers** - Atomic transfers with concurrency protection
- **Rate Limiting** - Built-in protection against abuse (100 req/min global, custom per endpoint)
- **Global Exception Handling** - Structured error responses without exposing internals
- **Health Checks** - Container-ready with health monitoring
- **Comprehensive Logging** - Serilog with structured logging to Seq
- **Docker Support** - Production-ready containerization
- **CI/CD Pipeline** - GitHub Actions workflow for automated testing and deployment

## Architecture

PayWarden follows **Clean Architecture** (Onion Architecture) principles:

```
/src
  /Application    - CQRS handlers (MediatR), DTOs, interfaces, validators
  /Domain         - Core entities, domain logic, aggregates
  /Infrastructure - EF Core, Paystack service, authentication
  /WebAPI         - Controllers, middleware, startup configuration
/tests
  /UnitTests      - Domain and application logic tests
  /IntegrationTests - API endpoint and database tests
```

## Technology Stack

- **.NET 9 / ASP.NET Core** - Web API framework
- **Entity Framework Core 9** - ORM with PostgreSQL
- **PostgreSQL** - Primary database
- **MediatR** - CQRS pattern implementation
- **FluentValidation** - Request validation
- **Serilog** - Structured logging
- **Swagger/OpenAPI** - API documentation
- **Paystack** - Payment gateway integration
- **Docker** - Containerization

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [PostgreSQL 16+](https://www.postgresql.org/download/)
- [Google OAuth Credentials](https://console.cloud.google.com/)
- [Paystack Account](https://paystack.com/) (test mode available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samuelogboye/PayWarden.git
   cd PayWarden
   ```

2. **Configure database**

   Update `src/WebAPI/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=paywarden;Username=postgres;Password=yourpassword"
     }
   }
   ```

3. **Configure secrets**

   Update authentication and payment settings in `appsettings.Development.json`:
   ```json
   {
     "JwtSettings": {
       "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
       "Issuer": "PayWarden",
       "Audience": "PayWarden.Client",
       "ExpiryMinutes": 60
     },
     "HmacSettings": {
       "Secret": "PayWardenHmacSecretKeyForApiKeyHashing2024!!"
     },
     "PaystackSettings": {
       "SecretKey": "sk_test_your_paystack_test_secret_key",
       "PublicKey": "pk_test_your_paystack_test_public_key",
       "BaseUrl": "https://api.paystack.co"
     }
   }
   ```

4. **Apply database migrations**
   ```bash
   dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI
   ```

5. **Run the application**
   ```bash
   dotnet run --project src/WebAPI
   ```

6. **Access Swagger UI**
   ```
   https://localhost:5273/swagger
   ```

## API Documentation

Detailed API documentation is available in [API_DOCS.md](API_DOCS.md).

**Quick Examples:**

**Get Wallet Balance:**
```bash
curl -X GET https://localhost:5273/api/wallet/balance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Transfer Funds:**
```bash
curl -X POST https://localhost:5273/api/wallet/transfer \
  -H "Content-Type: application/json" \
  -H "x-api-key: pwk_YOUR_API_KEY" \
  -d '{
    "recipientWalletNumber": "1234567890",
    "amount": 1000.00,
    "description": "Payment for services"
  }'
```

## Docker Deployment

**Build and run with Docker:**

```bash
# Build image
docker build -t paywarden:latest .

# Run container
docker run -d -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Host=db;Database=paywarden;Username=user;Password=pass" \
  -e JwtSettings__Secret="YourSecretKey" \
  -e HmacSettings__Secret="YourHmacSecret" \
  -e PaystackSettings__SecretKey="sk_live_xxx" \
  -e PaystackSettings__PublicKey="pk_live_xxx" \
  --name paywarden \
  paywarden:latest
```

**Docker Compose (with PostgreSQL):**

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: paywarden
      POSTGRES_USER: paywarden
      POSTGRES_PASSWORD: yourpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      ConnectionStrings__DefaultConnection: "Host=db;Database=paywarden;Username=paywarden;Password=yourpassword"
      JwtSettings__Secret: "YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
      HmacSettings__Secret: "PayWardenHmacSecretKeyForApiKeyHashing2024!!"
      PaystackSettings__SecretKey: "sk_test_xxx"
      PaystackSettings__PublicKey: "pk_test_xxx"

volumes:
  postgres_data:
```

## Development

**Run tests:**
```bash
# All tests
dotnet test

# Specific project
dotnet test tests/UnitTests
dotnet test tests/IntegrationTests
```

**Database migrations:**
```bash
# Create migration
dotnet ef migrations add MigrationName --project src/Infrastructure --startup-project src/WebAPI

# Apply migrations
dotnet ef database update --project src/Infrastructure --startup-project src/WebAPI

# Remove last migration
dotnet ef migrations remove --project src/Infrastructure --startup-project src/WebAPI
```

**Code formatting:**
```bash
dotnet format
```

## Security

- **API Keys:** HMACSHA256 hashing with configurable secret
- **JWT Tokens:** Configurable expiry and secure signing
- **Webhook Validation:** HMACSHA512 signature verification for Paystack webhooks
- **Rate Limiting:** Global and per-endpoint limits
- **HTTPS Enforcement:** Automatic redirection in production
- **Concurrency Control:** EF Core RowVersion for optimistic locking
- **Global Exception Handling:** Stack traces hidden in production

## CI/CD

GitHub Actions workflow (`.github/workflows/ci-cd.yml`) provides:
- Automated build and testing
- Docker image building and publishing
- Security scanning with Trivy
- Code quality analysis

**Required Secrets:**
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password

## Monitoring

**Health Check Endpoint:**
```bash
curl http://localhost:8080/health
```

**Structured Logging:**
All logs are written to:
- Console (development)
- File: `logs/paywarden-{Date}.log`
- Seq: `http://localhost:5341` (if configured)

**Key Metrics Logged:**
- API key creation and usage
- Transfer operations
- Deposit initialization and webhook processing
- Authentication attempts
- Rate limit violations

## Project Structure

```
PayWarden/
├── src/
│   ├── Application/          # Business logic, CQRS handlers
│   │   ├── ApiKeys/          # API key management
│   │   ├── Auth/             # Authentication
│   │   ├── Common/           # Shared interfaces, constants
│   │   └── Wallets/          # Wallet operations
│   ├── Domain/               # Core domain entities
│   │   ├── Entities/         # User, Wallet, Transaction, etc.
│   │   └── Enums/            # Domain enumerations
│   ├── Infrastructure/       # External services, persistence
│   │   ├── Auth/             # JWT, Google OAuth, API key middleware
│   │   ├── Persistence/      # EF Core DbContext, configurations
│   │   └── Services/         # Paystack, external services
│   └── WebAPI/               # API controllers, middleware
│       ├── Controllers/      # API endpoints
│       ├── Middleware/       # Global exception handler
│       └── Program.cs        # Application startup
├── tests/
│   ├── UnitTests/            # Unit tests
│   └── IntegrationTests/     # Integration tests
├── .github/
│   └── workflows/            # CI/CD pipelines
├── Dockerfile                # Container definition
├── API_DOCS.md              # Comprehensive API documentation
└── README.md                # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [.NET 9](https://dotnet.microsoft.com/)
- Powered by [Paystack](https://paystack.com/)
- Inspired by Clean Architecture principles
