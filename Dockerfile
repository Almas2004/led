# ===== FRONT build (Vite) =====
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== BACK build (Go) =====
FROM golang:1.23-alpine AS backend
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o ledvision-api .

# ===== FINAL image =====
FROM alpine:3.20
WORKDIR /app

# certificates (если API ходит наружу по https)
RUN apk add --no-cache ca-certificates

# копируем бэк и фронт билд
COPY --from=backend /app/ledvision-api /app/ledvision-api
COPY --from=frontend /app/dist /app/dist

# порт укажи тот, который реально слушает Go (если :8080 — оставь)
EXPOSE 8082
ENV PORT=8082

# ВАЖНО: твой Go сервер должен уметь отдавать dist (или использовать Nginx отдельно).
# Если Go уже отдает статику из ./dist — отлично.
CMD ["/app/ledvision-api"]