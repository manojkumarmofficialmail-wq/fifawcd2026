# Deploying to Hostinger (Node.js hosting + PostgreSQL)

This guide covers the common Hostinger setup: a **Node.js application** for the
Express API that also serves the built React app, plus a **PostgreSQL database**.
Two approaches are described — pick the one that matches your plan.

> Throughout, replace `yourdomain.com`, DB credentials, and the admin key with
> your real values. Never commit `.env` files.

---

## Architecture options

**Option A — Single Node app serves everything (simplest).**
Express serves the API *and* the built React files. One app, one domain.

**Option B — Split hosting.**
React build deployed as static files (e.g. on the main domain / a static host),
API on a Node subdomain like `api.yourdomain.com`. Use this if you prefer a CDN
for the frontend.

---

## 1. Create the PostgreSQL database

In **hPanel → Databases → PostgreSQL** (or "Manage Databases"):
1. Create a database, e.g. `u123_fifa_wc2026`.
2. Create a database user and password; grant it access to the database.
3. Note the **host**, **port** (usually 5432), **database name**, **user**, and
   **password**. Managed Postgres usually requires SSL.

Build your connection string:
```
postgresql://USER:PASSWORD@HOST:5432/DBNAME
```

---

## 2. Prepare the project locally

### Build the React client
```bash
cd client
# For Option A (same-origin API) leave VITE_API_BASE blank:
echo "VITE_API_BASE=" > .env
# For Option B set it to your API origin:
# echo "VITE_API_BASE=https://api.yourdomain.com" > .env
npm install
npm run build          # outputs client/dist/
```

### Zip what you need to upload
Upload the whole repo **without** `node_modules`:
```
database/   server/   client/dist/   README.md   DEPLOYMENT_HOSTINGER.md
```
(For Option A you need `client/dist`; for Option B upload `client/dist` to the
static host instead.)

---

## 3. Create the Node.js application (hPanel)

**hPanel → Advanced → Node.js** (or "Setup Node.js App"):
1. **Application root:** point to your uploaded `server/` folder.
2. **Application startup file:** `index.js`.
3. **Node version:** 18 or higher.
4. **Application URL:** your domain (Option A) or `api.yourdomain.com` (Option B).

Then add **Environment Variables** in the same panel:

| Variable       | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| `PORT`         | (use the port Hostinger assigns, or leave to its default)    |
| `NODE_ENV`     | `production`                                                 |
| `DATABASE_URL` | `postgresql://USER:PASSWORD@HOST:5432/DBNAME`                 |
| `PGSSL`        | `true` (most managed Postgres requires SSL)                  |
| `ADMIN_KEY`    | a strong secret of your choice                               |
| `CORS_ORIGIN`  | `https://yourdomain.com` (Option B), or `*` for Option A     |
| `SERVE_CLIENT` | `true` for Option A, `false` for Option B                    |

For **Option A**, make sure `client/dist` sits next to `server/` exactly as in
the repo (`server/../client/dist`), because `index.js` serves it from there.

---

## 4. Install dependencies & initialise the DB

Use the panel's **"Run NPM Install"** button, or open the SSH/terminal:
```bash
cd ~/path/to/server
npm install --omit=dev
npm run init-db        # creates tables + seed data (needs DATABASE_URL set)
```
If your plan has no shell, run the SQL via hPanel's database tool: paste the
contents of `database/schema.sql` then `database/seed.sql`.

---

## 5. Start the app

In the Node.js panel click **Restart / Start**. The startup command is:
```
node index.js
```
(Equivalent to `npm start`.) Verify:
```
https://yourdomain.com/api/health     ->  {"ok":true,"service":"wc2026-api"}
```

- **Option A:** visit `https://yourdomain.com` — the React app loads and talks to
  `/api` on the same origin.
- **Option B:** deploy `client/dist` to your static host / main domain. Ensure the
  static host has a SPA rewrite (all routes → `index.html`). The frontend calls
  the API at `VITE_API_BASE`.

---

## 6. package.json scripts (already included)

`server/package.json`:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "init-db": "node scripts/initDb.js"
}
```
`client/package.json`:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 7. Production checklist
- [ ] `ADMIN_KEY` changed from the default.
- [ ] `PGSSL=true` if the database requires SSL.
- [ ] `CORS_ORIGIN` set to the real frontend origin (avoid `*` in production for Option B).
- [ ] Real WCD logo placed at `client/public/wcd-logo.svg` **before** `npm run build`.
- [ ] Prediction window set in the Admin console after first deploy.
- [ ] `https://yourdomain.com/api/health` returns ok.
- [ ] PDF downloads from `/api/pdf/daily-report`.

---

## Troubleshooting
- **DB connection errors / SSL:** set `PGSSL=true`. The pool already passes
  `{ rejectUnauthorized: false }` when SSL is on, which suits most managed hosts.
- **Frontend loads but API 404s (Option A):** confirm `SERVE_CLIENT=true` and that
  `client/dist` is located at `server/../client/dist`.
- **CORS blocked (Option B):** set `CORS_ORIGIN` to your exact frontend origin,
  including `https://`.
- **App won't start:** check the Node version is 18+ and that `npm install` ran in
  the `server/` folder (the one containing `index.js`).
