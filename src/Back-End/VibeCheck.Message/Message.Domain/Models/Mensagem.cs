namespace Message.Domain.Models
{
    public class Mensagem
    {
        public Mensagem(string chatId, string texto, string usuarioOrigem)
        {
            ChatId = chatId;
            Texto = texto;
            UsuarioOrigem = usuarioOrigem;
            CreateAt = DateTime.UtcNow;
        }

        public string Id { get;  set; } = Guid.NewGuid().ToString();
        public string ChatId { get;  set; } 

        public string Texto { get;  set; }
        public string UsuarioOrigem { get;  set; }
        public DateTime CreateAt { get;  set; }
    }
}
