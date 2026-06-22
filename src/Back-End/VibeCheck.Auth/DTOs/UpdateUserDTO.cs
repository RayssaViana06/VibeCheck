using System.ComponentModel.DataAnnotations;

namespace auth_service.DTOs
{
    public class UpdateUserDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = null!;

        public string? Cpf { get; set; }
        public string? Crp { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}