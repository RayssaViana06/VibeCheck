
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
 

COPY Atividades.csproj ./
 

RUN dotnet restore --disable-parallel
 

COPY . ./
 

RUN dotnet publish -c Release -o /app/publish
 

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
 
COPY --from=build /app/publish .
 
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
 
ENV MongoDB__ConnectionString=""
ENV MongoDB__DatabaseName="psicologia_db"
ENV MongoDB__ActivitiesCollection="activities"
 
ENV DiarioDB__ConnectionString=""
ENV DiarioDB__DatabaseName="diario_terapeutico"
ENV DiarioDB__DiarioCollection="diaryEntries"
 
ENV Jwt__SecretKey=""
ENV Jwt__Issuer="auth-service"
ENV Jwt__Audience="vibecheck-app"
 
EXPOSE 8080
 
ENTRYPOINT ["dotnet", "Atividades.dll"]