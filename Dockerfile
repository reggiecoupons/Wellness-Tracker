FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p /data
ENV DB_PATH=/data/wellness.db
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
