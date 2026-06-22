using MediatR;
using Message.Application.Commands;
using Message.Domain.Interfaces;

namespace Message.Application.Handlers
{
    public class DeletarChatHandler(IChatRepository repository) : IRequestHandler<DeletarChatCommand>
    {
        private readonly IChatRepository _chatRepository = repository;
        public async Task Handle(DeletarChatCommand request, CancellationToken cancellationToken)
        {
            if(request == null)
                throw new ArgumentNullException(nameof(request));


            try
            {
                await _chatRepository.DeleteChatASync(request.ChatId);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"Erro ao deletar chat: {request.ChatId}.", ex);
            }
        }
    }
}
