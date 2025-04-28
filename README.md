# Stellar Burger

Репозиторий вашего приложения «Stellar Burger» — модульный React + TypeScript проект с Redux Toolkit, React Router, Cypress и Jest.

---

## Содержание

1. [Описание проекта](#описание-проекта)  
2. [Реализованные фичи](#реализованные-фичи)  
   - Первый спринт (роутинг, авторизация, профиль, лента, история)  
   - Второй спринт (E2E-тесты, unit-тесты)  
3. [Установка и запуск](#установка-и-запуск)  
4. [Тестирование](#тестирование)  
   - Cypress  
   - Jest  

---

## Описание проекта

«Stellar Burger» — SPA-приложение для заказа «космических» бургеров:

- **Конструктор**: выбираете булку, соусы и начинки, смотрите итоговую цену.
- **Лента заказов**: глобальная лента всех заказов в реальном времени через WebSocket.
- **Профиль & история**: личный кабинет с редактированием данных и историей собственных заказов (также через WebSocket).
- **Авторизация & регистрация**: защищённые маршруты, токены хранятся в cookie & localStorage.

---

## Реализованные фичи

### Первый спринт

- **Routing**  
  – React Router v6: настроены все маршруты `/`, `/feed`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/profile`, `/profile/orders`, а также динамические модалки `/ingredients/:id`, `/feed/:id`, `/profile/orders/:id` через `location.state`.  
- **ProtectedRoute**  
  – неавторизованные пользователи перенаправляются на `/login` при попытке открыть защищённые страницы; авторизованные — не могут попасть на `/login`, `/register`, `/forgot-password`, `/reset-password`.  
- **Редактирование профиля**  
  – форма с предзаполненными данными, кнопки **Сохранить**/**Отменить** появляются только при изменениях, запросы на `PATCH /auth/user`.  
- **Лента заказов**  
  – `/feed` доступен всем, WebSocket-соединение к `wss://…/orders` + подсчёт стоимости и отображение `total`/`totalToday`.  
- **История заказов**  
  – `/profile/orders` для авторизованных, WebSocket к `wss://…/orders?token=…`, отображение статусов (`created`, `pending`, `done`).  
- **Модалки**  
  – детали ингредиента и заказа через `Modal` + портал в `#modals`, закрытие кнопкой и по клавише Esc.  
- **UX**  
  – прелоадеры при загрузке данных, обработка ошибок.

### Второй спринт

- **Cypress E2E-тесты** (`cypress/e2e/constructor.cy.tsx`)  
  - моковые fixtures (`ingredients.json`, `user.json`, `orderResponse.json`)  
  - `cy.intercept` для `GET /api/ingredients`, `POST /api/orders`, `GET /api/auth/user`  
  - тесты: добавление булок и начинок в конструктор, открытие/закрытие модалок (крестик, оверлей), оформление заказа, очистка конструктора  
- **Jest unit-тесты** (`src/services/slices/__tests__/*`)  
  - `rootReducer` smoke-test  
  - `constructor` slice: add/remove/move + pending/fulfilled/rejected для `orderBurger`  
  - `ingredients` slice: pending/fulfilled/rejected для `fetchIngredients`  
  - `auth`, `feed`, `profileOrders` slices: покрытие всех стадий async-thunk + sync-actions

---

## Установка и запуск

```bash
# клонировать репозиторий
git clone https://github.com/mestr3z/stellar-burger.git
cd stellar-burger

# установить зависимости
npm install

# старт dev-сервера
npm start

```

## Тестирование

```bash
# запустить все E2E-тесты
npx cypress run

# открыть GUI
npx cypress open

# запустить unit-тесты и собрать coverage
npm run test

# запустить в режиме watch
npm run test:watch
