using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class UserModel
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
    public string? Username { get; set; }

    [Required]
    public string? Salt { get; set; }

    [Required]
    public string? Hash { get; set; }

    [Url(ErrorMessage = "Invalid avatar URL")]
    public string? Avatar { get; set; }

    [StringLength(20)]
    public string? Status { get; set; }

    public DateTime LastActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }


    // Navigation properties
    public virtual ICollection<FriendModel>? FriendshipsInitiated { get; set; }
    public virtual ICollection<FriendModel>? FriendshipsReceived { get; set; }
    public virtual ICollection<UserGameModel>? UserGames { get; set; }

    public UserModel()
    {

        FriendshipsInitiated = new HashSet<FriendModel>();
        FriendshipsReceived = new HashSet<FriendModel>();
        UserGames = new HashSet<UserGameModel>();
        CreatedAt = DateTime.UtcNow;
        LastActive = DateTime.UtcNow;
    }

}
public class UserGameModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int GameId { get; set; }
    public bool IsFavorite { get; set; }
    public DateTime AddedAt { get; set; }

    public virtual UserModel? User { get; set; }
}

