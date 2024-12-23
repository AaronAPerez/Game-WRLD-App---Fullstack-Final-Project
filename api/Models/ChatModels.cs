using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class ChatRoomModel
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Room name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Room name must be between 2 and 100 characters")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;

    [Url(ErrorMessage = "Invalid image URL")]
    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; }

    [Required]
    public int CreatorId { get; set; }

    public bool IsPrivate { get; set; }
    public bool IsDeleted { get; set; }

    public virtual UserModel Creator { get; set; } = null!;
    public virtual ICollection<ChatRoomMemberModel> Members { get; set; }
    public virtual ICollection<ChatMessageModel> Messages { get; set; }

    public ChatRoomModel()
    {
        CreatedAt = DateTime.UtcNow;
        Members = new List<ChatRoomMemberModel>();
        Messages = new List<ChatMessageModel>();
    }
}

public class ChatRoomMemberModel
{
    public int Id { get; set; }
    public int ChatRoomId { get; set; }
    public int UserId { get; set; }
    public string Role { get; set; } = "member"; // admin, moderator, member
    public DateTime JoinedAt { get; set; }
    public DateTime? LastRead { get; set; }

    public virtual ChatRoomModel ChatRoom { get; set; } = null!;
    public virtual UserModel User { get; set; } = null!;

    public ChatRoomMemberModel()
    {
        JoinedAt = DateTime.UtcNow;
    }
}


public class ChatMessageModel
{
    public int Id { get; set; }

    [Required]
    public int ChatRoomId { get; set; }

    [Required]
    public int SenderId { get; set; }

    [Required(ErrorMessage = "Message content is required")]
    [StringLength(2000, ErrorMessage = "Message cannot exceed 2000 characters")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(text|image|system)$", ErrorMessage = "Invalid message type")]
    public string MessageType { get; set; } = "text";

    public DateTime SentAt { get; set; }
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }

    public virtual ChatRoomModel ChatRoom { get; set; } = null!;
    public virtual UserModel Sender { get; set; } = null!;

    public ChatMessageModel()
    {
        SentAt = DateTime.UtcNow;
    }
}


public class DirectMessageModel
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MessageType { get; set; } = "text"; // text, image
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsEdited { get; set; }
    public bool IsDeleted { get; set; }

    public virtual UserModel Sender { get; set; } = null!;
    public virtual UserModel Receiver { get; set; } = null!;

    public DirectMessageModel()
    {
        SentAt = DateTime.UtcNow;
    }
}