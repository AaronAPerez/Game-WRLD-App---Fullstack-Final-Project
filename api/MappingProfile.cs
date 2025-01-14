using api.Models;
using api.Services;
using AutoMapper;

namespace api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<BlogItemModel, BlogItemDto>();
            CreateMap<CreateBlogItemDto, BlogItemModel>();
            // Add other mappings as needed
        }
    }
}