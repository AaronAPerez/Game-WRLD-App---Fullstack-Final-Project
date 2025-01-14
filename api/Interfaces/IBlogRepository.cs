

namespace api.Interfaces;
public interface IBlogRepository
{
    Task<BlogItem> CreateAsync(BlogItem item);
    Task<BlogItem> GetByIdAsync(int id);
    Task<IEnumerable<BlogItem>> GetAllAsync();
    Task<BlogItem> UpdateAsync(BlogItem item);
    Task DeleteAsync(int id);
}

public class BlogItem
{
}