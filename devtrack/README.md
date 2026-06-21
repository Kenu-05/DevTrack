# DevTrack — Team Task & Deployment Tracker

A full-stack team task management app built to demonstrate production-grade engineering practices: authentication, real-time updates, automated testing, and CI/CD.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (access + refresh tokens) |
| Real-time | Socket.io |
| Testing | Jest (backend), Vitest (frontend) |
| CI/CD | GitHub Actions |
| Deployment | Render/Railway (backend), Vercel (frontend), Neon/Supabase (DB) |

## Project Structure

```
devtrack/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # DB models: User, Team, Project, Task
│   ├── src/
│   │   ├── routes/             # auth, tasks, projects, teams
│   │   ├── middleware/         # auth check, role check, error handler
│   │   ├── sockets/            # socket.io event handlers
│   │   ├── lib/                # prisma client, jwt helpers
│   │   └── index.ts            # app entrypoint
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/                # api client, socket client
│   │   └── App.tsx
│   └── package.json
├── .github/workflows/
│   └── ci.yml                  # lint + test + build + deploy
├── LEARNINGS.md                # your documentation-reading notes go here
└── README.md
```

## Getting Started

### 1. Backend setup
```bash
cd backend
npm install
cp .env.example .env       # fill in DATABASE_URL, JWT secrets
npx prisma migrate dev --name init
npm run dev
```

### 2. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Database
Use a free Postgres instance from [Neon](https://neon.tech) or [Supabase](https://supabase.com) for local + deployed use — no need to install Postgres locally.

## Week-by-Week Build Plan

**Week 1 — Core**
- Auth (signup/login, JWT, roles: admin/member)
- CRUD: Teams, Projects, Tasks
- Task assignment to team members

**Week 2 — Advanced**
- Real-time task updates via Socket.io
- Kanban-style board (drag-and-drop status)
- Tests for auth + task permission logic

**Week 3 — DevOps**
- Dockerize backend
- GitHub Actions: lint → test → build → deploy
- Write LEARNINGS.md, record demo, polish README

## Why this project

Most student projects stop at CRUD. This one is structured so the *DevOps layer* (CI/CD, Docker, automated tests) is a core deliverable, not an afterthought — this is exactly what separates a junior portfolio project from an associate-level one in interviews.
