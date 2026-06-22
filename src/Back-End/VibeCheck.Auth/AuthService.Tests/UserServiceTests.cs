using auth_service.Models;
using auth_service.Services;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MongoDB.Driver;
using Moq;

namespace AuthService.Tests
{
    [TestClass]
    public class UserServiceTests
    {
        private readonly Mock<IMongoDatabase> _mockDatabase;
        private readonly Mock<IMongoCollection<User>> _mockCollection;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockCollection = new Mock<IMongoCollection<User>>();

            _mockDatabase
                .Setup(db => db.GetCollection<User>("users", null))
                .Returns(_mockCollection.Object);

            _userService = new UserService(_mockDatabase.Object);
        }

        [TestMethod]
        public async Task CreateAsync_DeveSalvarUsuario()
        {
            var user = new User
            {
                Name = "João Silva",
                Email = "joao@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
                Role = "paciente",
                Cpf = "123.456.789-00"
            };

            _mockCollection
                .Setup(c => c.InsertOneAsync(user, null, default))
                .Returns(Task.CompletedTask);

            await _userService.CreateAsync(user);

            _mockCollection.Verify(c => c.InsertOneAsync(user, null, default), Times.Once);
        }

        [TestMethod]
        public void HashSenha_DeveGerarHashDiferenteDaSenhaOriginal()
        {
            var senha = "senha123";
            var hash = BCrypt.Net.BCrypt.HashPassword(senha);

            hash.Should().NotBe(senha);
            hash.Should().StartWith("$2a$");
        }

        [TestMethod]
        public void VerificarSenha_DeveRetornarTrueParaSenhaCorreta()
        {
            var senha = "senha123";
            var hash = BCrypt.Net.BCrypt.HashPassword(senha);
            var resultado = BCrypt.Net.BCrypt.Verify(senha, hash);

            resultado.Should().BeTrue();
        }

        [TestMethod]
        public void VerificarSenha_DeveRetornarFalseParaSenhaErrada()
        {
            var senha = "senha123";
            var hash = BCrypt.Net.BCrypt.HashPassword(senha);
            var resultado = BCrypt.Net.BCrypt.Verify("senhaerrada", hash);

            resultado.Should().BeFalse();
        }
    }
}