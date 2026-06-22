namespace Gateway.Domain.Models.AuthService
{
    public class TokenModel
    {
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}