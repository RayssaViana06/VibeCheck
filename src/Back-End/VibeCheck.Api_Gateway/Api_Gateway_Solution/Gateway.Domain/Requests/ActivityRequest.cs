namespace Gateway.Domain.Requests
{
    public class ActivityRequest
    {
        public string PacienteId { get; set; } = null!;
        public string? PsicologoId { get; set; }
        public string Texto { get; set; } = null!;
        public DateTime? DataEntrega { get; set; }
        public int Status { get; set; } = 0;
        public bool EstaConcluida { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
