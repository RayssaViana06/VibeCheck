namespace Gateway.Domain.Response
{
    public class BuscarChatResponse
    {
        public List<ChatsResponse> Chats { get; set; }


        public class ChatsResponse 
        {
            public Guid Id { get; set; }
            public string PacienteId { get; set; }
            public string PsicologoId { get; set; }
            public DateTime CreateAt { get; set; }

        }
    }
}
