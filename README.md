# Personal Finance Tracker

A full-stack personal finance app for tracking accounts, transactions, budgets, and savings goals — with P2P transfers between users.

**Live demo:** https://my-personal-finance-ten.vercel.app  
**Code:** https://github.com/maziarja/my-personal-finance

---

## Features

- **Financial Accounts** — create and manage checking, savings, credit card, and cash accounts with live balances
- **Transactions** — log income and expenses; filter and sort by account, category, type, and date range
- **P2P Transfers** — send money to another registered user by email; receiver can accept, reject, or the sender can cancel
- **Budgets** — set monthly spending limits per category with visual progress tracking
- **Goals** — savings goals with a target amount, optional deadline, and manual contribution tracking
- **Categories** — fully user-created categories with custom names and colors, shared across transactions and budgets
- **Dashboard** — spending overview chart (this month vs last month), budget progress bars, recent transactions, and account balances at a glance
- **Auth** — email + password sign-up and sign-in; fully isolated data per user

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + Shadcn/ui |
| Database | Neon Postgres via Prisma ORM |
| Auth | Better Auth |
| Server mutations | Server Actions |
| Client state | Zustand |
| Data fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database

### 1. Clone and install

```bash
git clone https://github.com/maziarja/my-personal-finance.git
cd my-personal-finance
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `BETTER_AUTH_SECRET` | Random secret used to sign auth tokens (generate with `openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |

### 3. Push the database schema

```bash
npx prisma migrate dev
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.
