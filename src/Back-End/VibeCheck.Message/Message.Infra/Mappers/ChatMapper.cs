using Message.Domain.Models;
using Message.Infra.Documents;

namespace Message.Infra.Mappers
{
    public static class ChatMapper
    {
        public static ChatDocument MapToDocument(this Chat chat)
        {
            return new ChatDocument
            {
                Id = chat.Id,
                PacienteId = chat.PacienteId,
                NomePaciente = chat.NomePaciente,
                PsicologoId = chat.PsicologoId,
                NomePsicologo = chat.NomePsicologo,
                CreateAt = chat.CreateAt
            };
        }

        public static Chat MapToDomain(this ChatDocument document)
        {
            return new Chat(document.Id, document.PacienteId, document.NomePaciente, document.PsicologoId, document.NomePsicologo, document.CreateAt);
        }
    }
}
