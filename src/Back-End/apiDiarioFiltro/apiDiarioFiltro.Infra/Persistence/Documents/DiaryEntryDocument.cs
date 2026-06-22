using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace apiDiarioFiltro.Infra.Persistence.Documents;

[BsonIgnoreExtraElements]
public class DiaryEntryDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("pacienteId")]
    public string PacienteId { get; set; } = string.Empty;

    [BsonElement("texto")]
    public string Texto { get; set; } = string.Empty;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }
}