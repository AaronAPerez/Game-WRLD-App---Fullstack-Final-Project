using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO
{
   public class FriendRequestDTO
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string? SenderName { get; set; }
    public int ReceiverId { get; set; }
    public string? ReceiverName { get; set; }
    public DateTime SentAt { get; set; }
    public bool IsAccepted { get; set; }
}

}