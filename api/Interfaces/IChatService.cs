using api.Models.DTO;

namespace api.Interfaces
{
    public interface IChatService
    {
        Task<DirectMessageDTO> StartDirectMessage(int senderId, int receiverId);
        Task<IEnumerable<DirectMessageDTO>> GetDirectMessages(int senderId, int receiverId, int page, int pageSize);
        Task<DirectMessageDTO> SendDirectMessage(int senderId, int receiverId, string content);
        
        // Add other existing methods
        Task<IEnumerable<ChatRoomDTO>> GetChatRooms(int userId);
        Task<ChatRoomDTO> GetChatRoom(int userId, int roomId);
        Task<IEnumerable<ChatMessageDTO>> GetRoomMessages(int userId, int roomId, int page, int pageSize);
        Task<bool> JoinRoom(int userId, int roomId);
        Task<bool> LeaveRoom(int userId, int roomId);
    }
}