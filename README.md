# FIFA World Cup 2026 — Prediction Contest App

**Women and Child Welfare Committee · Directorate of Women and Child Development Department**

A mobile-first, live "knockout" prediction contest for department staff. Each
person predicts the World Cup winner. As the admin marks real teams eliminated,
everyone who picked those teams is knocked out. The last predictors standing —
those who picked the eventual champion — win. A live tracker shows standings, and
a printable daily PDF is generated for the notice board.

---

## Tech stack

| Layer     | Technology                                   |
| --------- | -------------------------------------------- |
| Frontend  | React 18 + Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js + Express                            |
| Database  | PostgreSQL                                   |
| PDF       | PDFKit (pure Node — no headless browser)     |

The music toggle uses the Web Audio API to synthesise a royalty-free stadium
groove, so there are no audio files or licensing concerns.

---

## Project structure

```
fifa-wc2026/
├── README.md                     # This file
├── DEPLOYMENT_HOSTINGER.md       # Step-by-step Hostinger guide
├── database/
│   ├── schema.sql                # Tables: users, teams, admin_settings
│   └── seed.sql                  # Teams + sample participants
├── server/                       # Node + Express API
│   ├── index.js                  # App entry / route mounting
│   ├── db.js                     # PostgreSQL pool
│   ├── package.json
│   ├── .env.example
│   ├── middleware/
│   │   └── auth.js               # Admin shared-key guard
│   ├── routes/
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── teams.js
│   │   ├── admin.js
│   │   └── pdf.js
│   ├── controllers/
│   │   ├── registerController.js
│   │   ├── dashboardController.js
│   │   ├── teamsController.js
│   │   ├── adminController.js
│   │   └── pdfController.js
│   └── scripts/
│       └── initDb.js             # Runs schema + seed from Node
└── client/                       # React (Vite) frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── public/
    │   ├── ball.svg
    │   └── wcd-logo.svg          # WCD logo placeholder — replace with the real one
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api.js
        ├── components/
        │   ├── Header.jsx
        │   ├── CountdownTimer.jsx
        │   ├── MusicToggle.jsx
        │   ├── StatTile.jsx
        │   └── TeamRow.jsx
        └── pages/
            ├── Register.jsx
            ├── Dashboard.jsx
            └── Admin.jsx
```

---

## API endpoints

| Method | Path                       | Auth   | Purpose                                  |
| ------ | -------------------------- | ------ | ---------------------------------------- |
| POST   | `/api/register`            | —      | Submit a prediction                      |
| GET    | `/api/dashboard`           | —      | Live stats, breakdown, window, champion  |
| GET    | `/api/teams`               | —      | All teams + prediction counts            |
| POST   | `/api/admin/login`         | key    | Verify admin key                         |
| GET    | `/api/admin/settings`      | key    | Read current prediction window           |
| POST   | `/api/admin/set-time`      | key    | Set start/end of prediction window       |
| POST   | `/api/admin/eliminate-team`| key    | Eliminate / restore a team               |
| GET    | `/api/admin/users`         | key    | List participants (filter/search)        |
| GET    | `/api/pdf/daily-report`    | —      | Download the daily PDF report            |

Admin auth: send the shared key in the **`x-admin-key`** header. The default key
is `wcd-admin-2026` — **change `ADMIN_KEY` before going live.**

---

## Run locally

### 0. Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+ running locally

### 1. Create the database
```bash
createdb fifa_wc2026          # or use pgAdmin / psql to CREATE DATABASE
```

### 2. Backend
```bash
cd server
cp .env.example .env          # then edit DATABASE_URL / ADMIN_KEY
npm install

# Initialise schema + seed (either option works):
npm run init-db               # runs database/schema.sql then seed.sql
#   --- or with psql ---
# psql -d fifa_wc2026 -f ../database/schema.sql
# psql -d fifa_wc2026 -f ../database/seed.sql

npm run dev                   # API on http://localhost:4000
```

### 3. Frontend
```bash
cd client
cp .env.example .env          # leave VITE_API_BASE blank for local dev
npm install
npm run dev                   # app on http://localhost:5173
```

Vite proxies `/api` to `http://localhost:4000`, so no CORS setup is needed in dev.

### 4. Use it
- **Predict** (`/`): staff submit predictions while the window is open.
- **Live** (`/live`): public tracker, refreshes every 15s, PDF download.
- **Admin** (`/admin`): sign in with the admin key, set the window, run
  eliminations, and browse participants.

---

## How the contest logic works

1. Admin sets the **prediction window**. Registrations outside it are rejected
   (with a live countdown shown to staff).
2. Each WhatsApp number can register **once** (enforced in the DB and API).
3. As the real tournament plays out, admin **eliminates** teams. Every user who
   picked an eliminated team is set to `eliminated` in one transaction.
4. The live tracker shows totals, remaining players, team-wise counts, today's
   eliminations, and animated transitions.
5. When only one **picked** team remains active, a **champion** banner lists the
   winning predictors. Restore is available if a team was eliminated by mistake.

---

## Customising
- Replace `client/public/wcd-logo.svg` with the official WCD logo (same filename,
  or update `Header.jsx` and `pdfController.js`).
- Edit the team list in `database/seed.sql`.
- Brand colours live in `client/tailwind.config.js` (`ink`, `gold`, `hot`, `grass`).

See **DEPLOYMENT_HOSTINGER.md** for production hosting.
