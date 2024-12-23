using System.ComponentModel.DataAnnotations;

namespace api.Models.DTO
{
    public class TokenRefreshRequest
    {
        [Required(ErrorMessage = "Token is required")]
        public string? Token { get; set; }
    }
}

