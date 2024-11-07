namespace api.Models.DTO
{
    public class SaveStateDTO
    {
        public int Id { get; set; }
        public string? StateData { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; } // Include UserId to identify which user the save state belongs to
    }
}
