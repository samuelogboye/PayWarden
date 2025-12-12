# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/WebAPI/PayWarden.WebAPI.csproj", "src/WebAPI/"]
COPY ["src/Application/PayWarden.Application.csproj", "src/Application/"]
COPY ["src/Domain/PayWarden.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/PayWarden.Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/WebAPI/PayWarden.WebAPI.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/WebAPI"
RUN dotnet build "PayWarden.WebAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "PayWarden.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 paywarden && \
    adduser --system --uid 1001 --ingroup paywarden paywarden

# Copy published files
COPY --from=publish /app/publish .

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown -R paywarden:paywarden /app/logs

# Switch to non-root user
USER paywarden

# Expose port
EXPOSE 8080

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "PayWarden.WebAPI.dll"]
