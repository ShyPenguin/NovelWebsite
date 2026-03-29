FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom config
COPY ./nginx.stage.conf /etc/nginx/conf.d/default.conf

# Render requires port 10000
EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]