# Portfolio

Personal portfolio for **Danish Khan** — CS student at DePaul University.

## Structure

```
Portfolio/
├── frontend/
│   ├── src/         # React + Vite app
│   ├── public/
│   └── legacy/      # Original static HTML/CSS/JS site
├── backend/         # Node + Express API starter
└── README.md
```

The original static site is preserved under `frontend/legacy/`. The
React rewrite lives in `frontend/src/`.

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

Sections (single-page, smooth scroll from the top-left nav):

- **About** — short bio
- **Projects** — project cards
- **Stack** — tools / languages

## Backend (Node + Express)

```bash
cd backend
cp .env.example .env
npm install
npm run dev      # http://localhost:3001
```

Endpoints:

- `GET  /api/health` — health check
- `POST /api/contact` — accepts `{ name, email, message }`

## Contact

[dkhans2001@gmail.com](mailto:dkhans2001@gmail.com)
