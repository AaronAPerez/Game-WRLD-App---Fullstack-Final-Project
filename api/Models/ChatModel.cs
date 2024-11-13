using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ChatModel
    {
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsGroupChat { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<User> Participants { get; set; }
    public ICollection<Message> Messages { get; set; }
    }
}