using MediatR;
using Message.Application.Commands;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Message.TestUnit.Controllers
{
    public class DeletarChatControllerTest
    {
        [Fact]
        public async Task DeletarChat_DeveRetornarOk_QuandoMediatorExecutarComSucesso()
        {
            var chatId = "chat-1";
            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.Is<DeletarChatCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var result = await ExecutarEndpointDeletarChat(chatId, mediatorMock.Object);
            var okResult = Assert.IsType<Ok>(result);

            Assert.NotNull(okResult);
            mediatorMock.Verify(m => m.Send(It.Is<DeletarChatCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeletarChat_DeveRetornarProblem_QuandoMediatorLancarExcecao()
        {
            var chatId = "chat-erro";
            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.Is<DeletarChatCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("erro ao deletar chat"));

            var result = await ExecutarEndpointDeletarChat(chatId, mediatorMock.Object);
            var problemResult = Assert.IsType<ProblemHttpResult>(result);

            Assert.Equal(StatusCodes.Status500InternalServerError, problemResult.StatusCode);
            Assert.Equal("erro ao deletar chat", problemResult.ProblemDetails.Detail);
            mediatorMock.Verify(m => m.Send(It.Is<DeletarChatCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()), Times.Once);
        }

        private static async Task<IResult> ExecutarEndpointDeletarChat(string id, IMediator mediator)
        {
            try
            {
                var command = new DeletarChatCommand { ChatId = id };
                await mediator.Send(command);
                return Results.Ok();
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message);
            }
        }
    }
}
