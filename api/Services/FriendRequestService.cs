using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Services.Context;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class FriendRequestService
    {
        private readonly DataContext _context;

        public FriendRequestService(DataContext context)
        {
            _context = context;
        }

        public async Task<FriendRequestModel> SendFriendRequest(int senderId, int receiverId)
        {
            var sender = await _context.UserInfo.FindAsync(senderId);
            var receiver = await _context.UserInfo.FindAsync(receiverId);

            if (sender == null || receiver == null)
                return null;

            var friendRequest = new FriendRequestModel
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Status = "Pending"
            };

            _context.FriendRequests.Add(friendRequest);
            await _context.SaveChangesAsync();

            return friendRequest;
        }

        public async Task<bool> AcceptFriendRequest(int requestId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);

            if (request == null || request.Status != "Pending")
                return false;

            request.Status = "Accepted";

            var friend1 = new FriendsModel
            {
                UserId = request.SenderId,
                FriendId = request.ReceiverId
            };

            var friend2 = new FriendsModel
            {
                UserId = request.ReceiverId,
                FriendId = request.SenderId
            };

            _context.Friends.AddRange(friend1, friend2);
            _context.FriendRequests.Remove(request);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RejectFriendRequest(int requestId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);

            if (request == null || request.Status != "Pending")
                return false;

            request.Status = "Rejected";
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<FriendRequestModel>> GetPendingRequests(int userId)
        {
            return await _context.FriendRequests
                .Where(fr => fr.ReceiverId == userId && fr.Status == "Pending")
                .ToListAsync();
        }
        public async Task<IEnumerable<FriendsModel>> GetFriends(int userId)
        {
            return await _context.Friends
                .Where(f => f.UserId == userId || f.FriendId == userId)
                .ToListAsync();
        }
    }
}
