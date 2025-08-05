FROM node:20
WORKDIR /app

# Instala dependencias primero (caché eficiente)
COPY package*.json ./
RUN npm install

# Copia el resto de archivos
COPY . .

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]