using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly BlogItemService _data;
    private readonly IMapper _mapper;

    public BlogController(BlogItemService dataFromService, IBlogService blogService, IMapper mapper)
    {
        _data = dataFromService;
        _blogService = blogService;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<ActionResult<BlogItemDto>> Create(CreateBlogItemDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var result = await _blogService.CreateAsync(dto, int.Parse(userId));

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    private object GetById()
    {
        throw new NotImplementedException();
    }

    [HttpPost("AddBlogItems")]

    public bool AddBlogItems(BlogItemModel newBlogItem)
    {
        return _data.AddBlogItems(newBlogItem);
    }

    //GetAllBlogItems 
    [HttpGet("GetBlogItems")]

    public IEnumerable<BlogItemModel> GetAllBlogItems()
    {
        return _data.GetAllBlogItems();
    }

    //GetBlogItemsByCategory
    [HttpGet("GetBlogItemByCategory/{Category}")]
    public IEnumerable<BlogItemModel> GetItemByCategory(string Category)
    {
        return _data.GetItemByCategory(Category);
    }

    //GetItemsByTags

    [HttpGet("GetItemsByTag/{Tag}")]
    public List<BlogItemModel> GetItemsByTag(string Tag)
    {
        return _data.GetItemsByTag(Tag);
    }

    //GetBlogItemsByDate

    [HttpGet("GetItemsByDate/{Date}")]

    public IEnumerable<BlogItemModel> GetItemsByDate(string Date)
    {
        return _data.GetItemsByDate(Date);
    }

    //UpdateBlogItems
    [HttpPost("UpdateBlogItems")]
    public bool UpdateBlogItems(BlogItemModel BlogUpdate)
    {
        return _data.UpdateBlogItems(BlogUpdate);
    }

    //DeleteBlogItems
    [HttpPost("DeleteBlogItem/{BlogDelete}")]
    public bool DeleteBlogItem(BlogItemModel BlogDelete)
    {
        return _data.DeleteBlogItem(BlogDelete);
    }

    //WE need a GetItemsByUserId 
    [HttpGet("GetItemsByUserId/{UserId}")]

    public IEnumerable<BlogItemModel> GetItemsByUserId(int UserId)
    {
        return _data.GetItemsByUserId(UserId);
    }

    [HttpGet("GetPublishedItems")]
    public IEnumerable<BlogItemModel> GetPublishedItems()
    {
        return _data.GetPublishedItems();
    }
}


