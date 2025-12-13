using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PayWarden.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UseXminForConcurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the custom RowVersion column
            // We'll use PostgreSQL's built-in xmin system column for concurrency instead
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Wallets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Re-add the custom RowVersion column if rolling back
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Wallets",
                type: "bytea",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
