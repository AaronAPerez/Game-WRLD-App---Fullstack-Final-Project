using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class FriendsModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public UserModel? User { get; set; }
    public int FriendId { get; set; }
    public UserModel? Friend { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
}

}