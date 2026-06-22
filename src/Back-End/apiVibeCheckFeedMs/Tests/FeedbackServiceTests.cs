using apiVibeCheckFeedMs.Api.Services;
using apiVibeCheckFeedMs.Domain.Dtos;
using apiVibeCheckFeedMs.Domain.Interfaces;
using apiVibeCheckFeedMs.Domain.Models;
using Moq;
using Xunit;

namespace apiVibeCheckFeedMs.Tests;

public class FeedbackServiceTests
{
    private readonly Mock<IFeedbackRepository> _repositoryMock;
    private readonly FeedbackService _service;

    public FeedbackServiceTests()
    {
        _repositoryMock = new Mock<IFeedbackRepository>();
        _service = new FeedbackService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_DeveRetornarFeedback_QuandoDadosValidos()
    {
        var dto = new CreateFeedbackDto
        {
            PacienteId = "507f1f77bcf86cd799439011",
            Texto = "Paciente apresentou melhora significativa."
        };

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Feedback>()))
            .Returns(Task.CompletedTask);

        var result = await _service.CreateAsync(dto, "psicologo123");

        Assert.NotNull(result);
        Assert.Equal(dto.Texto, result.Texto);
        Assert.Equal(dto.PacienteId, result.PacienteId);
    }

    [Fact]
    public async Task CreateAsync_DeveLancarExcecao_QuandoTextoVazio()
    {
        var dto = new CreateFeedbackDto
        {
            PacienteId = "507f1f77bcf86cd799439011",
            Texto = ""
        };

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.CreateAsync(dto, "psicologo123"));
    }

    [Fact]
    public async Task CreateAsync_DeveLancarExcecao_QuandoTextoMenorQue5Caracteres()
    {
        var dto = new CreateFeedbackDto
        {
            PacienteId = "507f1f77bcf86cd799439011",
            Texto = "oi"
        };

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.CreateAsync(dto, "psicologo123"));
    }

    [Fact]
    public async Task CreateAsync_DeveLancarExcecao_QuandoTextoMaiorQue500Caracteres()
    {
        var dto = new CreateFeedbackDto
        {
            PacienteId = "507f1f77bcf86cd799439011",
            Texto = new string('a', 501)
        };

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.CreateAsync(dto, "psicologo123"));
    }

    [Fact]
    public async Task CreateAsync_DeveLancarExcecao_QuandoPacienteIdVazio()
    {
        var dto = new CreateFeedbackDto
        {
            PacienteId = "",
            Texto = "Texto válido para teste."
        };

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.CreateAsync(dto, "psicologo123"));
    }

    [Fact]
    public async Task OcultarParaPacienteAsync_DeveOcultar_QuandoPacienteCorreto()
    {
        var feedback = new Feedback
        {
            Id = "507f1f77bcf86cd799439011",
            PacienteId = "paciente123",
            Texto = "Texto do feedback",
            OcultoParaPaciente = false
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(feedback.Id))
            .ReturnsAsync(feedback);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Feedback>()))
            .Returns(Task.CompletedTask);

        await _service.OcultarParaPacienteAsync(feedback.Id, "paciente123");

        Assert.True(feedback.OcultoParaPaciente);
    }

    [Fact]
    public async Task OcultarParaPacienteAsync_DeveLancarExcecao_QuandoFeedbackNaoEncontrado()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<string>()))
            .ReturnsAsync((Feedback?)null);

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.OcultarParaPacienteAsync("id_invalido", "paciente123"));
    }

    [Fact]
    public async Task OcultarParaPacienteAsync_DeveLancarExcecao_QuandoPacienteErrado()
    {
        var feedback = new Feedback
        {
            Id = "507f1f77bcf86cd799439011",
            PacienteId = "paciente123",
            Texto = "Texto do feedback"
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(feedback.Id))
            .ReturnsAsync(feedback);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _service.OcultarParaPacienteAsync(feedback.Id, "outro_paciente"));
    }

    [Fact]
    public async Task DeleteAsync_DeveExcluir_QuandoPsicologoCorreto()
    {
        var feedback = new Feedback
        {
            Id = "507f1f77bcf86cd799439011",
            PsicologoId = "psicologo123",
            Texto = "Texto do feedback"
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(feedback.Id))
            .ReturnsAsync(feedback);
        _repositoryMock.Setup(r => r.DeleteAsync(feedback.Id))
            .Returns(Task.CompletedTask);

        await _service.DeleteAsync(feedback.Id, "psicologo123");

        _repositoryMock.Verify(r => r.DeleteAsync(feedback.Id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DeveLancarExcecao_QuandoPsicologoErrado()
    {
        var feedback = new Feedback
        {
            Id = "507f1f77bcf86cd799439011",
            PsicologoId = "psicologo123",
            Texto = "Texto do feedback"
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(feedback.Id))
            .ReturnsAsync(feedback);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _service.DeleteAsync(feedback.Id, "outro_psicologo"));
    }
}