# ThorTheHost — Development Phases

Status of the phased build plan. Each phase is developed, verified, and
confirmed before moving to the next.

| Phase | Scope                                                                 | Status        |
|-------|------------------------------------------------------------------------|--------------|
| 1     | Project scaffolding, FastAPI + React config, Postgres/Alembic wiring, landing page, health endpoint | ✅ Complete |
| 2     | Authentication: DB models, JWT, register/login/logout, email verification | ⏳ Next |
| 3     | Dashboard: sidebar, profile, forwarding email settings, statistics     | Not started |
| 4     | Alias engine: random generator, uniqueness checks, 500-alias limit, CRUD, search, pagination | Not started |
| 5     | Email infrastructure prep: mail queue, SMTP abstraction, worker, logging (no real SMTP yet) | Not started |
| 6     | Real SMTP: Postfix, MX/SPF/DKIM/DMARC, catch-all domain, live forwarding | Not started |
| 7     | Reply-from-alias, bounce handling, spam filtering, admin panel, analytics, audit logs | Not started |

See the root `README.md` for setup instructions for the phases completed
so far.
