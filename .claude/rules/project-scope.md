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
