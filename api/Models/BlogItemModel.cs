using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models;

public class BlogItemModel
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [MaxLength(100)]
    public string PublisherName { get; set; }

    [MaxLength(50)]
    public string Tag { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; }

    [Url]
    public string Image { get; set; }

    [Required]
    public string Description { get; set; }
    public string? Date { get; set; }
    public string? Category { get; set; }
    public bool IsPublished { get; set; }
    public bool IsDeleted { get; set; }

    public BlogItemModel()
    {

    }

}
