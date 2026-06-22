namespace Gateway.Domain.Models.PsiDiaryService
{
    public class PsiDiaryModel
    {
        public string Id { get; set; } = null!;
        public string PacienteId { get; set; } = null!;
        public string? PsicologoId { get; set; }
        public string Texto { get; set; } = null!;
        public string? Humor { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}