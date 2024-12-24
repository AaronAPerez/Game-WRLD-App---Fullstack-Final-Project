using api.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    //  Field name Blog to match constructor
    private readonly BlogItemService _blogService; 
 

    public BlogController(BlogItemService blogService)
    {
        _blogService  = blogService;
    }

    [HttpPost("AddBlogItems")]
    public async Task<IActionResult> AddBlogItems(BlogItemModel newBlogItem)
    {
        if (newBlogItem == null)
        {
            return BadRequest("Blog item data is required");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var (success, message) = await _blogService.AddBlogItems(newBlogItem);
        
        if (!success)
        {
            return BadRequest(message);
        }
        
        return Ok(new { message });
    }

    [HttpGet("GetBlogItems")]
    public IEnumerable<BlogItemModel> GetAllBlogItems()
    {
        return _blogService.GetAllBlogItems(); 
    }

    
    [HttpGet("GetBlogItemByCategory/{Category}")]
    public IEnumerable<BlogItemModel> GetItemByCategory(string Category)
    {
        return _blogService.GetItemByCategory(Category);
    }

 
    // GetBlogItemsByDate
    [HttpGet("GetItemsByDate/{Date}")]
    public IActionResult GetItemsByDate(string Date)
    {
        try
        {
            var items = _blogService.GetItemsByDate(Date);
            
            if (!items.Any())
            {
                return NotFound($"No blog items found for date: {Date}");
            }

            return Ok(items);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while retrieving blog items");
        }
    }

    [HttpGet("GetItemsByUserId/{UserId}")]
    public IEnumerable<BlogItemModel> GetItemsByUserId(int UserId)
    {
        return _blogService.GetItemsByUserId(UserId);
    }


    //GetItemsByTags

    [HttpGet("GetItemsByTag/{Tag}")]
    public List<BlogItemModel> GetItemsByTag(string Tag)
    {
        return _blogService.GetItemsByTag(Tag);
    }


    //UpdateBlogItems
    [HttpPost("UpdateBlogItems")]
    public bool UpdateBlogItems(BlogItemModel BlogUpdate)
    {
        return _blogService.UpdateBlogItems(BlogUpdate);
    }

    
    // DeleteBlogItem
    [HttpPost("DeleteBlogItem/{userId}/{blogId}")]
    public async Task<IActionResult> DeleteBlogItem(int userId, int blogId)
    {
        if (userId <= 0 || blogId <= 0)
        {
            return BadRequest("Invalid user ID or blog ID");
        }

        var result = await _blogService.DeleteBlogItem(userId, blogId);

        if (!result)
        {
            return NotFound("Blog item not found or you don't have permission to delete it");
        }

        return Ok(new { message = "Blog item deleted successfully" });
    }

    [HttpGet("GetPublishedItems")]
    public IEnumerable<BlogItemModel> GetPublishedItems()
    {
        return _blogService.GetPublishedItems();
    }
}

