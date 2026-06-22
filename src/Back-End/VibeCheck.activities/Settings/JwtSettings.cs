namespace Atividades.Settings
{
    public class JwtSettings
    {

        public string SecretKey { get; set; } = string.Empty;
        public string Issuer { get; set; } = "auth-service";
        public string Audience { get; set; } = "vibecheck-app";
    }
}

