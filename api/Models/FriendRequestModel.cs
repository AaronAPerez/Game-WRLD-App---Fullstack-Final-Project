using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
   public class FriendRequestModel
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public UserModel? Sender { get; set; }
    public int ReceiverId { get; set; }
    public UserModel? Receiver { get; set; }

    public string? Status { get; set; }
    public bool IsAccepted { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow; 
}

}