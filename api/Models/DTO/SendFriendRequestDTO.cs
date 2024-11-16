using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO
{
    public class SendFriendRequestDTO
{
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
}
}