# Etapa de construcción
FROM node:18.20.5 AS builder

WORKDIR /app

# Configurar npm para evitar problemas de versiones
RUN npm install -g npm@10.8.2

# Copiar archivos de configuración antes de instalar dependencias
COPY package*.json package-lock.json .npmrc ./

# Limpiar la caché de npm y luego instalar dependencias
RUN npm cache clean --force && npm ci --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa final
FROM node:18.20.5

WORKDIR /app

# Configurar npm en el contenedor final
RUN npm install -g npm@10.8.2

# Copiar solo lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json /app/package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production --legacy-peer-deps

# Puerto de la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["npm", "run", "start:prod"]