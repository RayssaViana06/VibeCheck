using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Atividades.Models
{
    [BsonIgnoreExtraElements] 
    public class DiarioEntrada
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        
        public string PsicologoId  { get; set; } = null!;
        public string PacienteId   { get; set; } = null!;
        public string PacienteNome { get; set; } = null!;
        public string Titulo       { get; set; } = null!;
        public string Conteudo     { get; set; } = null!;

       
        public string Humor        { get; set; } = null!;

        public DateTime CriadoEm   { get; set; }
    }
}
