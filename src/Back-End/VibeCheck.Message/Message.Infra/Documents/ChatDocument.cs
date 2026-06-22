using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Message.Infra.Documents
{
    public  class ChatDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get;  set; }
        public string PacienteId { get;  set; }
        public string NomePaciente { get; set; }
        public string PsicologoId { get;  set; }
        public string NomePsicologo { get; set; }
        public DateTime CreateAt { get;  set; }
    }
}
