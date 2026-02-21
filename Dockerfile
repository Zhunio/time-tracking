# Stage 1: Build the application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies using clean install for reproducible builds
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build-time value passed from Coolify (or `docker build --build-arg ...`).
ARG VITE_BASE_URL

# Make it available to `npm run build`, since Vite reads `VITE_*` during build.
ENV VITE_BASE_URL=${VITE_BASE_URL}

# Build the production bundle
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine AS runtime

# Replace the default Nginx config with our custom SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
