# Stage 1: Development & Build
FROM node:20-bullseye as development

# Install system dependencies (kept for potential future Electron needs, though less critical for web-only)
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y \
    wine \
    wine32 \
    wine64 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

COPY package*.json ./
RUN npm install

COPY . .

# Expose Vite port
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 2: Build (runs the build script)
FROM development as builder
RUN npm run build

# Stage 3: Production Web Server
FROM nginx:alpine as production
COPY --from=builder /workspace/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
