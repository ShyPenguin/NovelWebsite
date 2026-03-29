# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything
COPY . .

# Install deps
RUN npm install

# Build only what you need
RUN npx turbo run build --filter=frontend...

# Stage 2: Nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY infra/nginx/nginx.stage.conf /etc/nginx/conf.d/default.conf

# Copy built frontend
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]