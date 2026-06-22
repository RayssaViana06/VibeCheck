namespace Gateway.Domain.Models.AuthService
{
    public class UserModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Cpf { get; set; }
        public string? Crp { get; set; }
        public DateTime? DataNascimento { get; set; } 
        public DateTime CreatedAt { get; set; }      
        public DateTime UpdatedAt { get; set; }      
}

}
