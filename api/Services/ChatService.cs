using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Models.DTO;
using api.Services.Context;

namespace api.Services
{
public class ChatService
{
    private readonly DataContext _context;
    private readonly UserService _userService;

    public ChatService(DataContext context, UserService userService)
    {
        _context = context;
        _userService = userService;
    }

    public async Task<DirectMessageDTO> StartDirectMessage(int senderId, int receiverId)
    {
        if (_context.DirectMessages == null)
            throw new InvalidOperationException("DirectMessages DbSet is null");

        // Find users
        var sender = await _context.UserInfo!.FindAsync(senderId);
        var receiver = await _context.UserInfo!.FindAsync(receiverId);

        if (sender == null || receiver == null)
            throw new InvalidOperationException("Sender or receiver not found");

        // Create new direct message
        var directMessageModel = new DirectMessageModel
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Content = "Chat started",
            MessageType = "text",
            SentAt = DateTime.UtcNow,
            IsRead = false,
            IsEdited = false,
            IsDeleted = false
        };

        _context.DirectMessages.Add(directMessageModel);
        await _context.SaveChangesAsync();

        // Convert to DTO
        var directMessageDTO = new DirectMessageDTO
        {
            Id = directMessageModel.Id,
            Content = directMessageModel.Content,
            MessageType = directMessageModel.MessageType,
            SentAt = directMessageModel.SentAt,
            IsRead = directMessageModel.IsRead,
            IsEdited = directMessageModel.IsEdited,
            Sender = new UserProfileDTO
            {
                Id = sender.Id,
                Username = sender.Username ?? string.Empty,
                Avatar = sender.Avatar ?? string.Empty,
                Status = sender.Status ?? "offline",
                LastActive = sender.LastActive
            },
            Receiver = new UserProfileDTO
            {
                Id = receiver.Id,
                Username = receiver.Username ?? string.Empty,
                Avatar = receiver.Avatar ?? string.Empty,
                Status = receiver.Status ?? "offline",
                LastActive = receiver.LastActive
            }
        };

        return directMessageDTO;
    }

    // Helper method to convert between Model and DTO
    private DirectMessageDTO ConvertToDTO(DirectMessageModel model, UserModel sender, UserModel receiver)
    {
        return new DirectMessageDTO
        {
            Id = model.Id,
            Content = model.Content,
            MessageType = model.MessageType,
            SentAt = model.SentAt,
            IsRead = model.IsRead,
            IsEdited = model.IsEdited,
            Sender = new UserProfileDTO
            {
                Id = sender.Id,
                Username = sender.Username ?? string.Empty,
                Avatar = sender.Avatar ?? string.Empty,
                Status = sender.Status ?? "offline",
                LastActive = sender.LastActive
            },
            Receiver = new UserProfileDTO
            {
                Id = receiver.Id,
                Username = receiver.Username ?? string.Empty,
                Avatar = receiver.Avatar ?? string.Empty,
                Status = receiver.Status ?? "offline",
                LastActive = receiver.LastActive
            }
        };
    }

    public async Task<IEnumerable<ChatRoomDTO>> GetChatRooms(int userId)
    {
        if (_context.ChatRooms == null)
            return Enumerable.Empty<ChatRoomDTO>();

        var rooms = await _context.ChatRooms
            .Include(r => r.Creator)
            .Include(r => r.Members)
            .Where(r => !r.IsDeleted &&
                (r.Members.Any(m => m.UserId == userId) || !r.IsPrivate))
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ChatRoomDTO
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Image = r.Image,
                MembersCount = r.Members.Count,
                CreatedAt = r.CreatedAt,
                Creator = new UserProfileDTO
                {
                    Id = r.Creator.Id,
                    Username = r.Creator.Username ?? string.Empty,
                    Avatar = r.Creator.Avatar ?? string.Empty,
                    Status = r.Creator.Status ?? "offline",
                    LastActive = r.Creator.LastActive
                },
                IsPrivate = r.IsPrivate
            })
            .ToListAsync();

        return rooms;
    }

    public async Task<ChatRoomDTO> CreateChatRoom(int userId, CreateChatRoomDTO createRoom)
    {
        if (_context.ChatRooms == null)
            throw new InvalidOperationException("ChatRooms DbSet is null");

        var room = new ChatRoomModel
        {
            Name = createRoom.Name ?? string.Empty,
            Description = createRoom.Description ?? string.Empty,
            Image = createRoom.Image ?? string.Empty,
            CreatorId = userId,
            IsPrivate = createRoom.IsPrivate,
            CreatedAt = DateTime.UtcNow
        };

        _context.ChatRooms.Add(room);
        await _context.SaveChangesAsync();

        // Add creator as first member
        var membership = new ChatRoomMemberModel
        {
            ChatRoomId = room.Id,
            UserId = userId,
            Role = "admin",
            JoinedAt = DateTime.UtcNow
        };

        _context.ChatRoomMembers?.Add(membership);
        await _context.SaveChangesAsync();

        var creator = await _userService.GetUserProfile(userId);

        return new ChatRoomDTO
        {
            Id = room.Id,
            Name = room.Name,
            Description = room.Description,
            Image = room.Image,
            MembersCount = 1,
            CreatedAt = room.CreatedAt,
            Creator = creator,
            IsPrivate = room.IsPrivate
        };
    }

    public async Task<ChatRoomDTO?> GetChatRoom(int userId, int roomId)
    {
        if (_context.ChatRooms == null)
            return null;

        var room = await _context.ChatRooms
            .Include(r => r.Creator)
            .Include(r => r.Members)
            .FirstOrDefaultAsync(r => r.Id == roomId && !r.IsDeleted);

        if (room == null || (room.IsPrivate && !room.Members.Any(m => m.UserId == userId)))
            return null;

        var creator = await _userService.GetUserProfile(room.CreatorId);

        return new ChatRoomDTO
        {
            Id = room.Id,
            Name = room.Name,
            Description = room.Description,
            Image = room.Image,
            MembersCount = room.Members.Count,
            CreatedAt = room.CreatedAt,
            Creator = creator,
            IsPrivate = room.IsPrivate
        };
    }

    public async Task<IEnumerable<ChatMessageDTO>> GetRoomMessages(int userId, int roomId, int page = 1, int pageSize = 50)
    {
        if (_context.ChatMessages == null)
            return Enumerable.Empty<ChatMessageDTO>();

        var messages = await _context.ChatMessages
            .Include(m => m.Sender)
            .Where(m => m.ChatRoomId == roomId && !m.IsDeleted)
            .OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new ChatMessageDTO
            {
                Id = m.Id,
                ChatRoomId = m.ChatRoomId,
                Content = m.Content,
                MessageType = m.MessageType,
                SentAt = m.SentAt,
                IsEdited = m.IsEdited,
                Sender = new UserProfileDTO
                {
                    Id = m.Sender.Id,
                    Username = m.Sender.Username ?? string.Empty,
                    Avatar = m.Sender.Avatar ?? string.Empty,
                    Status = m.Sender.Status ?? "offline",
                    LastActive = m.Sender.LastActive
                }
            })
            .ToListAsync();

        return messages;
    }

      public async Task<IEnumerable<DirectMessageDTO>> GetDirectMessages(int senderId, int receiverId, int page, int pageSize)
    {
        if (_context.DirectMessages == null)
            return Enumerable.Empty<DirectMessageDTO>();

        var messages = await _context.DirectMessages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => !m.IsDeleted &&
                ((m.SenderId == senderId && m.ReceiverId == receiverId) ||
                 (m.SenderId == receiverId && m.ReceiverId == senderId)))
            .OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new DirectMessageDTO
            {
                Id = m.Id,
                Content = m.Content,
                MessageType = m.MessageType,
                SentAt = m.SentAt,
                IsRead = m.IsRead,
                IsEdited = m.IsEdited,
                Sender = new UserProfileDTO
                {
                    Id = m.Sender.Id,
                    Username = m.Sender.Username ?? string.Empty,
                    Avatar = m.Sender.Avatar ?? string.Empty,
                    Status = m.Sender.Status ?? "offline"
                },
                Receiver = new UserProfileDTO
                {
                    Id = m.Receiver.Id,
                    Username = m.Receiver.Username ?? string.Empty,
                    Avatar = m.Receiver.Avatar ?? string.Empty,
                    Status = m.Receiver.Status ?? "offline"
                }
            })
            .ToListAsync();

        return messages;
    }


     // Mark multiple messages as read
    public async Task MarkMessagesAsRead(List<int> messageIds, int userId)
    {
        if (_context.DirectMessages == null)
            return;

        var messages = await _context.DirectMessages
            .Where(m => messageIds.Contains(m.Id) && m.ReceiverId == userId)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }

    // Get message by ID
    public async Task<DirectMessageModel?> GetMessage(int messageId)
    {
        if (_context.DirectMessages == null)
            return null;

        return await _context.DirectMessages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .FirstOrDefaultAsync(m => m.Id == messageId);
    }

    // Get multiple messages by IDs
    public async Task<List<DirectMessageModel>> GetMessagesByIds(List<int> messageIds)
    {
        if (_context.DirectMessages == null)
            return new List<DirectMessageModel>();

        return await _context.DirectMessages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => messageIds.Contains(m.Id))
            .ToListAsync();
    }

    public async Task<DirectMessageDTO?> GetMessageDTO(int messageId)
    {
        var message = await GetMessage(messageId);
        if (message == null)
            return null;

        return new DirectMessageDTO
        {
            Id = message.Id,
            Content = message.Content,
            MessageType = message.MessageType,
            SentAt = message.SentAt,
            IsRead = message.IsRead,
            IsEdited = message.IsEdited,
            Sender = new UserProfileDTO
            {
                Id = message.Sender.Id,
                Username = message.Sender.Username ?? string.Empty,
                Avatar = message.Sender.Avatar ?? string.Empty,
                Status = message.Sender.Status ?? "offline",
                LastActive = message.Sender.LastActive
            },
            Receiver = new UserProfileDTO
            {
                Id = message.Receiver.Id,
                Username = message.Receiver.Username ?? string.Empty,
                Avatar = message.Receiver.Avatar ?? string.Empty,
                Status = message.Receiver.Status ?? "offline",
                LastActive = message.Receiver.LastActive
            }
        };
    }




    public async Task<bool> JoinRoom(int userId, int roomId)
    {
        if (_context.ChatRoomMembers == null)
            return false;

        // Check if user is already a member
        var existingMembership = await _context.ChatRoomMembers
            .FirstOrDefaultAsync(m => m.ChatRoomId == roomId && m.UserId == userId);

        if (existingMembership != null)
            return true;

        var membership = new ChatRoomMemberModel
        {
            ChatRoomId = roomId,
            UserId = userId,
            Role = "member",
            JoinedAt = DateTime.UtcNow
        };

        _context.ChatRoomMembers.Add(membership);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<bool> LeaveRoom(int userId, int roomId)
    {
        if (_context.ChatRoomMembers == null)
            return false;

        var membership = await _context.ChatRoomMembers
            .FirstOrDefaultAsync(m => m.ChatRoomId == roomId && m.UserId == userId);

        if (membership == null)
            return false;

        _context.ChatRoomMembers.Remove(membership);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<ChatMessageDTO?> AddMessage(int senderId, SendMessageDTO message)
    {
        if (_context.ChatMessages == null || _context.ChatRooms == null)
            return null;

        var room = await _context.ChatRooms
            .Include(r => r.Members)
            .FirstOrDefaultAsync(r => r.Id == message.ChatRoomId);

        if (room == null || !room.Members.Any(m => m.UserId == senderId))
            return null;

        var chatMessage = new ChatMessageModel
        {
            ChatRoomId = message.ChatRoomId,
            SenderId = senderId,
            Content = message.Content,
            MessageType = message.MessageType,
            SentAt = DateTime.UtcNow
        };

        _context.ChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();

        // Load sender details
        await _context.Entry(chatMessage)
            .Reference(m => m.Sender)
            .LoadAsync();

        return new ChatMessageDTO
        {
            Id = chatMessage.Id,
            ChatRoomId = chatMessage.ChatRoomId,
            Content = chatMessage.Content,
            MessageType = chatMessage.MessageType,
            SentAt = chatMessage.SentAt,
            IsEdited = chatMessage.IsEdited,
            Sender = new UserProfileDTO
            {
                Id = chatMessage.Sender.Id,
                Username = chatMessage.Sender.Username ?? string.Empty,
                Avatar = chatMessage.Sender.Avatar ?? string.Empty,
                Status = chatMessage.Sender.Status ?? "offline",
                LastActive = chatMessage.Sender.LastActive
            }
        };
    }

        public async Task<DirectMessageDTO> SendDirectMessage(int senderId, SendDirectMessageDTO messageDto)
{
    if (_context.DirectMessages == null)
        throw new InvalidOperationException("DirectMessages DbSet is null");

    var sender = await _context.UserInfo!.FindAsync(senderId);
    var receiver = await _context.UserInfo!.FindAsync(messageDto.ReceiverId);

    if (sender == null || receiver == null)
        throw new InvalidOperationException("Sender or receiver not found");

    var newMessage = new DirectMessageModel
    {
        SenderId = senderId,
        ReceiverId = messageDto.ReceiverId,
        Content = messageDto.Content,
        MessageType = messageDto.MessageType,
        SentAt = DateTime.UtcNow,
        IsRead = false,
        IsEdited = false,
        IsDeleted = false
    };

    _context.DirectMessages.Add(newMessage);
    await _context.SaveChangesAsync();

    return new DirectMessageDTO
    {
        Id = newMessage.Id,
        Content = newMessage.Content,
        MessageType = newMessage.MessageType,
        SentAt = newMessage.SentAt,
        IsRead = newMessage.IsRead,
        IsEdited = newMessage.IsEdited,
        Sender = new UserProfileDTO
        {
            Id = sender.Id,
            Username = sender.Username ?? string.Empty,
            Avatar = sender.Avatar ?? string.Empty,
            Status = sender.Status ?? "offline",
            LastActive = sender.LastActive
        },
        Receiver = new UserProfileDTO
        {
            Id = receiver.Id,
            Username = receiver.Username ?? string.Empty,
            Avatar = receiver.Avatar ?? string.Empty,
            Status = receiver.Status ?? "offline",
            LastActive = receiver.LastActive
        }
    };
}

        public async Task<DirectMessageDTO> AddDirectMessage(int senderId, SendDirectMessageDTO messageDto)
        {
            if (_context.DirectMessages == null)
                throw new InvalidOperationException("DirectMessages DbSet is null");

            var sender = await _context.UserInfo!.FindAsync(senderId);
            var receiver = await _context.UserInfo!.FindAsync(messageDto.ReceiverId);

            if (sender == null || receiver == null)
                throw new InvalidOperationException("Sender or receiver not found");

            var newMessage = new DirectMessageModel
            {
                SenderId = senderId,
                ReceiverId = messageDto.ReceiverId,
                Content = messageDto.Content,
                MessageType = messageDto.MessageType,
                SentAt = DateTime.UtcNow
            };

            _context.DirectMessages.Add(newMessage);
            await _context.SaveChangesAsync();

            // Load the related entities
            await _context.Entry(newMessage)
                .Reference(m => m.Sender)
                .LoadAsync();
            await _context.Entry(newMessage)
                .Reference(m => m.Receiver)
                .LoadAsync();

            // Convert to DTO
            return new DirectMessageDTO
            {
                Id = newMessage.Id,
                Content = newMessage.Content,
                MessageType = newMessage.MessageType,
                SentAt = newMessage.SentAt,
                IsRead = newMessage.IsRead,
                IsEdited = newMessage.IsEdited,
                Sender = new UserProfileDTO
                {
                    Id = sender.Id,
                    Username = sender.Username ?? string.Empty,
                    Avatar = sender.Avatar ?? string.Empty,
                    Status = sender.Status ?? "offline",
                    LastActive = sender.LastActive
                },
                Receiver = new UserProfileDTO
                {
                    Id = receiver.Id,
                    Username = receiver.Username ?? string.Empty,
                    Avatar = receiver.Avatar ?? string.Empty,
                    Status = receiver.Status ?? "offline",
                    LastActive = receiver.LastActive
                }
            };
        }
    

        public async Task<bool> MarkMessageAsRead(int userId, int messageId)
        {
            if (_context.DirectMessages == null)
                return false;

            var message = await _context.DirectMessages
                .FirstOrDefaultAsync(m => m.Id == messageId && m.ReceiverId == userId);

            if (message == null)
                return false;

            message.IsRead = true;
            return await _context.SaveChangesAsync() > 0;
        }


        public async Task<IEnumerable<UserProfileDTO>> GetFriends(int userId)
        {
            if (_context.Friends == null || _context.UserInfo == null)
                return Enumerable.Empty<UserProfileDTO>();

            var friends = await _context.Friends
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) &&
                            f.Status.ToLower() == "accepted")  
                .Select(f => f.RequesterId == userId ? f.Addressee : f.Requester)
                .Select(u => new UserProfileDTO
                {
                    Id = u.Id,
                    Username = u.Username ?? string.Empty,
                    Avatar = u.Avatar ?? string.Empty,
                    Status = u.Status ?? "offline",
                    LastActive = u.LastActive,
                    FriendsCount = _context.Friends.Count(fr =>
                        (fr.RequesterId == u.Id || fr.AddresseeId == u.Id) &&
                        fr.Status.ToLower() == "accepted"), 
                    GamesCount = u.UserGames != null ? u.UserGames.Count : 0
                })
                .ToListAsync();

            return friends;
        }
    }
}
