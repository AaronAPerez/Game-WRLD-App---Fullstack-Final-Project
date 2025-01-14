using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO;

public class CreateBlogItemDto
{
    public string Title { get; set; }
    public string Tag { get; set; }
    public string Description { get; set; }
    public string Image { get; set; }
    public string Category { get; set; }
    public bool IsPublished { get; set; }
}