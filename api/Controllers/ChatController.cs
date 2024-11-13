using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(ApplicationDbContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<ActionResult<Chat>> CreateChat(CreateChatDto dto)
    {
        var chat = new Chat
        {
            Name = dto.Name,
            IsGroupChat = dto.IsGroupChat,
            Participants = await _context.Users
                .Where(u => dto.ParticipantIds.Contains(u.Id))
                .ToListAsync()
        };

        _context.Chats.Add(chat);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetChat), new { id = chat.Id }, chat);
    }

    [HttpPost("{chatId}/messages")]
    public async Task<ActionResult<Message>> SendMessage(int chatId, SendMessageDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var message = new Message
        {
            Content = dto.Content,
            UserId = userId,
            ChatId = chatId
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.Group($"chat_{chatId}")
            .SendAsync("ReceiveMessage", message);

        return Ok(message);
    }
}
}