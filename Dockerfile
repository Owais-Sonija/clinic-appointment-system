# ---- Backend Build Stage ----
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

# ---- Frontend Build Stage ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production
WORKDIR /app

# Copy backend build
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./
RUN npm ci --only=production

# Copy frontend build to serve as static
COPY --from=frontend-build /app/frontend/dist ./public

# Create logs directory
RUN mkdir -p logs

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
