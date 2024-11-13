using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class PostModel
   {
    public int Id { get; set; }
    public string Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; }
    public User User { get; set; }
    public ICollection<PostLike> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
}
}