# Stage 1: Build the Angular app
FROM node:18.19 AS build
WORKDIR /app

# Copy the Angular project files
COPY . .

# Install dependencies
RUN npm install

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/base64-encoder-client/browser /usr/share/nginx/html

# Expose the port used by Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
