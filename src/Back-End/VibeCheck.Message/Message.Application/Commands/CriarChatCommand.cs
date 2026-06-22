using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Message.Application.Commands
{
    public class CriarChatCommand : IRequest<CriarChatResponse>
    {
        [Required]
        public string PacienteId { get; set; }
        
        [Required]
        public string PsicologoId { get; set; }
        [Required]
        public string NomePaciente { get; set; }
        [Required]
        public string NomePsicologo { get; set; }
    }
}