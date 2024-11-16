using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO
{
    public class FriendDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public int FriendId { get; set; }
    public string? FriendName { get; set; }
    public DateTime CreatedAt { get; set; }
}

}