using System;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Atividades.Models
{
    [BsonIgnoreExtraElements]
    public class Activity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        [Required]
        public string PacienteId { get; set; } = null!;

        [BsonRepresentation(BsonType.ObjectId)]
        public string? PsicologoId { get; set; }

        [Required]
        [StringLength(2000)]
        public string Texto { get; set; } = null!;

        public DateTime? DataEntrega { get; set; }

        [BsonRepresentation(BsonType.Int32)]
        public ActivityStatus Status { get; set; } = ActivityStatus.Pendente;

        [BsonIgnore]
        public bool EstaConcluida
        {
            get => Status == ActivityStatus.Concluida;
            set => Status = value ? ActivityStatus.Concluida : ActivityStatus.Pendente;
        }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public Activity()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public override string ToString() =>
            $"Activity(Id={Id ?? "null"}, PacienteId={PacienteId}, Status={Status})";
    }

    public enum ActivityStatus
    {
        Pendente  = 0,
        Concluida = 1,
        Cancelada = 2
    }
}
