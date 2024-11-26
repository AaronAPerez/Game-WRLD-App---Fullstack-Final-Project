using api.Models;
using api.Models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Services
{
    public interface IChatService
    {
        Task<MessageDTO> SendMessageAsync(SendMessageDTO sendMessageDto);
        Task<IEnumerable<MessageDTO>> GetMessagesBetweenUsersAsync(int userId1, int userId2);
        Task MarkMessageAsReadAsync(int messageId);
    }
}
