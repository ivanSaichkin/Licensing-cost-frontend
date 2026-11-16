# Licensing-cost — фронтенд расчёта стоимости лицензирования

SPA для работы с моделями лицензирования ПО: лента, плитка с фильтром,
добавление и публикация услуг, авторизация. Данные домена приходят из
Go-веб-сервиса `../Licensing-cost-backend`.

**Стек:** React 19, TypeScript, Vite, React Router, React Bootstrap,
Redux Toolkit + `react-redux`, Axios, `swagger-typescript-api`,
Feature-Sliced Design (FSD).

## Быстрый старт

Требуется Node.js `^20.19` или `>=22.12` (проверено на Node 24).

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).
Vite проксирует:

- `/api` → `http://localhost:8080` (Go-бэкенд);
- `/s3` → `http://localhost:9000` (MinIO с изображениями и видео).

Поэтому CORS не мешает, а ссылки MinIO из ответов бэкенда автоматически
переписываются в `/s3/...` в `src/shared/lib/media.ts`.

Перед запуском бэкенд и MinIO должны быть подняты (см. README бэкенда).
Если бэкенд недоступен, **гость** увидит mock-коллекцию и предупреждение,
авторизованному пользователю будет показана ошибка.

### Кодогенерация API

Клиент API генерируется из Swagger-контракта Go-сервиса:

```bash
npm run generate-api
```

Скрипт `scripts/generate-api.mjs` читает
`../Licensing-cost-backend/docs/swagger.json` и создаёт
`src/shared/api/generated/Api.ts` (axios-клиент, типы запросов и ответов).
Сгенерированный клиент закоммичен, поэтому для запуска приложения
кодогенерация не обязательна.

### Команды

```bash
npm run dev          # dev-сервер
npm run build        # проверка типов + production-сборка
npm run preview      # предпросмотр production-сборки
npm run lint         # oxlint
npm run generate-api # перегенерировать axios-клиент из Swagger
```

## Страницы

### Лента — `/` и `/licensing/:id`

Полноэкранная карточка с видео, описанием и параметрами расчёта.

- данные — `GET /api/licensing/feed`; для конкретной модели передаётся `id`, для следующей — `id` + `next=true`;
- feed-ответ содержит `is_liked`, поэтому состояние лайка не теряется после перезагрузки;
- кнопка лайка вызывает `POST /api/licensings/:id/like`;
- гость при нажатии на лайк переходит на страницу входа;
- при ошибке видео показывается обложка, при пустых медиа — файлы из
  `public/media/`.

### Плитка — `/grid`

Две колонки карточек с фильтром по максимальной комиссии.

- значение слайдера и применённый фильтр хранятся в Redux (`filter`);
- **«Найти»** применяет фильтр и запрашивает
  `GET /api/licensings?max_commission=N`;
- у моделей, созданных текущим пользователем (`is_creator = 1`), есть кнопка
  **«Удалить»** (`DELETE /api/licensings/:id`);
- удаление и лайки блокируются, пока идёт запрос.

### Добавление — `/add`

Доступна только авторизованному пользователю; гостя перенаправляет на
`/login`.

- при открытии загружается существующий черновик (`GET /licensings/draft`);
- новый черновик создаётся через `POST /api/licensings` (multipart:
  `title`, `description`, `image`, `video`);
- после создания медиа и название фиксируются, остаются описание, комиссия и
  минимум для расчёта;
- **«Опубликовать»** вызывает `PUT /api/licensings/:id/publish` и открывает
  ленту опубликованной модели;
- загрузка файлов, создание черновика и публикация идут через
  `createAsyncThunk` и сгенерированный axios-клиент.

### Вход — `/login`

- поля «Логин» и «Пароль»; регистрации в интерфейсе нет;
- `POST /api/users/login` выполняется **обычным axios**, без кодогенерации и
  без thunk; после ответа состояние вручную кладётся в Redux;
- JWT сохраняется в `localStorage` (`licensing-auth`) и остаётся там после F5;
- Redux-сессия после F5 сбрасывается в гостя: initialState всегда guest, поэтому
  интерфейс снова показывает «Вход»; токен при этом не удаляется и используется
  axios-клиентом для API-запросов;
- после входа меню показывает **«Выход»**, после выхода — **«Вход»**.

## Гость и авторизованный пользователь

| Пункт меню | Гость | Пользователь |
| --- | --- | --- |
| Лента | ссылка | ссылка |
| Добавление | заблокирован | ссылка |
| Плитка | ссылка | ссылка |
| Вход / Выход | ссылка «Вход» | кнопка «Выход» |

Выход также выполняется обычным axios-запросом `POST /api/users/logout`.
После выхода очищаются токен, Redux-состояние и фильтр; приложение
перезагружается в гостевом режиме. При недоступном бэкенде выход всё равно
очищает локальную сессию.

## Архитектура FSD

| Слой | Где | Ответственность |
| --- | --- | --- |
| `app` | `src/app` | точка входа, `Provider`, store, роутер, guard авторизации |
| `pages` | `src/pages` | `feed`, `grid`, `add`, `login` |
| `widgets` | `src/widgets/app-layout` | мобильная оболочка и нижняя навигация |
| `features` | `src/features/licensing-filter` | Redux-слайс и UI фильтра плитки |
| `entities` | `src/entities/licensing`, `src/entities/session` | домен моделей и сессия пользователя |
| `shared` | `src/shared` | API-клиент, axios-инстанс, UI-примитивы, утилиты |

Состояние Redux:

- `session` — токен, логин, флаг авторизации, загрузка и ошибка входа;
- `licensing` — список моделей, черновик, загрузка, ошибка, флаг mock-fallback;
- `filter` — значение слайдера и применённый фильтр;
- `requests` — счётчик активных запросов для блокирующего оверлея.

Запросы домена живут в `createAsyncThunk` (`src/entities/licensing/model/licensingThunks.ts`).
Авторизация и деавторизация — только `axios` в `src/entities/session/api/authApi.ts`
и ручной dispatch в компонентах.

## API и кодогенерация

- лента: `GET /api/licensing/feed?id=N` и `GET /api/licensing/feed?id=N&next=true`;
- список для плитки: `GET /api/licensings?max_commission=N`;
- черновик: `GET /api/licensings/draft`;
- создание: `POST /api/licensings` (multipart);
- публикация: `PUT /api/licensings/:id/publish`;
- лайк: `POST /api/licensings/:id/like` (JSON `{"like":0|1}`);
- удаление: `DELETE /api/licensings/:id`;
- вход/выход: `POST /api/users/login`, `POST /api/users/logout`.

Сгенерированный клиент лежит в `src/shared/api/generated/Api.ts`. В
`src/shared/api/index.ts` создаётся инстанс с `baseURL: '/api'`, а
axios-интерсептор добавляет Bearer-токен ко всем запросам, включая публичный
список (иначе бэкенд не вернёт `is_creator`).

## Дизайн

Дизайн сохранён из лабораторных 1–5:

- мобильная колонка **390 × 844 px**, центрированная на странице;
- шрифт **Inter** через `@fontsource/inter`;
- нижняя таб-панель высотой 52 px;
- палитра: `#0072c6` — акцент, `#242424` — текст, `#5C5C5C` — вторичный,
  `#E0E4E9` — границы;
- лента: полноэкранное видео и нижний градиент;
- плитка: карточки с изображением 90 px, скруглением 12 px;
- добавление: медиа-блоки, поля с рамкой и синяя кнопка действия;
- при любом запросе поверх интерфейса показывается блокирующий оверлей со
  спиннером, кнопки на время запроса disabled.

## Дефолтные медиа

- изображение: `public/media/default_image.png`;
- видео: `public/media/default_video.mp4`;
- fallback-утилиты: `resolveImageUrl`, `resolveVideoUrl` в
  `src/shared/lib/media.ts`; они же переводят ссылки
  `http://localhost:9000/...` в `/s3/...`;
- в карточке плитки при ошибке загрузки изображения подставляется дефолтная
  картинка;
- в ленте при ошибке видео показывается обложка;
- у модели `Trial` пустые `image_url` и `video_url`, поэтому видны оба
  fallback-сценария.

## Основные хуки

| Хук | Где | Зачем |
| --- | --- | --- |
| `useAppSelector` | страницы, навигация | типизированный доступ к Redux |
| `useAppDispatch` | страницы, навигация | dispatch thunk-ов и действий |
| `useState` | `AddPage`, `LoginPage`, `LicensingSlide` | локальные поля, файлы, ошибки, раскрытие описания |
| `useEffect` | страницы | загрузка списка, черновика, реакция на смену фильтра |
| `useMemo` | `AddPage`, `GridPage` | object URL медиа, раскладка по колонкам |
| `useParams` | `FeedPage` | `id` модели из `/licensing/:id` |
| `useNavigate` | страницы | переходы между моделями и после входа/публикации |

## Полезные ссылки

- [Методические указания по лабораторной 7](https://github.com/iu5git/Web/tree/main/tutorials/lab7);
- [Redux Toolkit](https://redux-toolkit.js.org), [React Redux](https://react-redux.js.org);
- [Axios](https://axios-http.com), [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api);
- [React](https://react.dev), [React Router](https://reactrouter.com),
  [Vite](https://vite.dev), [Feature-Sliced Design](https://feature-sliced.design).
