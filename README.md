# ССРВП - Лабораторные работы

Современные средства разработки веб-приложений. Курс лабораторных работ по React, Redux и современным веб-технологиям.

## 🚀 Технологический стек

- **Frontend:** React 18, Redux Toolkit, RTK Query
- **UI:** Material-UI (MUI), Emotion CSS-in-JS
- **Routing:** React Router v6
- **State Management:** Redux Toolkit, RTK Query
- **Testing:** Jest, React Testing Library
- **Build Tools:** Webpack, Babel
- **Code Quality:** ESLint, Prettier

## 📦 Установка и запуск

```bash
# Клонирование репозитория
git clone https://github.com/nblchd/modern-web-labs
cd modern_web_labs

# Установка зависимостей
npm install

# Запуск frontend
npm start

# Запуск backend (в отдельном терминале)
cd server
npm install
npm start

# Запуск тестов
npm test

# Сборка для продакшена
npm run build
```

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
├── pages/              # Страницы приложения
├── store/              # Redux store и slices
├── routes/             # Роутинг и ленивые импорты
└── assets/             # Статические файлы

server/
├── server.js           # Express сервер
├── db.json            # JSON база данных
└── package.json       # Зависимости сервера
```

## 🎯 Лабораторные работы

| №  | Тема | Описание | Статус |
|----|------|----------|--------|
| 1  | **Основы React** | Компоненты, JSX, состояние | ✅ |
| 2  | **Пользовательские компоненты** | Переиспользуемые компоненты | ✅ |
| 3  | **Маршрутизация** | React Router, навигация | ✅ |
| 4  | **Жизненный цикл** | useEffect, Redux | ✅ |
| 5  | **Формы и валидация** | React Hook Form, обратная связь | ✅ |
| 6  | **REST API** | HTTP запросы, промисы | ✅ |
| 7  | **UI Kit & Адаптивность** | Material-UI, responsive | ✅ |
| 8  | **React Table & Роли** | Таблицы, админ панель | ✅ |
| 9  | **Тестирование & RTK Query** | Jest, оптимизация | ✅ |

## ⭐ Основные возможности

### 👥 Система пользователей
- Регистрация и авторизация
- Роли: администратор и пользователь
- Управление профилем

### 🛡️ Панель администрирования
- Dashboard с аналитикой
- Управление пользователями
- Модерация отзывов
- Продвинутые таблицы с RTK Query

### 📊 Продвинутые таблицы
- Сортировка и фильтрация
- Drag & Drop колонок
- Виртуализация больших данных
- Адаптивность для мобильных

### 🔄 RTK Query
- Автоматическое кеширование
- Оптимистичные обновления
- Обработка loading/error состояний
- Фоновая синхронизация


## 🎮 Демо аккаунты

| Роль | Логин | Пароль |
|------|-------|-------|
| Администратор | `admin` | `admin123` |
| Пользователь | `user` | `123` |

## 🌟 Highlights

- **Modern React:** Hooks, Context, Suspense
- **Performance:** Code splitting, lazy loading, мемоизация
- **UX:** Responsive design, анимации, loading states
- **DX:** TypeScript support, ESLint, hot reload
- **Testing:** Unit тесты, интеграционные тесты
- **Architecture:** Clean code, SOLID principles`

## 📱 Адаптивность

- **Desktop:** Полная функциональность
- **Tablet:** Адаптивные таблицы, боковое меню
- **Mobile:** Bottom navigation, drawer menu, touch-friendly

## 🤝 Contributing

1. Fork репозитория
2. Создать feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Открыть Pull Request

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE) файл

---

**Автор:** Студент курса ССРВП  Соколов Иван
**Университет:** Алтайский государственный университет
