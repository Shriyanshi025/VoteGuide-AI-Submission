# Step 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Build Backend
FROM node:20-slim
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
COPY --from=frontend-builder /app/dist ./public
RUN npm run build

EXPOSE 8080
ENV PORT=8080
CMD ["npm", "start"]
