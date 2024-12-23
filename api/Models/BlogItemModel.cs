using System.ComponentModel.DataAnnotations;

public class BlogItemModel
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    [Required(ErrorMessage = "Publisher name is required")]
    [StringLength(100)]
    public string? PublisherName { get; set; }
    
    [StringLength(50)]
    public string? Tag { get; set; }
    
    [Required(ErrorMessage = "Title is required")]
    [StringLength(200, MinimumLength = 3)]
    public string? Title { get; set; }
    

    [StringLength(2000)]  // Allow long URLs
    [RegularExpression(@"^.*\.(jpg|jpeg|png|gif|bmp|webp)$", 
        ErrorMessage = "Image URL must end with a valid image extension (.jpg, .jpeg, .png, .gif, .bmp, .webp)")]
    public string? Image { get; set; }
    
    [Required(ErrorMessage = "Description is required")]
    [StringLength(5000)]
    public string? Description { get; set; }
    
    [Required]
    public string? Date { get; set; }
    
    [Required(ErrorMessage = "Category is required")]
    [StringLength(50)]
    public string? Category { get; set; }
    
    public bool IsPublished { get; set; }
    public bool IsDeleted { get; set; }
}


