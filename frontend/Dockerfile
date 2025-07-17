# Construcción con Node.js
FROM node:18 AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --force

COPY . .
RUN npm run build

# Nginx para servir la aplicación
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]