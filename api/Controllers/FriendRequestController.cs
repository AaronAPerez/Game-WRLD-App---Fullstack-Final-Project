using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.Services;
using api.Models.DTO;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendRequestController : ControllerBase
    {
        private readonly FriendRequestService _friendRequestService;

        public FriendRequestController(FriendRequestService friendRequestService)
        {
            _friendRequestService = friendRequestService;
        }

        [HttpPost("send")]
        public async Task<ActionResult> SendFriendRequest([FromBody] SendFriendRequestDTO request)
        {
            var result = await _friendRequestService.SendFriendRequest(request.SenderId, request.ReceiverId);
            if (result != null)
            {
                return Ok("Friend request sent successfully.");
            }
            return BadRequest("Failed to send friend request.");
        }

        [HttpPost("accept/{id}")]
        public async Task<ActionResult> AcceptFriendRequest(int id)
        {
            var result = await _friendRequestService.AcceptFriendRequest(id);
            if (result)
            {
                return Ok("Friend request accepted.");
            }
            return NotFound("Friend request not found or already processed.");
        }

        [HttpPost("reject/{id}")]
        public async Task<ActionResult> RejectFriendRequest(int id)
        {
            var result = await _friendRequestService.RejectFriendRequest(id);
            if (result)
            {
                return Ok("Friend request rejected.");
            }
            return NotFound("Friend request not found.");
        }

        [HttpGet("pending/{userId}")]
        public async Task<ActionResult<IEnumerable<FriendRequestModel>>> GetPendingRequests(int userId)
        {
            var requests = await _friendRequestService.GetPendingRequests(userId);
            if (requests != null && requests.Any())
            {
                return Ok(requests);
            }
            return NotFound("No pending friend requests.");
        }

        [HttpGet("friends/{userId}")]
        public async Task<ActionResult<IEnumerable<FriendsModel>>> GetFriends(int userId)
        {
            var friends = await _friendRequestService.GetFriends(userId);
            if (friends != null && friends.Any())
            {
                return Ok(friends);
            }
            return NotFound("No friends found.");
        }
    }
}
