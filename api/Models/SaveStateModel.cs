public class SaveStateModel
{
    public int Id { get; set; }
    public string? SaveState { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
