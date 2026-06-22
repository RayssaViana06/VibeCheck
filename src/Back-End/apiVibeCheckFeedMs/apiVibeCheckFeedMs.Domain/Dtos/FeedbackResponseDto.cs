namespace apiVibeCheckFeedMs.Domain.Dtos;

public class FeedbackResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Texto { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string PsicologoId { get; set; } = string.Empty;
    public string PsicologoNome { get; set; } = string.Empty;
}
