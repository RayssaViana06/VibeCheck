using MediatR;
using Message.Application.Commands;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Message.TestUnit.Controllers
{
    public class BuscarChatControllerTest
    {
        [Fact]
        public async Task BuscarChats_DeveRetornarOk_QuandoMediatorExecutarComSucesso()
        {
            var chatId = "usuario-1";
            var resposta = new BuscarChatsResponse([]);
            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.Is<BuscarChatsCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(resposta);

            var result = await ExecutarEndpointBuscarChats(chatId, mediatorMock.Object);
            var okResult = Assert.IsType<Ok<BuscarChatsResponse>>(result);

            Assert.Equal(resposta, okResult.Value);
            mediatorMock.Verify(m => m.Send(It.Is<BuscarChatsCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task BuscarChats_DeveRetornarProblem_QuandoMediatorLancarExcecao()
        {
            var chatId = "usuario-erro";
            var mediatorMock = new Mock<IMediator>();

            mediatorMock
                .Setup(m => m.Send(It.Is<BuscarChatsCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("falha ao buscar chats"));

            var result = await ExecutarEndpointBuscarChats(chatId, mediatorMock.Object);
            var problemResult = Assert.IsType<ProblemHttpResult>(result);

            Assert.Equal(StatusCodes.Status500InternalServerError, problemResult.StatusCode);
            Assert.Equal("falha ao buscar chats", problemResult.ProblemDetails.Detail);
            mediatorMock.Verify(m => m.Send(It.Is<BuscarChatsCommand>(c => c.ChatId == chatId), It.IsAny<CancellationToken>()), Times.Once);
        }

        private static async Task<IResult> ExecutarEndpointBuscarChats(string id, IMediator mediator)
        {
            try
            {
                var query = new BuscarChatsCommand(id);
                var result = await mediator.Send(query);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message);
            }
        }
    }
}
