namespace Gateway.Domain.Requests;

public class FeedbackRequest
{
    public string Texto { get; set; } = string.Empty;
    public string PacienteId { get; set; } = string.Empty;
}