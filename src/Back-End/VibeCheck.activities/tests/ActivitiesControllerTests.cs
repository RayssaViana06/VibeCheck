using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Atividades.Tests
{
    public class ActivitiesSmokeSystemTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        private const string TokenValido = "SEU_TOKEN_JWT_AQUI";


        private const string PsicologoId = "69d532a679273df9d88a0843";

        public ActivitiesSmokeSystemTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GET_Health_DeveRetornar200()
        {

            var response = await _client.GetAsync("/health");


            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GET_Activities_SemToken_DeveRetornar401()
        {
            _client.DefaultRequestHeaders.Authorization = null;


            var response = await _client.GetAsync("/api/activities");


            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GET_Activities_ComTokenValido_DeveRetornar200()
        {
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", TokenValido);
            _client.DefaultRequestHeaders.Remove("X-Psicologo-Id");
            _client.DefaultRequestHeaders.Add("X-Psicologo-Id", PsicologoId);

            var response = await _client.GetAsync("/api/activities");


            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}