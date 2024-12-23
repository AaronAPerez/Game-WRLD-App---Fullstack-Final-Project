using api.Models.DTO;

namespace api.Interfaces;

public interface IUserService 
{
    Task<IEnumerable<UserProfileDTO>> GetFriends(int userId);
    Task<object> GetFriendRequests(int userId);
  
}