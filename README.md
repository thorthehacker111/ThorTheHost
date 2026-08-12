# ThorTheHost ⚡

Privacy-first email alias forwarding, built like a real product.

Generate throwaway aliases like `forest_tiger4821@thorthehost.in`, hand them
out instead of your real address, and let ThorTheHost forward the mail to
one verified inbox you control.

This repository is being built in phases (see `PHASES.md` for the plan).
**This README covers Phase 1**: project scaffolding, configuration, the
landing page, and the health check endpoint. There is no authentication,
alias generation, or mail forwarding yet — that comes in later phases.

---

## Tech stack

| Layer      | Technology                                                        |
|------------|--------------------------------------------------------------------|
| Backend    | Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, PostgreSQL, Redis  |
| Auth       | JWT, Argon2 (Phase 2)                                              |
| Frontend   | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, React Query    |
| Database   | PostgreSQL (no SQLite, ever)                                       |

Everything below runs **natively on Windows 11** — no Docker.

---

## 1. Install prerequisites (Windows 11)

You said none of these are installed yet, so here's the full path.

### 1.1 Python 3.11+

1. Download the installer from <https://www.python.org/downloads/windows/>
   (pick the latest 3.11.x or 3.12.x "Windows installer (64-bit)").
2. Run it. **Check "Add python.exe to PATH"** on the first screen — this is
   the step people usually miss.
3. Click "Install Now".
4. Verify in a **new** PowerShell window:
   ```powershell
   python --version
   pip --version
   ```

### 1.2 Node.js (LTS)

1. Download the **LTS** installer from <https://nodejs.org/>.
2. Run it, accepting the defaults (this also installs `npm`).
3. Verify in a new PowerShell window:
   ```powershell
   node --version
   npm --version
   ```

### 1.3 PostgreSQL

1. Download the installer from
   <https://www.postgresql.org/download/windows/> (EnterpriseDB installer).
2. Run it. When prompted:
   - Set a password for the `postgres` superuser — **remember it**.
   - Keep the default port `5432`.
   - You can skip installing Stack Builder at the end.
3. The installer adds a "SQL Shell (psql)" app to your Start Menu — use
   that to run the setup below.

### 1.4 Redis

Redis doesn't officially support Windows, so use one of these:

- **Recommended:** [Memurai](https://www.memurai.com/get-memurai) — a
  Redis-compatible server built for Windows, free "Developer Edition".
  Install it and it runs as a Windows service on `localhost:6379`.
- **Alternative:** enable WSL2 and run real Redis inside it
  (`sudo apt install redis-server`).

Verify whichever you choose is listening on port 6379 before starting the
backend.

---

## 2. Create the database

Open **SQL Shell (psql)** from the Start Menu (press Enter to accept the
default host/port/username, then enter the `postgres` password you set
during install), then run:

```sql
CREATE DATABASE thorthehost_db;
CREATE USER thorthehost_user WITH ENCRYPTED PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE thorthehost_db TO thorthehost_user;
\c thorthehost_db
GRANT ALL ON SCHEMA public TO thorthehost_user;
```

Use a real password instead of `changeme`, and put the same value in your
`.env` file in the next step.

---

## 3. Backend setup

```powershell
cd backend

# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your local environment file
copy .env.example .env
```

Open `backend\.env` and set `DATABASE_URL` to match the database you just
created, e.g.:

```
DATABASE_URL=postgresql+psycopg://thorthehost_user:changeme@localhost:5432/thorthehost_db
```

Run the app:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Check it worked:

- API docs: <http://127.0.0.1:8000/api/docs>
- Health check: <http://127.0.0.1:8000/api/v1/health> — should report
  `"status": "ok"` with both `postgresql` and `redis` as `"ok"` once both
  services are running.

Run the backend tests:

```powershell
pytest
```

---

## 4. Frontend setup

Open a **second** PowerShell window (leave the backend running in the
first one):

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173> — you should see the ThorTheHost landing
page. The dev server proxies `/api/*` requests to the backend on port
8000 automatically (see `vite.config.ts`), so the browser only ever talks
to `localhost:5173`.

Other useful commands:

```powershell
npm run build      # production build -> frontend/dist
npm run test       # run the Vitest suite
npm run lint       # lint the codebase
```

---

## Project structure

```
ThorTheHost/
├── backend/
│   ├── app/
│   │   ├── api/            # FastAPI routers (thin — no business logic)
│   │   ├── core/           # config, logging
│   │   ├── database/       # SQLAlchemy engine/session/Base
│   │   ├── models/         # ORM models (Phase 2+)
│   │   ├── schemas/        # Pydantic request/response models (Phase 2+)
│   │   ├── services/       # business logic (Phase 2+)
│   │   ├── repositories/   # data access, no SQL in routes (Phase 2+)
│   │   ├── middleware/     # cross-cutting HTTP concerns (Phase 2+)
│   │   └── utils/
│   ├── alembic/            # DB migrations
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/     # landing/, layout/, ui/ (shadcn primitives)
│   │   ├── pages/
│   │   ├── layouts/         # Phase 3
│   │   ├── hooks/           # Phase 2+
│   │   ├── services/        # Phase 2+ (API clients)
│   │   ├── contexts/        # Phase 2+ (auth context)
│   │   └── types/
│   └── public/
└── README.md
```

**Layered architecture, enforced by convention:**

```
API layer (routers)  →  Service layer (business rules)  →  Repository layer (SQL)  →  Database
```

Routers never contain SQL or business rules — starting Phase 2, that logic
moves into `services/` and `repositories/` so it stays testable and
reusable outside of any single HTTP endpoint.

---

## What's in Phase 1

- ✅ Full project structure (backend + frontend), matching the layered
  architecture above.
- ✅ FastAPI app factory with CORS, security headers, structured logging,
  and a global exception handler.
- ✅ SQLAlchemy engine/session wiring and Alembic configured against it
  (no models yet — that's Phase 2).
- ✅ `GET /api/v1/health` — checks the API, PostgreSQL, and Redis and
  reports each independently.
- ✅ React + TypeScript + Vite + Tailwind + shadcn/ui toolchain, fully
  configured and building cleanly.
- ✅ The full Norse-themed landing page: hero (with a live alias-forge
  preview), features, pricing (placeholder), FAQ, footer.
- ✅ Backend tests (pytest) and frontend tests (Vitest) passing.

## What's intentionally NOT in Phase 1

- No authentication, no database tables, no real alias generation, no
  mail forwarding. Those arrive in Phases 2–7 (see `PHASES.md`).
- The alias examples on the landing page are a client-side visual preview
  only — no backend call is made yet.

---

## Design notes

The UI follows a "forged in lightning" visual language: a near-black
background (`void`), slate/steel surfaces, and a single electric-gold
accent (`lightning`) reserved for primary actions and the alias-forge
panel, with a cooler ice-blue (`bifrost`) used sparingly for secondary
information. Headings use Cinzel (a carved, inscriptional serif) and body
text uses Inter for readability. All tokens live in
`frontend/tailwind.config.ts`.
