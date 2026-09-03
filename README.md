# ARDI LED

Сайт-каталог и административная панель для LED-экранов с Go backend и React/Vite frontend.

## Стек

- Frontend: React, TypeScript, Vite
- Backend: Go, Gin, GORM, PostgreSQL
- Уведомления: Telegram Bot API

## Локальный запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Скопируйте `.env.example` в `.env` и заполните значения:
   - `DATABASE_URL`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
3. Запустите frontend в режиме разработки:
   ```bash
   npm run dev
   ```
4. Запустите backend:
   ```bash
   go run .
   ```

## Production checklist

- Убедитесь, что `GIN_MODE=release`
- Используйте отдельную production базу данных
- Задайте надежные `ADMIN_USERNAME` и `ADMIN_PASSWORD`
- Используйте актуальный Telegram bot token и `TELEGRAM_CHAT_ID`
- Выполните frontend build:
  ```bash
  node node_modules/vite/bin/vite.js build
  ```
- Проверьте backend тесты:
  ```bash
  go test ./...
  ```

## CI/CD и миграции

Схема базы обновляется автоматически при старте backend через `AutoMigrate`.

Это значит:

- `DATABASE_URL` все равно обязателен
- отдельную ручную команду миграции запускать не нужно
- после деплоя новый контейнер стартует, подключается к production БД и сам приводит таблицы к актуальной схеме

Для GitHub Actions добавьте secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PASSWORD`
- `SERVER_PATH`
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Pipeline делает:

1. `npm ci`
2. `tsc --noEmit`
3. `vite build`
4. `go test ./...`
5. сборку и push Docker image
6. запись production env на сервер
7. `docker-compose up -d --remove-orphans`

Если `docker-compose` на сервере использует `.env`, backend автоматически получит `DATABASE_URL` и прогонит миграции при старте.

## Админка

- URL: `/admin`
- Доступ только по Basic Auth через `ADMIN_USERNAME` и `ADMIN_PASSWORD`
- Все операции изменения контента и просмотр заявок защищены авторизацией

## Telegram

Все публичные формы отправляют заявки в backend, а backend отправляет уведомление в Telegram, используя:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
