\
# Esta fase é usada durante a execução no VS no modo rápido (Padrão para a configuração de Depuração)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# Esta fase é usada para compilar o projeto de serviço
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Message.Api/Message.Api.csproj", "Message.Api/"]
COPY ["Message.Application/Message.Application.csproj", "Message.Application/"]
COPY ["Message.Domain/Message.Domain.csproj", "Message.Domain/"]
COPY ["Message.Infra/Message.Infra.csproj", "Message.Infra/"]
RUN dotnet restore "./Message.Api/Message.Api.csproj"
COPY . .
WORKDIR "/src/Message.Api"
RUN dotnet build "./Message.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Esta fase é usada para publicar o projeto de serviço a ser copiado para a fase final
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Message.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Esta fase é usada na produção ou quando executada no VS no modo normal (padrão quando não está usando a configuração de Depuração)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Message.Api.dll"]