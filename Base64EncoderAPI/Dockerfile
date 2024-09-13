FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT Docker

EXPOSE 5199

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Base64EncoderAPI.csproj", "."]
RUN dotnet restore "./Base64EncoderAPI.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Base64EncoderAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Base64EncoderAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Base64EncoderAPI.dll"]