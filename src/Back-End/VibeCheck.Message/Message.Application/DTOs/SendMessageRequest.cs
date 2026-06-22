namespace Message.Application.DTOs
{
    public class SendMessageRequest
    {
        public string ChatId { get; set; }
        public string Texto { get; set; }
        public string UsuarioDestinoId { get; set; }
    }
}
