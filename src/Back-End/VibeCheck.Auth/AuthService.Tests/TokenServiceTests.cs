using auth_service.Models;
using auth_service.Services;
using auth_service.Settings;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IdentityModel.Tokens.Jwt;

namespace AuthService.Tests
{
    [TestClass]
    public class TokenServiceTests
    {
        private readonly TokenService _tokenService;
        private readonly JwtSettings _jwtSettings;

        public TokenServiceTests()
        {
            _jwtSettings = new JwtSettings
            {
                Key = "VibeCheck@2026#SecretKey!AuthService$JWT",
                Issuer = "auth-service",
                Audience = "vibecheck-app",
                ExpiresInHours = 8
            };

            _tokenService = new TokenService(_jwtSettings);
        }

        [TestMethod]
        public void GenerateToken_DeveRetornarTokenValido()
        {
            var user = new User
            {
                Id = "69c1c6d8a77eab3dc2fbf630",
                Name = "Maria Santos",
                Email = "maria@email.com",
                Role = "paciente"
            };

            var token = _tokenService.GenerateToken(user);

            token.Should().NotBeNullOrEmpty();
            token.Split('.').Should().HaveCount(3);
        }

        [TestMethod]
        public void GenerateToken_DeveTerIssuerCorreto()
        {
            var user = new User
            {
                Id = "69c1c6d8a77eab3dc2fbf630",
                Name = "Maria Santos",
                Email = "maria@email.com",
                Role = "paciente"
            };

            var token = _tokenService.GenerateToken(user);
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            jwt.Issuer.Should().Be("auth-service");
        }

        [TestMethod]
        public void GenerateToken_DeveConterRoleCorreta()
        {
            var user = new User
            {
                Id = "69c1c6d8a77eab3dc2fbf630",
                Name = "Maria Santos",
                Email = "maria@email.com",
                Role = "psicologo"
            };

            var token = _tokenService.GenerateToken(user);
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);

            jwt.Claims.Should().Contain(c => c.Value == "psicologo");
        }
    }
}