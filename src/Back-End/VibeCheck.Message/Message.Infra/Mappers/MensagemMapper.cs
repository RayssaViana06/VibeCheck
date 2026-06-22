using Message.Domain.Models;
using Message.Infra.Documents;
using MongoDB.Bson;
using System.Runtime.CompilerServices;

namespace Message.Infra.Mappers
{
    public static class MensagemMapper
    {
        public static MensagemDocument MapToDocument(this Mensagem mensagem)
        {
            return new MensagemDocument()
            {
                Id = mensagem.Id,
                ChatId = mensagem.ChatId,
                Texto = mensagem.Texto,
                CreateAt = mensagem.CreateAt,
                UsuarioOrigem = mensagem.UsuarioOrigem
            };

        }
        public static Mensagem MapToDomain(this MensagemDocument document)
        {
            return new Mensagem(document.ChatId, document.Texto, document.UsuarioOrigem)
            {
                Id = document.Id,
                CreateAt = document.CreateAt
            };
        }
    }
}
