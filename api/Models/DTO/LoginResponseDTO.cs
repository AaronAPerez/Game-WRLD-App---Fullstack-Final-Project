namespace api.Models.DTO
{

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string PublisherName { get; set; } = string.Empty;
    }
}