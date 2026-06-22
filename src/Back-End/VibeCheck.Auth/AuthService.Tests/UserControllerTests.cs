using auth_service.Controllers;
using auth_service.DTOs;
using auth_service.Models;
using auth_service.Services;
using auth_service.Settings;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Driver;
using Moq;

namespace AuthService.Tests
{
    [TestClass]
    public class UserControllerTests
    {
        private readonly Mock<IMongoDatabase> _mockDatabase;
        private readonly Mock<IMongoCollection<User>> _mockCollection;
        private readonly UserService _userService;
        private readonly TokenService _tokenService;
        private readonly Mock<BlacklistService> _mockBlacklistService;
        private readonly UserController _userController;

        public UserControllerTests()
        {
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockCollection = new Mock<IMongoCollection<User>>();

            _mockDatabase
                .Setup(db => db.GetCollection<User>("users", null))
                .Returns(_mockCollection.Object);

            var emptyCursor = new Mock<IAsyncCursor<User>>();
            emptyCursor.Setup(c => c.Current).Returns(new List<User>());
            emptyCursor.SetupSequence(c => c.MoveNextAsync(default))
                .ReturnsAsync(false);

            _mockCollection
                .Setup(c => c.FindAsync(
                    It.IsAny<FilterDefinition<User>>(),
                    It.IsAny<FindOptions<User, User>>(),
                    default))
                .ReturnsAsync(emptyCursor.Object);

            var jwtSettings = new JwtSettings
            {
                Key = "VibeCheck@2026#SecretKey!AuthService$JWT",
                Issuer = "auth-service",
                Audience = "vibecheck-app",
                ExpiresInHours = 8
            };

            _userService = new UserService(_mockDatabase.Object);
            _tokenService = new TokenService(jwtSettings);
            _mockBlacklistService = new Mock<BlacklistService>(_mockDatabase.Object);

            _userController = new UserController(_userService, _tokenService, _mockBlacklistService.Object);
        }

        [TestMethod]
        public async Task Register_PacienteSemCpf_DeveRetornar400()
        {
            var dto = new CreateUserDTO
            {
                Name = "João Silva",
                Email = "joao@email.com",
                Password = "senha123",
                Role = "paciente",
                Cpf = null
            };

            var resultado = await _userController.Register(dto);

            resultado.Should().BeOfType<BadRequestObjectResult>()
                .Which.Value.Should().Be("CPF é obrigatório para pacientes.");
        }

        [TestMethod]
        public async Task Register_PsicologoSemCrp_DeveRetornar400()
        {
            var dto = new CreateUserDTO
            {
                Name = "Dra. Ana Lima",
                Email = "ana@email.com",
                Password = "senha123",
                Role = "psicologo",
                Crp = null
            };

            var resultado = await _userController.Register(dto);

            resultado.Should().BeOfType<BadRequestObjectResult>()
                .Which.Value.Should().Be("CRP é obrigatório para psicólogos.");
        }

        [TestMethod]
        public async Task Register_SenhaCurta_DeveRetornar400()
        {
            var dto = new CreateUserDTO
            {
                Name = "João Silva",
                Email = "joao@email.com",
                Password = "123",
                Role = "paciente",
                Cpf = null
            };

            var resultado = await _userController.Register(dto);

            resultado.Should().BeOfType<BadRequestObjectResult>();
        }

        [TestMethod]
        public async Task Register_RoleInvalido_DeveRetornar400()
        {
            var dto = new CreateUserDTO
            {
                Name = "João Silva",
                Email = "joao@email.com",
                Password = "senha123",
                Role = "admin"
            };

            var resultado = await _userController.Register(dto);

            resultado.Should().BeOfType<BadRequestObjectResult>();
        }

        [TestMethod]
        public async Task Login_SenhaErrada_DeveRetornar401()
        {
            var user = new User
            {
                Id = "69c1c6d8a77eab3dc2fbf630",
                Name = "Maria Santos",
                Email = "maria@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
                Role = "paciente"
            };

            var cursor = new Mock<IAsyncCursor<User>>();
            cursor.Setup(c => c.Current).Returns(new List<User> { user });
            cursor.SetupSequence(c => c.MoveNextAsync(default))
                .ReturnsAsync(true)
                .ReturnsAsync(false);

            _mockCollection
                .Setup(c => c.FindAsync(
                    It.IsAny<FilterDefinition<User>>(),
                    It.IsAny<FindOptions<User, User>>(),
                    default))
                .ReturnsAsync(cursor.Object);

            var dto = new LoginDTO
            {
                Email = "maria@email.com",
                Password = "senhaerrada"
            };

            var resultado = await _userController.Login(dto);

            resultado.Should().BeOfType<UnauthorizedObjectResult>()
                .Which.Value.Should().Be("E-mail ou senha inválidos.");
        }
    }
}