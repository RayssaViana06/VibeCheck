using Message.Domain.Models;
using Message.Infra.Documents;
using Message.Infra.Services;
using Moq;
using MongoDB.Driver;

namespace Message.TestUnit.Repository
{
    public class MessageRepositoryTest
    {
        [Fact]
        public async Task SaveMessage_DeveInserirDocumento_QuandoMensagemForValida()
        {
            var mensagem = new Mensagem("chat-1", "olá", "usuario-1");
            var (repository, messageCollectionMock) = CriarRepositorio();

            await repository.SaveMessage(mensagem);

            messageCollectionMock.Verify(c => c.InsertOneAsync(
                It.Is<MensagemDocument>(d =>
                    d.Id == mensagem.Id &&
                    d.ChatId == mensagem.ChatId &&
                    d.Texto == mensagem.Texto &&
                    d.UsuarioOrigem == mensagem.UsuarioOrigem),
                It.IsAny<InsertOneOptions>(),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SaveMessage_DevePropagarExcecao_QuandoInsertFalhar()
        {
            var mensagem = new Mensagem("chat-1", "olá", "usuario-1");
            var (repository, messageCollectionMock) = CriarRepositorio();

            messageCollectionMock
                .Setup(c => c.InsertOneAsync(
                    It.IsAny<MensagemDocument>(),
                    It.IsAny<InsertOneOptions>(),
                    It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("falha ao salvar"));

            await Assert.ThrowsAsync<Exception>(() => repository.SaveMessage(mensagem));
        }

        private static (MessageRepository repository, Mock<IMongoCollection<MensagemDocument>> messageCollectionMock) CriarRepositorio()
        {
            var mongoClientMock = new Mock<IMongoClient>();
            var mongoDatabaseMock = new Mock<IMongoDatabase>();
            var messageCollectionMock = new Mock<IMongoCollection<MensagemDocument>>();

            mongoClientMock
                .Setup(m => m.GetDatabase(It.IsAny<string>(), It.IsAny<MongoDatabaseSettings>()))
                .Returns(mongoDatabaseMock.Object);

            mongoDatabaseMock
                .Setup(m => m.GetCollection<MensagemDocument>(It.IsAny<string>(), It.IsAny<MongoCollectionSettings>()))
                .Returns(messageCollectionMock.Object);

            var repository = new MessageRepository(mongoClientMock.Object);
            return (repository, messageCollectionMock);
        }
    }
}
