using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class FriendModel
    {
        public int Id { get; set; }
        public int RequesterId { get; set; }
        public int AddresseeId { get; set; }
        public string Status { get; set; } = "pending"; // Default value 
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }

        public virtual UserModel? Requester { get; set; }
        public virtual UserModel? Addressee { get; set; }

        public FriendModel()
        {
            CreatedAt = DateTime.UtcNow;
            Status = "pending"; // Ensure Status is initialized
        }
    }
}