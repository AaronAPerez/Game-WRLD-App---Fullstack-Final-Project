using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO
{
     public class SendMessageDTO
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? Content { get; set; }
    }
}