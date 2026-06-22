using Message.Domain.Models;

namespace Message.Application.Commands
{
    public class BuscarChatsResponse(List<Chat> dados)
    {
        public List<Chat> Chats { get; set; } = dados;
    }
}
