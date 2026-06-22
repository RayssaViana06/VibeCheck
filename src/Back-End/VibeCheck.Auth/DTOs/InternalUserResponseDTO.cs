namespace auth_service.DTOs
{
    public class InternalUserResponseDTO
    {
        public string? Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}