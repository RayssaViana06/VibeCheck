namespace auth_service.DTOs
{
    public class UserResponseDTO
    {
        public string? Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? Cpf { get; set; }
        public string? Crp { get; set; }
        public DateTime? DataNascimento { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}