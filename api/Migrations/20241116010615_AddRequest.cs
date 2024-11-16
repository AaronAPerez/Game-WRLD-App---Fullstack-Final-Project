using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserModelId",
                table: "Friends",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "FriendRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserModelId",
                table: "FriendRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserModelId1",
                table: "FriendRequests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Friends_UserModelId",
                table: "Friends",
                column: "UserModelId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_UserModelId",
                table: "FriendRequests",
                column: "UserModelId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_UserModelId1",
                table: "FriendRequests",
                column: "UserModelId1");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequests_UserInfo_UserModelId",
                table: "FriendRequests",
                column: "UserModelId",
                principalTable: "UserInfo",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FriendRequests_UserInfo_UserModelId1",
                table: "FriendRequests",
                column: "UserModelId1",
                principalTable: "UserInfo",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Friends_UserInfo_UserModelId",
                table: "Friends",
                column: "UserModelId",
                principalTable: "UserInfo",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequests_UserInfo_UserModelId",
                table: "FriendRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_FriendRequests_UserInfo_UserModelId1",
                table: "FriendRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_Friends_UserInfo_UserModelId",
                table: "Friends");

            migrationBuilder.DropIndex(
                name: "IX_Friends_UserModelId",
                table: "Friends");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_UserModelId",
                table: "FriendRequests");

            migrationBuilder.DropIndex(
                name: "IX_FriendRequests_UserModelId1",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "UserModelId",
                table: "Friends");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "UserModelId",
                table: "FriendRequests");

            migrationBuilder.DropColumn(
                name: "UserModelId1",
                table: "FriendRequests");
        }
    }
}
