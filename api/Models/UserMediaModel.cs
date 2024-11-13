using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models
{

    public class User : MediaUserModel

    {
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? ProfilePicture { get; set; }
    public string? Bio { get; set; }
    public DateTime JoinDate { get; set; } = DateTime.UtcNow;
    public ICollection<UserFriend> Friends { get; set; }
    public ICollection<Post> Posts { get; set; }
    public ICollection<Chat> Chats { get; set; }
    public ICollection<Message> Messages { get; set; }
    public ICollection<PostLike> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Favorite> Favorites { get; set; }
    }
}