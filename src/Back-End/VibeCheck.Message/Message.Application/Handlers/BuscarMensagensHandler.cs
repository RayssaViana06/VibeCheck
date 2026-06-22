using MediatR;
using Message.Application.Commands;
using Message.Domain.Interfaces;

namespace Message.Application.Handlers
{
    public class BuscarMensagensHandler(IMessageRepository messageRepository) : IRequestHandler<BuscarMensagensCommand, BuscarMensagensResponse>
    {
        private readonly IMessageRepository _messageRepository = messageRepository;

        public async Task<BuscarMensagensResponse> Handle(BuscarMensagensCommand request, CancellationToken cancellationToken)
        {
            var mensagens = await _messageRepository.GetMessages(request.ChatId);
            return new BuscarMensagensResponse(mensagens.ToList());
        }
    }
}
