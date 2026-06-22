namespace Gateway.Domain.Models.AuthService
{
    public class LinkModel
    {
        public string Id { get; set; } = string.Empty;
        public string PsicologoId { get; set; } = string.Empty;
        public string PacienteId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}