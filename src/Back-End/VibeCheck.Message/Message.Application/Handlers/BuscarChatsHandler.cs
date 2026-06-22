using MediatR;
using Message.Application.Commands;
using Message.Domain.Interfaces;

namespace Message.Application.Handlers
{
    public class BuscarChatsHandler(IChatRepository chatRepository) : IRequestHandler<BuscarChatsCommand, BuscarChatsResponse>
    {
        private readonly IChatRepository _chatRepository = chatRepository;
        public async Task<BuscarChatsResponse> Handle(BuscarChatsCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var chats = await _chatRepository.GetChatsAsync(request.ChatId);
                return new BuscarChatsResponse(chats);

            }catch (Exception ex) 
            {
                Console.WriteLine($"Erro ao buscar chats do usuario:{request.ChatId}");
                throw;
            }
        }
    }
}
