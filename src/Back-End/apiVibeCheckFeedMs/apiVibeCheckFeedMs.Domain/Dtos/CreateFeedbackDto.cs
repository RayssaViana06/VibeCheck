using System.ComponentModel.DataAnnotations;

namespace apiVibeCheckFeedMs.Domain.Dtos;

public class CreateFeedbackDto
{
    [Required]
    public string PacienteId { get; set; } = string.Empty;

    [Required]
    public string Texto { get; set; } = string.Empty;
    
    [Required]
    public string PsicologoNome { get; set; } = string.Empty;
}