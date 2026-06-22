using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests.MessageService;
using Gateway.Domain.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [ApiController]
    public class MessageController(IMessageAppServices messageServices) : ControllerBase
    {
        private readonly IMessageAppServices messageAppServices = messageServices;

        private string AuthHeader =>
            Request.Headers["Authorization"].ToString();

        [Authorize]
        [HttpPost("gateway/message/criar-chat")]
        public async Task<CriarChatResponse> CriarChat([FromBody] CriarChatRequest request)
            => await messageAppServices.CriarChat(request, AuthHeader);

        [Authorize]
        [HttpGet("gateway/message/buscar-chats/{userId}")]
        public async Task<BuscarChatResponse> BuscarChat([FromRoute] string userId)
            => await messageAppServices.BuscarChat(userId, AuthHeader);

        [Authorize]
        [HttpDelete("gateway/message/deletar-chat/{chatId}")]
        public void DeletarChat([FromRoute] Guid chatId)
            => messageAppServices.DeletarChat(chatId, AuthHeader);
    }
}
