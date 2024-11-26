using api.Models;

public class UserModel
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Salt { get; set; }
    public string? Hash { get; set; }

    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

    public ICollection<FriendsModel> Friends { get; set; } = new List<FriendsModel>(); 
    public ICollection<FriendRequestModel> SentFriendRequests { get; set; } = new List<FriendRequestModel>(); 
    public ICollection<FriendRequestModel> ReceivedFriendRequests { get; set; } = new List<FriendRequestModel>(); 

    public UserModel() { }
}
