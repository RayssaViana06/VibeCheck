using MediatR;
using Message.Application.Commands;
using Message.Domain.Models;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Message.TestUnit.Controllers
{
    public class CriarChatControllerTest
    {
        [Fact]
        public async Task CriarChat_DeveRetornarOk_QuandoMediatorExecutarComSucesso()
        {
            var command = new CriarChatCommand
            {
                PacienteId = "paciente-1",
                PsicologoId = "psicologo-1",
                NomePaciente = "Paciente 1",
                NomePsicologo = "Psicologo 1"
            };

            var chatCriado = new Chat("chat-1", command.PacienteId, command.NomePaciente, command.PsicologoId, command.NomePsicologo, DateTime.UtcNow);
            var resposta = new CriarChatResponse(chatCriado);
            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.Is<CriarChatCommand>(c =>
                    c.PacienteId == command.PacienteId &&
                    c.PsicologoId == command.PsicologoId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(resposta);

            var result = await ExecutarEndpointCriarChat(command, mediatorMock.Object);
            var okResult = Assert.IsType<Ok<CriarChatResponse>>(result);

            Assert.Equal(resposta, okResult.Value);
            mediatorMock.Verify(m => m.Send(It.Is<CriarChatCommand>(c =>
                c.PacienteId == command.PacienteId &&
                c.PsicologoId == command.PsicologoId), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CriarChat_DeveRetornarProblem_QuandoMediatorLancarExcecao()
        {
            var command = new CriarChatCommand
            {
                PacienteId = "paciente-erro",
                PsicologoId = "psicologo-erro",
                NomePaciente = "Paciente erro",
                NomePsicologo = "Psicologo erro"
            };

            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.IsAny<CriarChatCommand>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("erro ao criar chat"));

            var result = await ExecutarEndpointCriarChat(command, mediatorMock.Object);
            var problemResult = Assert.IsType<ProblemHttpResult>(result);

            Assert.Equal(StatusCodes.Status500InternalServerError, problemResult.StatusCode);
            Assert.Equal("erro ao criar chat", problemResult.ProblemDetails.Detail);
            mediatorMock.Verify(m => m.Send(It.Is<CriarChatCommand>(c =>
                c.PacienteId == command.PacienteId &&
                c.PsicologoId == command.PsicologoId), It.IsAny<CancellationToken>()), Times.Once);
        }

        private static async Task<IResult> ExecutarEndpointCriarChat(CriarChatCommand command, IMediator mediator)
        {
            try
            {
                var result = await mediator.Send(command);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message);
            }
        }
    }
}
