using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class UserFriendModel
{
    public string UserId { get; set; }
    public User User { get; set; }
    public string FriendId { get; set; }
    public User Friend { get; set; }
    public FriendStatus Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public enum FriendStatus
{
    Pending,
    Accepted,
    Declined
}
}