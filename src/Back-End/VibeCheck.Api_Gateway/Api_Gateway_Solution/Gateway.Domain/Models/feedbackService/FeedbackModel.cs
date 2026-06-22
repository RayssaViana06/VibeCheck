namespace Gateway.Domain.Models;

public class FeedbackRequestModel
{
    public string Texto { get; set; } = string.Empty;
    public string PacienteId { get; set; } = string.Empty;
}