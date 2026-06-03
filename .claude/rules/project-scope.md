# Project Scope

## Overview
A multi-user personal finance tracker. Each user has fully isolated data. Authentication via Better Auth (email + password).

## Core Entities

### Financial Accounts (`FinancialAccount`)
- Create/edit/delete accounts (e.g. bank, cash, credit card)
- Each account has a name, type, and current balance
- Transactions are always linked to a financial account
- Named `FinancialAccount` in Prisma to avoid collision with Better Auth's `Account` model

### Transactions
- Log income or expense
- Fields: amount, type (income/expense), category, account, date, optional notes
- Categories are user-created (not predefined), each has a name and color

### P2P Transfers
- A user can send money to another registered user by email
- Sender specifies amount, category, account, and recipient email at creation
- Receiver's transaction is created automatically with `status: PENDING`; no balances change until acceptance
- **Accept** — receiver picks an account and category; both transactions move to `COMPLETE` and balances update on both sides
- **Cancel** — sender can cancel a `PENDING` outgoing transfer; both records move to `CANCELLED`, no balance change
- **Reject** — receiver can decline a `PENDING` incoming transfer; both records move to `REJECTED`, no balance change
- Accepted (COMPLETE) P2P transactions cannot be edited or deleted
- P2P transactions are linked by a shared `transferId` on both records
- Sender's record has a `to` field (recipient email); receiver's record has a `from` field (sender email)
- `TransactionStatus` enum: `PENDING`, `COMPLETE`, `CANCELLED`, `REJECTED`

### Budgets
- Set a monthly spending limit per category
- Track how much has been spent against the limit
- Scoped to the current month

### Goals
- Savings goals with a name, target amount, and optional deadline
- User manually tracks contributions toward a goal

### Categories
- Fully user-created (no predefined defaults)
- Shared across transactions and budgets

## Dashboard
- **Spending overview** — chart (Recharts) showing spending by category this month vs last month
- **Budget progress bars** — visual progress toward each active budget limit
- **Recent transactions** — last 10 transactions across all accounts
- **Account balances** — summary card per account

## MVP Definition
All four entities ship in v1 — Accounts, Transactions, Budgets, Goals. No phased rollout.

## Out of Scope (for now)
- Recurring/scheduled transactions
- Bank/API integrations (manual entry only)
- Currency conversion
- Shared budgets between users
- Mobile app
