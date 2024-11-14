using api.Models.DTO;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        // Send a message
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDTO sendMessageDto)
        {
            if (sendMessageDto == null)
                return BadRequest("Message data is required");

            var message = await _chatService.SendMessageAsync(sendMessageDto);
            return Ok(message);
        }

        // Get messages between two users
        [HttpGet("conversation")]
        public async Task<IActionResult> GetMessagesBetweenUsers([FromQuery] int userId1, [FromQuery] int userId2)
        {
            var messages = await _chatService.GetMessagesBetweenUsersAsync(userId1, userId2);
            return Ok(messages);
        }

        // Mark a message as read
        [HttpPatch("mark-as-read/{messageId}")]
        public async Task<IActionResult> MarkMessageAsRead(int messageId)
        {
            await _chatService.MarkMessageAsReadAsync(messageId);
            return NoContent();
        }
    }
}
