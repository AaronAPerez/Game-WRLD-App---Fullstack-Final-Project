namespace api.Models.DTO
{
    public class UserProfileDTO
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime LastActive { get; set; }
        public int FriendsCount { get; set; }
        public int GamesCount { get; set; }
        public bool IsOnline { get; set; }
    }
}