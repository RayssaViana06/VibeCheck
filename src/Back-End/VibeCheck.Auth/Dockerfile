FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["VibeCheck.csproj", "."]
RUN dotnet restore "./VibeCheck.csproj"
COPY . .
RUN dotnet build "./VibeCheck.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "./VibeCheck.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "VibeCheck.dll"]