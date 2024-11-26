using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Models.DTO;
using api.Services.Context;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class FriendService
{
    private readonly DataContext _context;

    public FriendService(DataContext context)
    {
        _context = context;
    }

    public async Task SendFriendRequest(SendFriendRequestDTO dto)
    {
        var friendRequest = new FriendRequestModel
        {
            SenderId = dto.SenderId,
            ReceiverId = dto.ReceiverId,
            SentAt = DateTime.UtcNow,
            IsAccepted = false
        };

        _context.FriendRequests.Add(friendRequest);
        await _context.SaveChangesAsync();
    }

    public async Task<List<FriendRequestDTO>> GetPendingFriendRequests(int userId)
    {
        return await _context.FriendRequests
            .Where(fr => fr.ReceiverId == userId && !fr.IsAccepted)
            .Select(fr => new FriendRequestDTO
            {
                Id = fr.Id,
                SenderId = fr.SenderId,
                SenderName = fr.Sender.Username, 
                ReceiverId = fr.ReceiverId,
                ReceiverName = fr.Receiver.Username,
                SentAt = fr.SentAt,
                IsAccepted = fr.IsAccepted
            })
            .ToListAsync();
    }

    public async Task<List<FriendDTO>> GetFriendsList(int userId)
    {
        return await _context.Friends
            .Where(f => f.UserId == userId || f.FriendId == userId)
            .Select(f => new FriendDTO
            {
                Id = f.Id,
                UserId = f.UserId,
                UserName = f.User.Username,
                FriendId = f.FriendId,
                FriendName = f.Friend.Username,
                CreatedAt = f.CreatedAt
            })
            .ToListAsync();
    }
}

}