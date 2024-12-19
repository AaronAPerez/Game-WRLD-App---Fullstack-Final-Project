using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api.Models.DTO;
using api.Services;
using api.Models;
using api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService)
    {
        _chatService = chatService;
    }

     [HttpPost("direct/start")]
    public async Task<ActionResult<DirectMessageDTO>> StartDirectMessage([FromBody] StartDirectMessageRequest request)
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();

        try {
            var conversation = await _chatService.StartDirectMessage(
                int.Parse(userId), 
                request.ReceiverId
            );
            return Ok(conversation);
        }
        catch (Exception ex) {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("direct/{userId}")]
    public async Task<ActionResult<IEnumerable<DirectMessageDTO>>> GetDirectMessages(
        int userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var currentUserId = User.FindFirst("userId")?.Value;
        if (currentUserId == null) return Unauthorized();

        var messages = await _chatService.GetDirectMessages(
            int.Parse(currentUserId),
            userId,
            page,
            pageSize
        );
        return Ok(messages);
    }

     [HttpPost("direct/send")]
    public async Task<ActionResult<DirectMessageDTO>> SendDirectMessage(
        [FromBody] SendDirectMessageDTO request)
    {
        try
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId == null) return Unauthorized();

            var result = await _chatService.SendDirectMessage(
                int.Parse(userId), 
                request
            );
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("rooms")]
    public async Task<ActionResult<IEnumerable<ChatRoomDTO>>> GetChatRooms()
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();

        var rooms = await _chatService.GetChatRooms(int.Parse(userId));
        return Ok(rooms);
    }

    [HttpPost("rooms")]
public async Task<ActionResult<ChatRoomDTO>> CreateChatRoom(CreateChatRoomDTO createRoom)
{
    try
    {
        var userId = User.FindFirst("userId")?.Value;
        if (userId == null) return Unauthorized();

        var newRoom = await _chatService.CreateChatRoom(int.Parse(userId), createRoom);
        return Ok(newRoom);
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}

   [HttpGet("rooms/{id}")]
public async Task<ActionResult<ChatRoomDTO>> GetChatRoom(int id)
{
    var userId = User.FindFirst("userId")?.Value;
    if (userId == null) return Unauthorized();

    try 
    {
        var room = await _chatService.GetChatRoom(int.Parse(userId), id);
        if (room == null) return NotFound();

        var jsonString = JsonSerializer.Serialize(room, new JsonSerializerOptions
        {
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            WriteIndented = true
        });

        return Content(jsonString, "application/json");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in GetChatRoom: {ex.Message}");
        return StatusCode(500, "An error occurred while processing your request.");
    }
}

[HttpGet("rooms/{id}/messages")]
public ActionResult<IEnumerable<ChatMessageDTO>> GetRoomMessages(
    int id,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50)
{
    var userId = User.FindFirst("userId")?.Value;
    if (userId == null) return Unauthorized();

    var result = _chatService.GetRoomMessages(int.Parse(userId), id, page, pageSize);
    return Ok(result);
}

[HttpPost("rooms/{id}/join")]
public async Task<ActionResult> JoinRoom(int id)
{
    var userId = User.FindFirst("userId")?.Value;
    if (userId == null) return Unauthorized();

    var result = await _chatService.JoinRoom(int.Parse(userId), id);
    if (!result) return BadRequest("Failed to join room");

    return Ok();
}

[HttpPost("rooms/{id}/leave")]
public async Task<ActionResult> LeaveRoom(int id)
{
    var userId = User.FindFirst("userId")?.Value;
    if (userId == null) return Unauthorized();

    var result = await _chatService.LeaveRoom(int.Parse(userId), id);
    if (!result) return BadRequest("Failed to leave room");

    return Ok();
}
}