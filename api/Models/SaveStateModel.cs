namespace api.Models
{
    public class SaveStateModel
    {
        public int Id { get; set; }
        public string? SaveState { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Add UserId to link save states to specific users
        public int UserId { get; set; } // Foreign Key to User
        public UserModel? User { get; set; } // Navigation property to User
    }
}
