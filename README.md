# Restaurant Orders

A small restaurant backend (Express + TypeScript) with a simple React frontend, built for learning.

- **Backend** (`src/`): REST API for a menu and a kitchen order queue, using in-memory storage.
- **Frontend** (`client/`): React (Vite) UI that talks to the API.

> Data lives in memory only. Restarting the backend resets the menu and orders.

## Quick start

Requirements: Node.js >= 22.12.

```bash
npm install                # backend dependencies
npm run client:install     # frontend dependencies
npm run dev:all            # starts API and frontend together
```

Then open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev:all` | API (port 3000) + React app (port 5173) together |
| `npm run dev` | Backend only, with auto-reload |
| `npm start` | Backend only, no reload |
| `npm run client` | Frontend only |
| `npm test` | Backend tests (vitest) |

### Environment

Create `.env` in the project root:

```
API_TOKEN=kitchen-secret-123
```

`/orders` routes require the header `Authorization: Bearer <API_TOKEN>`.

## What the app does

- **Menu**: create, list, edit and delete dishes (name + price).
- **Orders**: place an order for a menu item (size small/medium/large) and list orders. The kitchen accepts at most 8 unserved orders at once; beyond that the API returns `409 ORDER_REJECTED`.
- **Reservations**: placeholder. The API returns `501 NOT_IMPLEMENTED`, and the UI shows that message.
- **Health**: `GET /health` returns `{ "status": "ok" }`; the UI shows it as a badge.

## API reference

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | no | Health check |
| GET | `/menu` | no | List menu items |
| GET | `/menu/:id` | no | Get one item |
| POST | `/menu` | no | Create `{ name, price }` |
| PATCH | `/menu/:id` | no | Update `name` and/or `price` |
| DELETE | `/menu/:id` | no | Delete (204) |
| GET | `/orders` | yes | List orders |
| POST | `/orders` | yes | Create `{ menuItemId, size? }` |
| GET/POST | `/reservations` | no | Not implemented (501) |

Errors have the shape `{ "error": { "message": "...", "code": "..." } }`, e.g. `VALIDATION_ERROR`, `MENU_ITEM_NOT_FOUND`, `UNAUTHORIZED`, `ROUTE_NOT_FOUND`.

## Backend structure

```
src/
  main.ts          entry point (npm start)
  server.ts        starts the HTTP server on port 3000
  app.ts           builds the Express app and mounts routes
  auth.ts          requireAuth middleware (Bearer token from .env)
  db.ts            generic InMemoryDb<T> used for menu items
  order-queue.ts   OrderQueue class (add, serve, list, revenue, summary)
  models/          MenuItem type
  routes/          health, menu, orders, reservations routers
  lib/             error helpers and validation utils
```

## Frontend structure

```
client/
  vite.config.js           dev server + proxy to the backend
  index.html               page with <div id="root">
  src/
    main.jsx               mounts <App /> into #root
    App.jsx                header, tab navigation, picks the active page
    api.js                 fetch wrapper for every endpoint
    components/
      HealthBadge.jsx      shows API status
      MenuPage.jsx         menu CRUD
      OrdersPage.jsx       token input, place order, orders table
      ReservationsPage.jsx shows the "not implemented" response
```

## How React works in this project

### 1. Entry point and components

`index.html` contains an empty `<div id="root">`. [`main.jsx`](client/src/main.jsx) tells React to render `<App />` inside it. After that, React owns the contents of that div.

The UI is a tree of **components**: plain functions that return JSX (HTML-like syntax).

```
App
├── HealthBadge
└── (active tab)
    ├── MenuPage
    ├── OrdersPage
    └── ReservationsPage
```

### 2. State with `useState`

Data that changes over time is kept in **state**. When state is updated, React re-renders the component and updates the DOM to match. For example, in [`App.jsx`](client/src/App.jsx):

```jsx
const [activeTab, setActiveTab] = useState('menu');
```

Clicking a tab calls `setActiveTab(...)`; React re-renders `App` and shows a different page. Because each page component is unmounted when you switch away, its state is discarded and it reloads its data when shown again. Forms use the same idea: each input's `value` comes from state and `onChange` updates it (a "controlled input"). `MenuPage` keeps `items`, `form`, `editingId`, `loading` and `error` in state.

### 3. Side effects with `useEffect`

Fetching data is a side effect, so it goes in `useEffect`. `HealthBadge`, for example, calls `/health` once when it first appears:

```jsx
useEffect(() => {
  api.getHealth().then(...).catch(...);
}, []); // empty array: run once on mount
```

`MenuPage` loads the menu the same way, and `OrdersPage` loads the menu for its dish dropdown. `HealthBadge` also uses a `cancelled` flag in the cleanup function so it doesn't set state after it has been removed.

### 4. Talking to the API

All HTTP calls are in [`api.js`](client/src/api.js). Components call `api.getMenu()`, `api.createOrder(token, ...)`, etc. and update state with the result. On a failed response the wrapper throws an `Error` with the backend's message, which components show in an error box.

A typical flow (adding a menu item):

1. User types in the form, so state updates on each keystroke.
2. Submit calls `api.createMenuItem(...)` (`POST /menu`).
3. On success, the new item is appended to `items` state, so the table re-renders.
4. On failure, the message is stored in `error` state and displayed.

The UI updates from the server's response; it never edits the DOM directly.

### 5. Lists and conditional rendering

Tables are built with `items.map(...)`, where each row has a `key` so React can track it. Conditions such as `loading ? ... : ...`, `{error && <p>...}` and inline edit mode (`editingId === item.id`) decide what is shown.

### 6. Vite and the dev proxy

[Vite](https://vite.dev) serves the React app on port 5173 and compiles JSX on the fly with hot reload. The browser would normally block calls from port 5173 to the API on port 3000 (CORS), so [`vite.config.js`](client/vite.config.js) proxies `/health`, `/menu`, `/orders` and `/reservations` to `http://localhost:3000`. The frontend just calls relative URLs like `fetch('/menu')`, and no backend CORS setup is needed.

This proxy only exists in the dev server. For production, you would run `npm --prefix client run build` and serve `client/dist` behind the same host as the API (or add CORS).

### 7. The token

The Orders page stores the kitchen token in `localStorage` and sends it as `Authorization: Bearer <token>`. This is for learning only; real apps should use proper login flows.

## Learning ideas

- Add a "mark as served" button (the `OrderQueue.serve` method exists but has no route yet).
- Split `MenuPage` into smaller components (`MenuForm`, `MenuRow`).
- Replace the tab state with React Router.
- Move shared state (menu items) into a context or a data-fetching library.
