using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models;

public class Like
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }

    public BlogItemModel Post { get; set; }
    public UserModel User { get; set; }
}