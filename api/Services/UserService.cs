using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using api.Models;
using api.Models.DTO;
using api.Services.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace api.Services;

public class UserService : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;
    private readonly PasswordService _passwordService;

    public UserService(DataContext context, IConfiguration config, PasswordService passwordService)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _config = config ?? throw new ArgumentNullException(nameof(config));
        _passwordService = passwordService ?? throw new ArgumentNullException(nameof(passwordService));
    }
    public bool DoesUserExist(string username)
    {
        if (string.IsNullOrEmpty(username) || _context.UserInfo == null)
            return false;

        return _context.UserInfo.Any(user => user.Username == username);
    }

    public bool AddUser(CreateAccountDTO userToAdd)
    {
        if (userToAdd == null ||
            string.IsNullOrEmpty(userToAdd.Username) ||
            string.IsNullOrEmpty(userToAdd.Password) ||
            _context.UserInfo == null)
            return false;

        if (!DoesUserExist(userToAdd.Username))
        {
            var hashedPassword = _passwordService.HashPassword(userToAdd.Password);
            var newUser = new UserModel
            {
                Username = userToAdd.Username,
                Salt = hashedPassword.Salt,
                Hash = hashedPassword.Hash,
                Status = "offline",
                LastActive = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserInfo.Add(newUser);
            return _context.SaveChanges() != 0;
        }
        return false;
    }

    public IActionResult Login([FromBody] LoginDTO user)
    {
        if (_context.UserInfo == null ||
            string.IsNullOrEmpty(user.UserName) ||
            string.IsNullOrEmpty(user.Password))
            return Unauthorized();

        var foundUser = GetUserByUsername(user.UserName);
        if (foundUser == null ||
            string.IsNullOrEmpty(foundUser.Hash) ||
            string.IsNullOrEmpty(foundUser.Salt))
            return Unauthorized();

        if (!_passwordService.VerifyPassword(user.Password, foundUser.Hash, foundUser.Salt))
            return Unauthorized();

        var token = GenerateJwtToken(foundUser);

        foundUser.LastActive = DateTime.UtcNow;
        foundUser.Status = "online";
        _context.SaveChanges();

        return Ok(new
        {
            Token = token,
            UserId = foundUser.Id,
            PublisherName = foundUser.Username
        });
    }

    public IEnumerable<UserModel> GetAllUsers()
    {
        if (_context.UserInfo == null)
            return Enumerable.Empty<UserModel>();

        return _context.UserInfo
            .Where(u => !u.IsDeleted)
            .ToList();
    }

    public async Task<UserIdDTO> GetUserIdDTOByUserName(string username)
    {
        if (_context.UserInfo == null || string.IsNullOrEmpty(username))
            throw new InvalidOperationException("Invalid username or database context");

        var foundUser = await _context.UserInfo
            .Where(u => u.Username == username)
            .Select(u => new UserIdDTO { UserId = u.Id, PublisherName = u.Username ?? string.Empty })
            .FirstOrDefaultAsync();

        if (foundUser == null)
            throw new KeyNotFoundException($"User {username} not found");

        return foundUser;
    }

    public UserModel? GetUserByUsername(string? username)
    {
        if (_context.UserInfo == null || string.IsNullOrEmpty(username))
            return null;

        return _context.UserInfo.FirstOrDefault(u => u.Username == username);
    }

    public UserModel? GetUserById(int id)
    {
        return _context.UserInfo?
            .Include(u => u.UserGames)
            .FirstOrDefault(u => u.Id == id);
    }

    public bool DeleteUser(string userToDelete)
    {
        if (_context.UserInfo == null || string.IsNullOrEmpty(userToDelete))
            return false;

        var foundUser = GetUserByUsername(userToDelete);
        if (foundUser == null) return false;

        foundUser.IsDeleted = true;
        return _context.SaveChanges() != 0;
    }

    public bool UpdateUser(int id, string username)
    {
        if (_context.UserInfo == null || string.IsNullOrEmpty(username))
            return false;

        var foundUser = GetUserById(id);
        if (foundUser == null) return false;

        foundUser.Username = username;
        return _context.SaveChanges() != 0;
    }

    public async Task<bool> UpdateUserStatus(int userId, string status)
    {
        if (_context.UserInfo == null || string.IsNullOrEmpty(status))
            return false;

        var user = await _context.UserInfo.FindAsync(userId);
        if (user == null) return false;

        user.Status = status;
        user.LastActive = DateTime.UtcNow;

        try
        {
            return await _context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException)
        {
            return false;
        }
    }

    public async Task<UserProfileDTO> GetUserProfile(int userId)
{
    var user = await _context.UserInfo!
        .Include(u => u.UserGames)
        .Include(u => u.FriendshipsInitiated)
        .Include(u => u.FriendshipsReceived)
        .FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);

    if (user == null)
        throw new KeyNotFoundException($"User with ID {userId} not found");

    // Populate UserProfileDTO
    var userProfile = new UserProfileDTO
    {
        Id = user.Id,
        Username = user.Username ?? string.Empty,
        Avatar = user.Avatar ?? string.Empty,
        Status = user.Status ?? "offline",
        LastActive = user.LastActive,
        FriendsCount = GetFriendsCount(user),
        GamesCount = user.UserGames?.Count ?? 0
    };

    // Log the UserProfileDTO for debugging
    Console.WriteLine("User Profile DTO: " + JsonConvert.SerializeObject(userProfile));

    return userProfile;
}



    public async Task<bool> UpdateProfile(int userId, UpdateUserProfileDTO updateProfile)
    {
        if (_context.UserInfo == null)
            return false;

        var user = await _context.UserInfo.FindAsync(userId);
        if (user == null)
            return false;

        if (!string.IsNullOrWhiteSpace(updateProfile.Username))
        {
            var existingUser = await _context.UserInfo
                .FirstOrDefaultAsync(u => u.Id != userId && u.Username == updateProfile.Username);
            if (existingUser != null)
                return false;

            user.Username = updateProfile.Username;
        }

        if (!string.IsNullOrWhiteSpace(updateProfile.Avatar))
        {
            user.Avatar = updateProfile.Avatar;
        }

        return await _context.SaveChangesAsync() > 0;
    }

    // Get Friends
    public async Task<IEnumerable<UserProfileDTO>> GetFriends(int userId)
    {
        if (_context.Friends == null || _context.UserInfo == null)
            return Enumerable.Empty<UserProfileDTO>();

        // Get all accepted friend relationships for user
        var friendships = await _context.Friends
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) &&
                        f.Status.ToLower() == "accepted")
            .ToListAsync();

        // Map the friend records to UserProfileDTOs
        var friends = friendships.Select(f =>
        {
            // Get the friend user (either requester or addressee, depending on which one is not the current user)
            var friendUser = f.RequesterId == userId ? f.Addressee : f.Requester;

            return new UserProfileDTO
            {
                Id = friendUser.Id,
                Username = friendUser.Username ?? string.Empty,
                Avatar = friendUser.Avatar ?? string.Empty,
                Status = friendUser.Status ?? "offline",
                LastActive = friendUser.LastActive,
                FriendsCount = _context.Friends.Count(fr =>
                    (fr.RequesterId == friendUser.Id || fr.AddresseeId == friendUser.Id) &&
                    fr.Status.ToLower() == "accepted"),
                GamesCount = friendUser.UserGames?.Count ?? 0
            };
        });

        return friends;
    }


    public async Task<bool> SendFriendRequest(int requesterId, int addresseeId)
    {
        if (_context.Friends == null)
            return false;

        var existingRequest = await _context.Friends
            .FirstOrDefaultAsync(f =>
                (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

        if (existingRequest != null)
            return false;

        var friendRequest = new FriendModel
        {
            RequesterId = requesterId,
            AddresseeId = addresseeId,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Friends.Add(friendRequest);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> RespondToFriendRequest(int userId, int requestId, bool accept)
    {
        if (_context.Friends == null)
            return false;

        var request = await _context.Friends
            .FirstOrDefaultAsync(f => f.Id == requestId && f.AddresseeId == userId);

        if (request == null)
            return false;

        if (accept)
        {
            request.Status = "accepted";
            request.AcceptedAt = DateTime.UtcNow;
        }
        else
        {
            _context.Friends.Remove(request);
        }

        return await _context.SaveChangesAsync() > 0;
    }

    // Handle null Status
    private int GetFriendsCount(UserModel user)
    {
        if (_context.Friends == null)
            return 0;

        return _context.Friends.Count(f =>
            (f.RequesterId == user.Id || f.AddresseeId == user.Id) &&
            (f.Status != null && f.Status.ToLower() == "accepted")
        );
    }

    private string GenerateJwtToken(UserModel user)
    {
        var rawKey = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key not configured");


        var keyBytes = Encoding.UTF8.GetBytes(rawKey);
        var base64Key = Convert.ToBase64String(keyBytes);


        var signingKey = Convert.FromBase64String(base64Key);

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(signingKey),
            SecurityAlgorithms.HmacSha256
        );

        var claims = new List<Claim>
        {
            new Claim("userId", user.Id.ToString()),
            new Claim("username", user.Username ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var tokenOptions = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    }

    public async Task<IEnumerable<UserProfileDTO>> SearchUsers(int v, string query)
    {
        if (_context.UserInfo == null)
            return Enumerable.Empty<UserProfileDTO>();

        // Search users by username, case-insensitive
        var users = await _context.UserInfo
            .Where(u => !u.IsDeleted &&
                       u.Username != null &&
                       u.Username.ToLower().Contains(query.ToLower()))
            .Select(u => new UserProfileDTO
            {
                Id = u.Id,
                Username = u.Username ?? string.Empty,
                Avatar = u.Avatar ?? string.Empty,
                Status = u.Status ?? "offline",
                LastActive = u.LastActive,
                FriendsCount = _context.Friends != null ?
                    _context.Friends.Count(f =>
                        (f.RequesterId == u.Id || f.AddresseeId == u.Id) &&
                        f.Status == "accepted") : 0,
                GamesCount = u.UserGames != null ? u.UserGames.Count : 0
            })
            .Take(10) // Limit results
            .ToListAsync();

        return users;
    }

    public async Task<object> GetFriendRequests(int userId)
    {
        if (_context.Friends == null || _context.UserInfo == null)
            return new { sent = Array.Empty<object>(), received = Array.Empty<object>() };

        // Get sent friend requests
        var sentRequests = await _context.Friends
            .Include(f => f.Addressee)
            .Where(f => f.RequesterId == userId && f.Status == "pending")
            .Select(f => new
            {
                id = f.Id,
                user = new UserProfileDTO
                {
                    Id = f.Addressee.Id,
                    Username = f.Addressee.Username ?? string.Empty,
                    Avatar = f.Addressee.Avatar ?? string.Empty,
                    Status = f.Addressee.Status ?? "offline",
                    LastActive = f.Addressee.LastActive
                },
                createdAt = f.CreatedAt
            })
            .ToListAsync();

        // Get received friend requests
        var receivedRequests = await _context.Friends
            .Include(f => f.Requester)
            .Where(f => f.AddresseeId == userId && f.Status == "pending")
            .Select(f => new
            {
                id = f.Id,
                user = new UserProfileDTO
                {
                    Id = f.Requester.Id,
                    Username = f.Requester.Username ?? string.Empty,
                    Avatar = f.Requester.Avatar ?? string.Empty,
                    Status = f.Requester.Status ?? "offline",
                    LastActive = f.Requester.LastActive
                },
                createdAt = f.CreatedAt
            })
            .ToListAsync();

        return new
        {
            sent = sentRequests,
            received = receivedRequests
        };
    }

    private async Task<bool> AreUsersFriends(int userId1, int userId2)
    {
        if (_context.Friends == null)
            return false;

        return await _context.Friends
            .AnyAsync(f =>
                ((f.RequesterId == userId1 && f.AddresseeId == userId2) ||
                 (f.RequesterId == userId2 && f.AddresseeId == userId1)) &&
                f.Status == "accepted");
    }

    
    public async Task<bool> AddUserGame(int userId, UserGameDTO gameDto)
    {
        if (_context.UserGames == null)
            return false;

        var existingGame = await _context.UserGames
            .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GameId == gameDto.GameId);

        if (existingGame != null)
        {
            existingGame.IsFavorite = gameDto.IsFavorite;
        }
        else
        {
            var userGame = new UserGameModel
            {
                UserId = userId,
                GameId = gameDto.GameId,
                IsFavorite = gameDto.IsFavorite,
                AddedAt = DateTime.UtcNow
            };
            _context.UserGames.Add(userGame);
        }

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<UserGameDTO>> GetUserGames(int userId)
    {
        if (_context.UserGames == null)
            return Enumerable.Empty<UserGameDTO>();

        return await _context.UserGames
            .Where(ug => ug.UserId == userId)
            .Select(ug => new UserGameDTO
            {
                GameId = ug.GameId,
                IsFavorite = ug.IsFavorite
            })
            .ToListAsync();
    }

}

