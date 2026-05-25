# --- Etapa 1: Base de Node.js ---
# Se utiliza la versión liviana alpine de Node.js 20 como recomendación de rendimiento y seguridad
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# --- Etapa 2: Entorno de Desarrollo / Testing ---
# Esta etapa instala todas las dependencias (incluyendo devDependencies para poder correr Jest)
FROM base AS development
COPY package*.json ./
RUN npm ci
COPY . .

# --- Etapa 3: Construcción de Producción ---
# Instala únicamente las dependencias necesarias para producción y copia el código fuente
FROM base AS build
COPY package*.json ./
# Instala solo las dependencias declaradas bajo "dependencies" ignorando "devDependencies"
RUN npm ci --only=production
COPY src/ ./src/

# --- Etapa 4: Imagen de Producción Final ---
# Crea una imagen limpia y minimalista, copiando solo lo necesario de la etapa build
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copiar dependencias de producción y código de la etapa de construcción
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/src ./src
COPY package.json ./

# Cambiar el usuario del contenedor al usuario 'node' no root incorporado por seguridad
USER node

# Indicar que la aplicación escucha en el puerto 3000
EXPOSE 3000

# Ejecutar el comando para iniciar el servidor de producción
CMD ["node", "src/server.js"]
