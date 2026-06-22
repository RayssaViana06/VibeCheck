using MediatR;
using Message.Application.Commands;
using Message.Domain.Interfaces;
using Message.Domain.Models;

namespace Message.Application.Handlers
{
    public class CriarChatsHandler(IChatRepository repository) : IRequestHandler<CriarChatCommand, CriarChatResponse>
    {
        private readonly IChatRepository _chatRepository = repository;

        public async Task<CriarChatResponse> Handle(CriarChatCommand request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            try
            {
                var chat = new Chat(request.PacienteId, request.NomePaciente, request.PsicologoId, request.NomePsicologo);
                var resultado = await _chatRepository.CreateChatAsync(chat);
                return new CriarChatResponse(resultado);
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao criar chat: {ex.Message}");
            }
        }
    }
}
