using api.Models;
using api.Models.DTO;
using api.Services.Context;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Services
{
    public class ChatService : IChatService
    {
        private readonly DataContext _context;

        public ChatService(DataContext context)
        {
            _context = context;
        }

        public async Task<MessageDTO> SendMessageAsync(SendMessageDTO sendMessageDto)
        {
            var message = new Message
            {
                SenderId = sendMessageDto.SenderId,
                ReceiverId = sendMessageDto.ReceiverId,
                Content = sendMessageDto.Content,
                Timestamp = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return new MessageDTO
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsRead = message.IsRead
            };
        }

        public async Task<IEnumerable<MessageDTO>> GetMessagesBetweenUsersAsync(int userId1, int userId2)
        {
            return await _context.Messages
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2) ||
                            (m.SenderId == userId2 && m.ReceiverId == userId1))
                .OrderBy(m => m.Timestamp)
                .Select(m => new MessageDTO
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead
                })
                .ToListAsync();
        }

        public async Task MarkMessageAsReadAsync(int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message != null && !message.IsRead)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
