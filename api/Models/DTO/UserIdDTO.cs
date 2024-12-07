using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.DTO;

    public class UserIdDTO
    {
        public int UserId { get; set; }
        public string? PublisherName { get; set; }
    }

    
public class UserProfileDTO
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public string? Status { get; set; }
    public DateTime LastActive { get; set; }
    public int FriendsCount { get; set; }
    public int GamesCount { get; set; }
}

    public class UpdateUserProfileDTO
    {
        public string? Username { get; set; }
        public string? Avatar { get; set; }
    }

    public class FriendRequestDTO
    {
        public int AddresseeId { get; set; }
    }

    public class FriendResponseDTO
    {
        public int RequestId { get; set; }
        public bool Accept { get; set; }
    }

    public class UserGameDTO
    {
        public int GameId { get; set; }
        public bool IsFavorite { get; set; }
    }


