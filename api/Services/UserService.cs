using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using api.Models;
using api.Models.DTO;
using api.Services.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace api.Services;

public class UserService : ControllerBase
{
    private readonly DataContext _context;
    private readonly IConfiguration _config;

    public UserService(DataContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    //helper functions to help us chekc if the user exist
    //DoesUserExist
    public bool DoesUserExist(string username)
    {
        //check our tables to see if the user name exist
      return _context.UserInfo.SingleOrDefault(user => user.Username == username) != null;
        //if one item matches our condition that item will be returned
        //if no items matches it will return null
        //if multiple items match it will return an error
    }


//adding user logic
    public bool AddUser(CreateAccountDTO userToAdd)
    {
        bool result = false;
        //if the user already exist
        if(!DoesUserExist(userToAdd.Username))
        {
           UserModel User = new UserModel();

           UserModel newUser = new UserModel();

            var newHashedPassword = HashPassword(userToAdd.Password);

            newUser.Id = userToAdd.Id;
            newUser.Username = userToAdd.Username;
            newUser.Salt =  newHashedPassword.Salt;
            newUser.Hash = newHashedPassword.Hash;

            _context.Add(newUser);

            result  =  _context.SaveChanges() != 0;


 





        }
        //if the do not exist we add an account
        return result;
        //Else throw a false
    }

    public PasswordDTO HashPassword(string password)
    {
        //create a password DTO this is what will returned
        //New instance of our PasswordDTO
      PasswordDTO newHashedPassword = new PasswordDTO();
      //create a new instance or byte 64 array and save it to Saltbytes
       byte[] SaltBytes = new byte[64];
       //RNGCryptoServiceProvider creates random number
       var provider = new RNGCryptoServiceProvider();
       //now here we are going to get rid of the zeros
       provider.GetNonZeroBytes(SaltBytes); 
       //create a variable for our Salt. This will take our 64 string and encrypt it for us
       var Salt = Convert.ToBase64String(SaltBytes);
       //Now lets create our Hash. first arg is password,bytes, iterations
       var Rfc2898DeriveBytes = new Rfc2898DeriveBytes(password, SaltBytes,10000);
       var Hash = Convert.ToBase64String(Rfc2898DeriveBytes.GetBytes(256));
       
       newHashedPassword.Salt = Salt;
       newHashedPassword.Hash = Hash;

       return newHashedPassword;


    }

    //function to very user password
    public bool VerifyUserPassword(string? Password, string?StoredHash, string? StoredSalt)
        {
        var SaltBytes = Convert.FromBase64String(StoredSalt);
        var rfc2898DeriveBytes = new Rfc2898DeriveBytes(Password,SaltBytes, 10000);
        var newHash = Convert.ToBase64String(rfc2898DeriveBytes.GetBytes(256));

        return newHash == StoredHash;
    }

    public IEnumerable<UserModel> GetAllUsers()
    {
       return _context.UserInfo;
    }

    public IActionResult Login(LoginDTO user)
    {
        IActionResult Result = Unauthorized();
        if(DoesUserExist(user.UserName))
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("letsaddmorereallylongkeysuperSecretKey@345"));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "https://localhost:5173",
                audience: "https://localhost:5173",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            Result = Ok(new { Token = tokenString });

        }
        return Result;
    }

    public UserIdDTO GetUserIdDTOByUserName(string username)
    {
        var UserInfo = new UserIdDTO();
        var foundUser = _context.UserInfo.SingleOrDefault(user => user.Username == username);
        UserInfo.UserId = foundUser.Id;
        UserInfo.PublisherName = foundUser.Username;

        return UserInfo;
    }

    public UserModel GetUserByUsername(string? username)
    {
        return _context.UserInfo.SingleOrDefault(user => user.Username == username);
    }

    public bool DeleteUser(string userToDelete)
        {
        //send over our username
        UserModel foundUser = GetUserByUsername(userToDelete);
        bool result = false;
        if(foundUser != null)
        {
            foundUser.Username = userToDelete;
            _context.Remove<UserModel>(foundUser);
            result = _context.SaveChanges() != 0;
    }
        return result;
        //get teh object and update
        
    }

    public UserModel GetUserById(int id)
    {
        return _context.UserInfo.SingleOrDefault(user => user.Id == id);
    }

    public bool UpdateUser(int id, string username)
    {
       UserModel foundUser = GetUserById(id);
       bool result = false;
       if(foundUser != null)
       {
        foundUser.Username = username;
        _context.Update<UserModel>(foundUser);
        result = _context.SaveChanges() !=0;
       }
       return result;
    }
  public UserProfileDTO GetUserProfile(int userId)
    {
        var user = _context.UserInfo
            .Include(u => u.FriendshipsInitiated)
            .Include(u => u.FriendshipsReceived)
            .Include(u => u.UserGames)
            .FirstOrDefault(u => u.Id == userId);

        if (user == null) throw new Exception("User not found");

        return new UserProfileDTO
        {
            Id = user.Id,
            Username = user.Username,
            Avatar = user.Avatar,
            Status = user.Status,
            LastActive = user.LastActive,
            FriendsCount = GetFriendsCount(user),
            GamesCount = user.UserGames?.Count ?? 0
        };
    }

    public bool UpdateProfile(int userId, UpdateUserProfileDTO updateProfile)
    {
        var user = _context.UserInfo.Find(userId);
        if (user == null) return false;

        if (updateProfile.Username != null)
            user.Username = updateProfile.Username;
        
        if (updateProfile.Avatar != null)
            user.Avatar = updateProfile.Avatar;

        user.LastActive = DateTime.UtcNow;
        
        return _context.SaveChanges() > 0;
    }

    public bool SendFriendRequest(int requesterId, int addresseeId)
    {
        if (requesterId == addresseeId) return false;

        var existingRequest = _context.Friends
            .FirstOrDefault(f => 
                (f.RequesterId == requesterId && f.AddresseeId == addresseeId) ||
                (f.RequesterId == addresseeId && f.AddresseeId == requesterId));

        if (existingRequest != null) return false;

        var friendRequest = new FriendModel
        {
            RequesterId = requesterId,
            AddresseeId = addresseeId
        };

        _context.Friends.Add(friendRequest);
        return _context.SaveChanges() > 0;
    }

    public bool RespondToFriendRequest(int userId, int requestId, bool accept)
    {
        var request = _context.Friends
            .FirstOrDefault(f => f.Id == requestId && f.AddresseeId == userId);

        if (request == null) return false;

        if (accept)
        {
            request.Status = "accepted";
            request.AcceptedAt = DateTime.UtcNow;
        }
        else
        {
            _context.Friends.Remove(request);
        }

        return _context.SaveChanges() > 0;
    }

    public IEnumerable<UserProfileDTO> GetFriends(int userId)
    {
        var friendships = _context.Friends
            .Include(f => f.Requester)
            .Include(f => f.Addressee)
            .Where(f => 
                (f.RequesterId == userId || f.AddresseeId == userId) && 
                f.Status == "accepted")
            .ToList();

        return friendships.Select(f =>
        {
            var friend = f.RequesterId == userId ? f.Addressee : f.Requester;
            return new UserProfileDTO
            {
                Id = friend.Id,
                Username = friend.Username,
                Avatar = friend.Avatar,
                Status = friend.Status,
                LastActive = friend.LastActive,
                FriendsCount = GetFriendsCount(friend),
                GamesCount = friend.UserGames?.Count ?? 0
            };
        });
    }

    private int GetFriendsCount(UserModel user)
    {
        return _context.Friends.Count(f => 
            (f.RequesterId == user.Id || f.AddresseeId == user.Id) && 
            f.Status == "accepted");
    }

    public bool AddUserGame(int userId, UserGameDTO gameDto)
    {
        var existingGame = _context.UserGames
            .FirstOrDefault(ug => ug.UserId == userId && ug.GameId == gameDto.GameId);

        if (existingGame != null)
        {
            existingGame.IsFavorite = gameDto.IsFavorite;
        }
        else
        {
            _context.UserGames.Add(new UserGameModel
            {
                UserId = userId,
                GameId = gameDto.GameId,
                IsFavorite = gameDto.IsFavorite,
                AddedAt = DateTime.UtcNow
            });
        }

        return _context.SaveChanges() > 0;
    }

    public IEnumerable<UserGameDTO> GetUserGames(int userId)
    {
        return _context.UserGames
            .Where(ug => ug.UserId == userId)
            .Select(ug => new UserGameDTO
            {
                GameId = ug.GameId,
                IsFavorite = ug.IsFavorite
            });
    }
}