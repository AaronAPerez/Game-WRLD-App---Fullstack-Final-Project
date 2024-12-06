using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Models.DTO;
using api.Services;
using Microsoft.AspNetCore.Authorization;


namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("AddUsers")]
    public bool AddUser(CreateAccountDTO UserToAdd)
    {
        return _userService.AddUser(UserToAdd);
    }

    [HttpGet("GetAllUsers")]
    public IEnumerable<UserModel> GetAllUsers()
    {
        return _userService.GetAllUsers();
    }

    [HttpGet("GetUserByUsername/{username}")]
    public UserIdDTO GetUserIdDTOByUserName(string username)
    {
        return _userService.GetUserIdDTOByUserName(username);
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginDTO User)
    {
        return _userService.Login(User);
    }

    [Authorize]
    [HttpGet("Profile")]
    public ActionResult<UserProfileDTO> GetUserProfile()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var profile = _userService.GetUserProfile(int.Parse(userId));
        return Ok(profile);
    }

    [Authorize]
    [HttpPut("Profile")]
    public ActionResult<bool> UpdateProfile([FromBody] UpdateUserProfileDTO updateProfile)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = _userService.UpdateProfile(int.Parse(userId), updateProfile);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("Friends/Request")]
    public ActionResult<bool> SendFriendRequest([FromBody] FriendRequestDTO request)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = _userService.SendFriendRequest(int.Parse(userId), request.AddresseeId);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("Friends/Respond")]
    public ActionResult<bool> RespondToFriendRequest([FromBody] FriendResponseDTO response)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = _userService.RespondToFriendRequest(int.Parse(userId), response.RequestId, response.Accept);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("Friends")]
    public ActionResult<IEnumerable<UserProfileDTO>> GetFriends()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var friends = _userService.GetFriends(int.Parse(userId));
        return Ok(friends);
    }

    [Authorize]
    [HttpPost("Games")]
    public ActionResult<bool> AddUserGame([FromBody] UserGameDTO gameDto)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = _userService.AddUserGame(int.Parse(userId), gameDto);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("Games")]
    public ActionResult<IEnumerable<UserGameDTO>> GetUserGames()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var games = _userService.GetUserGames(int.Parse(userId));
        return Ok(games);
    }
}