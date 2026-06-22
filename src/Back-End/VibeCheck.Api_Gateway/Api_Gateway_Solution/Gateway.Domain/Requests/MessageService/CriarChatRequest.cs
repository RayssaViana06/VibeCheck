namespace Gateway.Domain.Requests.MessageService
{
    public class CriarChatRequest
    {
        public string PacienteId { get; set; }
        public string PsicologoId { get; set; }
    }
}
