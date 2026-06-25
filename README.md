# ARDI LED — статический сайт для GitHub Pages

Полностью статический сайт для продажи и аренды LED-экранов.  
Технологии: `HTML`, `CSS`, `Vanilla JavaScript`.

## Структура проекта

- `index.html`
- `css/style.css`
- `js/main.js`
- `assets/images`
- `assets/icons`
- `assets/video`

## Что сделано

- полностью убраны React и Go backend
- удалены API-зависимости и серверная логика
- форма заявок работает через WhatsApp-ссылку
- сайт открывается простым запуском `index.html`
- добавлены SEO-мета-теги, Open Graph и favicon
- есть адаптивность, анимации, FAQ, sticky header, counters и parallax

## Локальная проверка

Никакой сервер не нужен.

1. Открой `index.html` двойным кликом.
2. Проверь навигацию по секциям.
3. Проверь форму WhatsApp.
4. Проверь мобильную версию через DevTools.

## Как загрузить на GitHub Pages

### Вариант 1. Через GitHub Actions

1. Загрузи проект в GitHub.
2. Открой репозиторий.
3. Перейди в `Settings` → `Pages`.
4. В блоке `Build and deployment` выбери `GitHub Actions`.
5. После этого каждый push в `main` будет публиковать сайт автоматически.

### Вариант 2. Без workflow

1. Открой `Settings` → `Pages`.
2. В `Source` выбери `Deploy from a branch`.
3. Укажи ветку `main` и папку `/root`.
4. Сохрани настройки.

## Контакты

- Телефон: `+7 776 987 9977`
- WhatsApp: `https://api.whatsapp.com/send/?phone=77769879977&text&type=phone_number&app_absent=0`
- Город: Алматы
