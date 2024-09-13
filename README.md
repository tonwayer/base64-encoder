# Base64 Encoder Application

A full-stack app with **Angular** frontend and **ASP.NET Core** backend, using SignalR for real-time Base64 encoding.

## Features
- Real-time updates via SignalR.
- Dockerized frontend and backend.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Setup Instructions

### Run with Docker Compose
1. **Clone the repo**:
   ```bash
   git clone https://github.com/tonwayer/base64-encoder-app.git
   cd base64-encoder-app
   ```

2. **Build and start the services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the app**:
   - **Frontend (Angular)**: `http://localhost`
   - **Backend (ASP.NET Core)**: `http://localhost:5199`

4. **Stop the services**:
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)
1. **Backend**:
   ```bash
   cd backend
   dotnet run
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   ng serve
   ```