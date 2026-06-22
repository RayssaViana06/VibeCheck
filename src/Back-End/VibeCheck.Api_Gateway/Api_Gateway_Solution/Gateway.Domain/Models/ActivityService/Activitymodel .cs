namespace Gateway.Domain.Models.ActivityService
{
    public class ActivityModel
    {
        public string Id { get; set; } = null!;
        public string PacienteId { get; set; } = null!;
        public string? PsicologoId { get; set; }
        public string Texto { get; set; } = null!;
        public DateTime? DataEntrega { get; set; }
        public ActivityStatus Status { get; set; } = ActivityStatus.Pendente;
        public bool EstaConcluida => Status == ActivityStatus.Concluida;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public enum ActivityStatus
    {
        Pendente = 0,
        Concluida = 1,
        Cancelada = 2
    }
}
