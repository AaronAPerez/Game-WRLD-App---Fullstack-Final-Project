using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO
{
    public class FriendRequestDTO
    {
        public int RequestId { get; set; } 
        public int RequesterId { get; set; } 
        public string RequesterName { get; set; } 
        public int AddresseeId { get; set; }
        public string AddresseeName { get; set; } 
        public string Status { get; set; } 
        public DateTime CreatedAt { get; set; } 
    }

}

