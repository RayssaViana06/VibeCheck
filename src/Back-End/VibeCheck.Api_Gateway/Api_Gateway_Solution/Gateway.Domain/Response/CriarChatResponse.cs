namespace Gateway.Domain.Response
{
    public class CriarChatResponse
    {


        public Chat ChatResponse { get; set; }


        public class Chat
        {
             public string Id { get; set; }
             public string PacienteId { get; set; }
             public string PsicologoId { get; set; }
             public DateTime CreateAt { get; set; }
        }
    }
}
