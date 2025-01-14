using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services;

public interface IBlogService
{
    Task<BlogItemDto> CreateAsync(CreateBlogItemDto dto, int userId);
    Task<BlogItemDto> GetByIdAsync(int id);
    Task<IEnumerable<BlogItemDto>> GetAllAsync();
    Task<BlogItemDto> UpdateAsync(int id, UpdateBlogItemDto dto);
    Task DeleteAsync(int id);
}

public class UpdateBlogItemDto
{
}

public class CreateBlogItemDto
{
}

public class BlogItemDto
{
    public object Id { get; internal set; }
}