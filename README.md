# Expensify

# Expensify - Smart Expense Management

A modern, type-safe expense management system built with the T3 Stack.

## Features

- 🔒 Enterprise-grade authentication with WorkOS
- 📊 Advanced policy management with rolling windows and group-based rules
- 💼 Multi-organization support
- ✨ Modern React UI with server components
- 🔍 Type-safe from database to UI

## Tech Stack

- [Next.js](https://nextjs.org) - React framework with App Router
- [Prisma](https://prisma.io) - Type-safe database ORM
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [TypeScript](https://typescriptlang.org) - Type safety
- [PostgreSQL](https://postgresql.org) - Database

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expensify.git
   cd expensify
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database and WorkOS credentials

4. Start the database:
   ```bash
   docker compose up -d
   ```

5. Initialize the database:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

The app will be running at http://localhost:3000
