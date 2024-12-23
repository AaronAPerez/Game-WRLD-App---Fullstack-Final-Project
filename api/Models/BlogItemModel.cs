using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;


public class BlogItemModel
{
    public int Id { get; set; }
    
   
    [Required(ErrorMessage = "User ID is required")]
    [ForeignKey("UserInfo")]
    public int UserId { get; set; }


    [Required(ErrorMessage = "Publisher name is required")]
    public string? PublisherName { get; set; }

    public string? Tag { get; set; }

    [Required(ErrorMessage = "Title is required")]
    public string? Title { get; set; }

    public string? Image { get; set; }

    [Required(ErrorMessage = "Description is required")]
    public string? Description { get; set; }

    public string? Date { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public string? Category { get; set; }

    public bool IsPublished { get; set; }
    public bool IsDeleted { get; set; }


    // JsonIgnore to prevent circular references
    [JsonIgnore]
    public virtual UserModel? User { get; set; }

    public BlogItemModel()
    {

    }
}
    




