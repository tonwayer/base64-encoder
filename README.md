# Base64 Encoder Application

This project consists of a **backend** (ASP.NET Core with SignalR) and a **frontend** (Angular) to encode user-provided text into Base64 format, displaying the result character-by-character with random delays using real-time updates via SignalR.

## Features
- Angular frontend for user input and displaying results in real time.
- ASP.NET Core backend for Base64 encoding and sending real-time updates via SignalR.
- Dockerized setup for both frontend and backend services.
- CORS configuration for cross-origin communication between Angular and ASP.NET Core.

---

## Prerequisites
Before you start, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (for Angular development)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

---

## Project Structure
```
project-root/
│
├── backend/              # ASP.NET Core Backend
│   ├── Dockerfile        # Dockerfile for Backend
│   ├── ...               # Other backend files (Program.cs, etc.)
│
├── frontend/             # Angular Frontend
│   ├── Dockerfile        # Dockerfile for Frontend
│   ├── ...               # Angular project files
│
├── docker-compose.yml    # Docker Compose file for both frontend and backend
```

---

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/base64-encoder-app.git
cd base64-encoder-app
```

### 2. Build and Run Using Docker Compose

To build and run both the **ASP.NET Core** backend and **Angular** frontend using Docker Compose, run the following command from the root of the project:

```bash
docker-compose up --build
```

This command will:
- Build the Angular frontend and serve it using **Nginx** on port `80`.
- Build the ASP.NET Core backend and serve it on port `5000`.
  
Once the build is complete, you can access the application at:
- **Frontend (Angular)**: `http://localhost`
- **Backend (ASP.NET Core)**: `http://localhost:5000`

### 3. Stop the Services
To stop the running containers, execute:
```bash
docker-compose down
```

---

## Running the Project Locally (Without Docker)

### Backend (ASP.NET Core)

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Build and run the backend:
   ```bash
   dotnet build
   dotnet run
   ```

   By default, the backend will be served on `http://localhost:5000`.

### Frontend (Angular)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies and start the Angular app:
   ```bash
   npm install
   ng serve
   ```

   The frontend will be available at `http://localhost:4200`.

---

## CORS Configuration (Backend)

In `Program.cs` (backend), CORS is configured to allow cross-origin requests from the Angular frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost")  // Allow frontend to call backend
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();  // Required for SignalR
    });
});
app.UseCors();
```

Ensure this is configured correctly to avoid CORS errors during frontend-backend communication.

---

## Docker Setup

### Dockerfile for ASP.NET Core (Backend)
The `backend/Dockerfile` builds and publishes the ASP.NET Core application:

```dockerfile
# Use the official .NET SDK image to build and publish the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# Use the official .NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /out .
EXPOSE 5000
ENTRYPOINT ["dotnet", "Base64EncoderAPI.dll"]
```

### Dockerfile for Angular (Frontend)
The `frontend/Dockerfile` builds and serves the Angular app using Nginx:

```dockerfile
# Stage 1: Build the Angular app
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html
EXPOSE 80
```

### Docker Compose File
The `docker-compose.yml` orchestrates the frontend and backend services:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_URLS=http://*:5000
    depends_on:
      - frontend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure that CORS is configured correctly in the backend to allow requests from the frontend.
   
2. **Port Conflicts**: If the default ports (80, 5000) are being used by other services, update the `docker-compose.yml` file to use available ports.

---
