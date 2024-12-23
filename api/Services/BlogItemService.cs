using api.Models;
using api.Services.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class BlogItemService
{
    private readonly DataContext _context;

    public BlogItemService(DataContext context)
    {
        _context = context;
    }
    
    public async Task<(bool success, string message)> AddBlogItems(BlogItemModel newBlogItem)
        {
        try
        {
            // Validate user exists
            var user = await _context.UserInfo.FindAsync(newBlogItem.UserId);
            if (user == null)
            {
                return (false, $"User with ID {newBlogItem.UserId} does not exist");
            }

            // Set default values 
            newBlogItem.IsDeleted = false;
            newBlogItem.Date = DateTime.UtcNow.ToString("yyyy-MM-dd");
            
            await _context.BlogInfo.AddAsync(newBlogItem);
            await _context.SaveChangesAsync();
            
            return (true, "Blog item added successfully");
        }
        catch (Exception ex)
        {
            // Log the error
            return (false, $"Error adding blog item: {ex.Message}");
        }
    }


    public async Task<bool> DeleteBlogItem(int userId, int blogId)
    {
        try
        {
            // Find the blog item and include user information
            var blogItem = await _context.BlogInfo
                .FirstOrDefaultAsync(b => b.Id == blogId && !b.IsDeleted);

            if (blogItem == null)
            {
                return false;
            }

            // Verify user ownership
            if (blogItem.UserId != userId)
            {
                return false;
            }

            // Soft delete
            blogItem.IsDeleted = true;

            // Save changes
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error in DeleteBlogItem: {ex.Message}");
            return false;
        }
    }


    public IEnumerable<BlogItemModel> GetAllBlogItems()
    {
        return _context.BlogInfo;
    }

    public IEnumerable<BlogItemModel> GetItemByCategory(string category)
    {
        return _context.BlogInfo.Where(item => item.Category == category);
    }
    

    public IEnumerable<BlogItemModel> GetItemsByDate(string date)
    {
        try
        {
            // First validate the date string
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                throw new ArgumentException("Invalid date format. Please use yyyy-MM-dd format.", nameof(date));
            }

            // Format the parsed date to match your date string format
            string formattedDate = parsedDate.ToString("yyyy-MM-dd");

            // Query the database for blog items matching the date
            var blogItems = _context.BlogInfo
                .Where(blog => 
                    !blog.IsDeleted && 
                    blog.Date == formattedDate)
                .OrderByDescending(blog => blog.Id)
                .ToList();

            return blogItems;
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error in GetItemsByDate: {ex.Message}");
            return Enumerable.Empty<BlogItemModel>();
        }
    }

    public List<BlogItemModel> GetItemsByTag(string Tag)
    {
        List<BlogItemModel> AllBlogsWithTag = new List<BlogItemModel>();
        var allItems = GetAllBlogItems().ToList();
        for(int i = 0; i < allItems.Count; i++)
        {
            BlogItemModel Item = allItems[i];
            BlogItemModel item = Item;
            var itemArr = item.Tag.Split(',');
            for(int j = 0; j < itemArr.Length; j++)
            {
                if(itemArr[j].Contains(Tag))
                {
                    AllBlogsWithTag.Add(Item);
                    break;
                }
            }
        }
        return AllBlogsWithTag;

    }

    public bool UpdateBlogItems(BlogItemModel blogUpdate)
    {
        _context.Update<BlogItemModel>(blogUpdate);
            return _context.SaveChanges() !=0;
    }

    public IEnumerable<BlogItemModel> GetItemsByUserId(int userId)
    {
        return _context.BlogInfo.Where(item => item.UserId == userId
        && item.IsDeleted == false);
    }


    public IEnumerable<BlogItemModel> GetPublishedItems()
    {
        return _context.BlogInfo.Where(item => item.IsPublished && item.IsDeleted == false);
    }


}