using System.ComponentModel.DataAnnotations;

namespace auth_service.DTOs
{
    public class CreateUserDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Senha é obrigatória.")]
        [MinLength(6, ErrorMessage = "A senha deve ter no mínimo 6 caracteres.")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Role é obrigatória.")]
        public string Role { get; set; } = null!;

        public string? Cpf { get; set; }
        public string? Crp { get; set; }
        public DateTime? DataNascimento { get; set; }
    }
}