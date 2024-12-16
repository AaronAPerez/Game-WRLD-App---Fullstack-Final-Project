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
        _userService = userService ?? throw new ArgumentNullException(nameof(userService));
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
public async Task<IActionResult> GetUserIdDTOByUserName(string username)
{
    try
    {
        var userIdDTO = await _userService.GetUserIdDTOByUserName(username);
        return Ok(userIdDTO);  
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred", details = ex.Message });
    }
}

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginDTO User)
    {
        return _userService.Login(User);
    }

    [Authorize]
    [HttpGet("Profile")]
    public async Task<ActionResult<UserProfileDTO>> GetUserProfile()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var profile = await _userService.GetUserProfile(int.Parse(userId));
        return Ok(profile);
    }

    [Authorize]
    [HttpPut("Profile")]
    public async Task<ActionResult<bool>> UpdateProfile([FromBody] UpdateUserProfileDTO updateProfile)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = await _userService.UpdateProfile(int.Parse(userId), updateProfile);
        return Ok(result);
    }

    [Authorize]
[HttpPost("Friends/Request")]
public async Task<ActionResult<bool>> SendFriendRequest([FromBody] FriendRequestDTO request)
{
    var userId = User.FindFirst("userId")?.Value;
    if (userId == null) return Unauthorized();
    
    // Look up the AddresseeId using the provided username
    var addressee = await _userService.GetUserIdDTOByUserName(request.AddresseeName);
    if (addressee == null)
    {
        return NotFound(new { message = "User not found" });
    }

    // Send the friend request using the userId and AddresseeId
    var result = await _userService.SendFriendRequest(int.Parse(userId), addressee.UserId);
    return Ok(result);
}

    [Authorize]
    [HttpPost("Friends/Respond")]
    public async Task<ActionResult<bool>> RespondToFriendRequest([FromBody] FriendResponseDTO response)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = await _userService.RespondToFriendRequest(int.Parse(userId), response.RequestId, response.Accept);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("Friends")]
    public async Task<ActionResult<IEnumerable<UserProfileDTO>>> GetFriends()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            IEnumerable<UserProfileDTO> friends = await _userService.GetFriends(int.Parse(userId));
            return Ok(friends);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("Friends/Requests")]
    public async Task<ActionResult<object>> GetFriendRequests()
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            var requests = await _userService.GetFriendRequests(int.Parse(userId));
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("Games")]
    public async Task<ActionResult<bool>> AddUserGame([FromBody] UserGameDTO gameDto)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var result = await _userService.AddUserGame(int.Parse(userId), gameDto);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("Games")]
    public async Task<ActionResult<IEnumerable<UserGameDTO>>> GetUserGames()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();
        
        var games = await _userService.GetUserGames(int.Parse(userId));
        return Ok(games);
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<UserProfileDTO>>> SearchUsers([FromQuery] string query)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();

        if (string.IsNullOrWhiteSpace(query))
            return Ok(Array.Empty<UserProfileDTO>());

        var results = await _userService.SearchUsers(int.Parse(userId), query);
        return Ok(results);
    }
}

public class FriendResponseDTO
{
    internal bool Accept;

    public int RequestId { get; internal set; }
}