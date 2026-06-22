using Message.Domain.Models;
using Message.Infra.Documents;
using Message.Infra.Services;
using Moq;
using MongoDB.Driver;

namespace Message.TestUnit.Repository
{
    public class ChatRepositoryTest
    {
        [Fact]
        public async Task CreateChatAsync_DeveInserirDocumentoEretornarChat_QuandoDadosValidos()
        {
            var chat = new Chat("paciente-1", "psicologo-1");
            var (repository, _, chatCollectionMock) = CriarRepositorio();

            var resultado = await repository.CreateChatAsync(chat);

            Assert.Equal(chat, resultado);
            chatCollectionMock.Verify(c => c.InsertOneAsync(
                It.IsAny<ChatDocument>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CreateChatAsync_DeveLancarArgumentNullException_QuandoChatForNulo()
        {
            var (repository, _, chatCollectionMock) = CriarRepositorio();

            await Assert.ThrowsAsync<ArgumentNullException>(() => repository.CreateChatAsync(null!));
            chatCollectionMock.Verify(c => c.InsertOneAsync(
                It.IsAny<ChatDocument>(),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task DeleteChatASync_DeveExecutarDeleteOne_QuandoChatIdForValido()
        {
            var chatId = "chat-1";
            var (repository, _, chatCollectionMock) = CriarRepositorio();

            await repository.DeleteChatASync(chatId);

            chatCollectionMock.Verify(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<ChatDocument>>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

      
        private static (ChatRepository repository, Mock<IMongoClient> mongoClientMock, Mock<IMongoCollection<ChatDocument>> chatCollectionMock) CriarRepositorio()
        {
            var mongoClientMock = new Mock<IMongoClient>();
            var mongoDatabaseMock = new Mock<IMongoDatabase>();
            var chatCollectionMock = new Mock<IMongoCollection<ChatDocument>>();

            mongoClientMock
                .Setup(m => m.GetDatabase(It.IsAny<string>(), It.IsAny<MongoDatabaseSettings>()))
                .Returns(mongoDatabaseMock.Object);

            mongoDatabaseMock
                .Setup(m => m.GetCollection<ChatDocument>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                .Returns(chatCollectionMock.Object);

            var repository = new ChatRepository(mongoClientMock.Object);
            return (repository, mongoClientMock, chatCollectionMock);
        }
    }
}
