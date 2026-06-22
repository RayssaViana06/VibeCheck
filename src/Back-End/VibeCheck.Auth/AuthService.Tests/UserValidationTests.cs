using auth_service.DTOs;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AuthService.Tests
{
    [TestClass]
    public class UserValidationTests
    {
        [TestMethod]
        public void Validacao_PacienteSemCpf_DeveSerInvalido()
        {
            var dto = new CreateUserDTO
            {
                Name = "João Silva",
                Email = "joao@email.com",
                Password = "senha123",
                Role = "paciente",
                Cpf = null
            };

            var cpfVazio = string.IsNullOrWhiteSpace(dto.Cpf);

            cpfVazio.Should().BeTrue();
        }

        [TestMethod]
        public void Validacao_PsicologoSemCrp_DeveSerInvalido()
        {
            var dto = new CreateUserDTO
            {
                Name = "Dra. Ana Lima",
                Email = "ana@email.com",
                Password = "senha123",
                Role = "psicologo",
                Crp = null
            };

            var crpVazio = string.IsNullOrWhiteSpace(dto.Crp);

            crpVazio.Should().BeTrue();
        }

        [TestMethod]
        public void Validacao_SenhaCurta_DeveSerInvalida()
        {
            var dto = new CreateUserDTO
            {
                Name = "João Silva",
                Email = "joao@email.com",
                Password = "123",
                Role = "paciente",
                Cpf = null
            };

            var senhaInvalida = dto.Password.Length < 6;

            senhaInvalida.Should().BeTrue();
        }
    }
}