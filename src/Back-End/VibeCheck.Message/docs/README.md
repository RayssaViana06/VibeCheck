# README

## 1) Visão geral
A `VibeCheck.Message` é uma API de mensagens/chat construída em `.NET 10` com:
- `Minimal APIs` para operações de chat
- `SignalR` para mensagens em tempo real
- `JWT Bearer` para autenticação
- `MongoDB` para persistência
- `MediatR` para fluxo de comandos/handlers

---

## 2) Stack técnica
- Runtime: `net10.0`
- API: `ASP.NET Core` (`Minimal API`)
- Realtime: `SignalR`
- Banco: `MongoDB.Driver`
- Orquestração de casos de uso: `MediatR`
- Documentação interativa: `Swagger` (em ambiente `Development`)

---

## 3) Arquitetura por projetos
- `Message.Api`
  - Configuração da aplicação (`Program.cs`)
  - Endpoints HTTP
  - Hub SignalR (`MessageProvider`)
  - Middleware global de exceções
- `Message.Application`
  - Commands/Responses
  - Handlers (`MediatR`)
- `Message.Domain`
  - Entidades (`Chat`, `Mensagem`)
  - Contratos (`IChatRepository`, `IMessageRepository`, `IMessageProvider`)
  - Constantes de banco/ambiente
- `Message.Infra`
  - Repositórios Mongo (`ChatRepository`, `MessageRepository`)
  - Documents e mapeadores

---

## 4) Configuração e execução local
## 4.1 URLs de execução (launch settings)
- HTTP: `http://localhost:5239`
- HTTPS: `https://localhost:7082`
- Swagger: `/swagger` (somente em `Development`)

## 4.2 Variáveis de ambiente obrigatórias
- `MONGO_MESSAGE_URI` → string de conexão MongoDB
- `JWT_SECRET_KEY` → chave simétrica para validação de token JWT

> Observação: a constante `MONGO_USER_URI` existe no domínio, mas nesta API o `MongoClient` é criado com `MONGO_MESSAGE_URI`.

## 4.3 JWT esperado pela API
A validação JWT exige:
- `issuer`: `auth-service`
- `audience`: `vibecheck-app`
- assinatura com a chave de `JWT_SECRET_KEY`
- validade temporal habilitada (`ValidateLifetime = true`)

---

## 5) Segurança e CORS
## 5.1 Autenticação
Todos os endpoints de chat e o hub exigem `[Authorize]`.

Para REST:
`Authorization: Bearer {token}`

Para SignalR (fallback em query string):
`/message/hub?access_token={token}`

## 5.2 CORS
- Em `Development`: aceita qualquer origem (`SetIsOriginAllowed(_ => true)`), métodos e headers.
- Fora de `Development`: apenas origens explícitas hardcoded:
  - `https://seusite.com.br`
  - `https://www.seusite.com.br`
  - `https://app.seusite.com.br`

---

## 6) Contrato de dados
## 6.1 Chat
```json
{
  "id": "string-guid",
  "pacienteId": "string",
  "psicologoId": "string",
  "createAt": "2026-01-01T12:00:00Z"
}
```

## 6.2 Mensagem
```json
{
  "id": "string-guid",
  "chatId": "string-guid",
  "texto": "texto da mensagem",
  "usuarioOrigem": "string",
  "createAt": "2026-01-01T12:00:00Z"
}
```

## 6.3 SendMessageRequest (SignalR)
```json
{
  "chatId": "string-guid",
  "texto": "conteúdo da mensagem",
  "usuarioDestinoId": "string"
}
```

---

## 7) Endpoints REST
Base local (HTTP): `http://localhost:5239`

## 7.1 Criar chat
- Método: `POST`
- Rota: `/chats/criar-chat`
- Auth: obrigatória

Request body (`CriarChatCommand`):
```json
{
  "pacienteId": "paciente-1",
  "psicologoId": "psicologo-1"
}
```

Response `200 OK` (`CriarChatResponse`):
```json
{
  "chatResponse": {
    "id": "5de5f58a-4f86-4be8-aa36-8af932e8bb2c",
    "pacienteId": "paciente-1",
    "psicologoId": "psicologo-1",
    "createAt": "2026-01-01T12:00:00Z"
  }
}
```

## 7.2 Buscar chats de usuário
- Método: `GET`
- Rota: `/chats/buscar-chats/{id}`
- Auth: obrigatória

Parâmetro de rota:
- `id` = identificador do usuário usado para filtrar chats (`PacienteId` OU `PsicologoId`)

Response `200 OK` (`BuscarChatsResponse`):
```json
{
  "chats": [
    {
      "id": "5de5f58a-4f86-4be8-aa36-8af932e8bb2c",
      "pacienteId": "paciente-1",
      "psicologoId": "psicologo-1",
      "createAt": "2026-01-01T12:00:00Z"
    }
  ]
}
```

## 7.3 Deletar chat
- Método: `DELETE`
- Rota: `/chats/deletar-chat/{id}`
- Auth: obrigatória

Parâmetro de rota:
- `id` = ID do chat

Response `200 OK` sem corpo.

---

## 8) SignalR (tempo real)
- Hub: `/message/hub`
- Classe: `MessageProvider : Hub<IMessageProvider>`
- Auth: obrigatória

## 8.1 Método cliente → servidor
Método invocado: `SendMessage`

Payload:
```json
{
  "chatId": "5de5f58a-4f86-4be8-aa36-8af932e8bb2c",
  "texto": "Olá!",
  "usuarioDestinoId": "usuario-2"
}
```

Comportamento no servidor:
1. Obtém `usuarioOrigemId` de `Context.UserIdentifier`
2. Cria objeto `Mensagem`
3. Persiste no Mongo (`IMessageRepository.SaveMessage`)
4. Envia ao destinatário com `Clients.User(usuarioDestinoId).ReceiveMessage(mensagem)`

## 8.2 Método servidor → cliente
Evento para escutar no client: `ReceiveMessage`

Payload recebido (`Mensagem`):
```json
{
  "id": "37d3f2a6-0226-4746-82b4-5ed13d4ee380",
  "chatId": "5de5f58a-4f86-4be8-aa36-8af932e8bb2c",
  "texto": "Olá!",
  "usuarioOrigem": "usuario-1",
  "createAt": "2026-01-01T12:00:00Z"
}
```

---

## 9) Persistência MongoDB
Banco utilizado: `Conversas`

Coleções:
- `Chat`
- `Message`

Documentos:
- `ChatDocument`: `Id`, `PacienteId`, `PsicologoId`, `CreateAt`
- `MensagemDocument`: `Id`, `ChatId`, `Texto`, `UsuarioOrigem`, `CreateAt`

---

## 10) Tratamento de erros
Middleware global: `ExceptionMiddleware`

Em exceções não tratadas:
- Status: `500 Internal Server Error`
- Content-Type: `application/json`

Resposta em `Development` inclui stack trace:
```json
{
  "statusCode": "500",
  "message": "mensagem da exceção",
  "datails": "stack trace"
}
```

Em produção:
```json
{
  "statusCode": "500",
  "message": "Internal Server Error"
}
```

---

## 11) Exemplos rápidos
## 11.1 cURL — criar chat
```bash
curl -X POST "https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/chats/criar-chat" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pacienteId":"paciente-1","psicologoId":"psicologo-1"}'
```

## 11.2 cURL — buscar chats
```bash
curl "https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/chats/buscar-chats/{id}" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 11.3 cURL — deletar chat
```bash
curl -X DELETE "https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/chats/deletar-chat/{id}" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 12) Fluxos funcionais (resumo)
## 12.1 Criar chat
`HTTP -> Endpoint -> MediatR -> Handler -> IChatRepository -> Mongo(Chat) -> Response`

## 12.2 Buscar chats
`HTTP -> Endpoint -> MediatR -> Handler -> IChatRepository.GetChatsAsync(userId) -> Mongo(Chat) -> Lista`

## 12.3 Enviar mensagem em tempo real
`SignalR Client -> Hub.SendMessage -> SaveMessage(Mongo) -> Clients.User(destino).ReceiveMessage`

---

## 13) Observações técnicas importantes
- O título Swagger está definido como `APIContagem` (pode não refletir o nome do serviço).
- O endpoint de deletar chat usa **rota com `{id}`** (não body).
- O parâmetro `{id}` de busca representa o usuário para filtro (`PacienteId`/`PsicologoId`).
- `UserIdentifier` no SignalR precisa estar corretamente mapeado a partir do token para o roteamento por usuário funcionar.

---

## 14) Checklist de consumo da API
- [ ] Definir `MONGO_MESSAGE_URI`
- [ ] Definir `JWT_SECRET_KEY`
- [ ] Garantir token com `iss=auth-service` e `aud=vibecheck-app`
- [ ] Enviar `Bearer` no REST
- [ ] Em SignalR browser, enviar `access_token` na query
- [ ] Escutar evento `ReceiveMessage` no client
