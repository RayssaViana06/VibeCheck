using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace apiVibeCheckFeedMs.Domain.Models;

public class Feedback
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }
    public string PacienteId { get; set; }
    public string PsicologoId { get; set; }
    public string PsicologoNome { get; set; } = string.Empty;
    public string Texto { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool OcultoParaPaciente { get; set; } = false;
}