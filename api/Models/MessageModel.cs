namespace api.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string? Content { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
        
        public UserModel? Sender { get; set; }
        public UserModel? Receiver { get; set; }
    }
}
