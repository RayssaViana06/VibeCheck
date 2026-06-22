namespace Gateway.Domain.Requests
{
    public class CadastroRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Cpf { get; set; }
        public string? Crp { get; set; }
        public DateTime? DataNascimento { get; set; } 
    }
}