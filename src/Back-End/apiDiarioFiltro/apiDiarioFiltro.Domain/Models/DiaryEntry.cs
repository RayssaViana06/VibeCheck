namespace apiDiarioFiltro.Domain.Models;

public class DiaryEntry
{
    public string Id { get; set; } = string.Empty;
    public string PacienteId { get; set; } = string.Empty;
    public string Texto { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}