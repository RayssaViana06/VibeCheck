namespace Message.Domain.Models
{
    public class Chat
    {
        public Chat(string pacienteId, string psicologoId)
        {
            PacienteId = pacienteId;
            PsicologoId = psicologoId;
            CreateAt = DateTime.UtcNow;
            Id = Guid.NewGuid().ToString();
        }
        public Chat(string pacienteId, string nomePaciente, string psicologoId, string nomePsicologo)
        {
            PacienteId = pacienteId;
            NomePaciente = nomePaciente;
            PsicologoId = psicologoId;
            NomePsicologo = nomePsicologo;
            CreateAt = DateTime.UtcNow;
            Id = Guid.NewGuid().ToString();
        }

        public Chat(string id, string pacienteId, string nomePaciente, string psicologoId, string nomePsicologo, DateTime createAt)
        {
            Id = id;
            PacienteId = pacienteId;
            NomePaciente = nomePaciente;
            PsicologoId = psicologoId;
            NomePsicologo = nomePsicologo;
            CreateAt = createAt;
        }

        public string Id { get;  set; }
        public string PacienteId { get;  set; }
        public string NomePaciente { get; set; }
        public string PsicologoId { get;  set; }
        public string NomePsicologo { get; set; }
        public DateTime CreateAt { get; private set; }

    }
}
