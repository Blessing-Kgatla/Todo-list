# Todo App

A local-first to-do application built with Next.js and SQLite. No accounts, no deployment — download it, run it with Node, and it serves a single user on the machine it runs on.

Full documentation lives in [`documentation/`](./documentation):
- [Third-Party Code](./documentation/third-party-code.md)
- [Database Design](./documentation/database-design.md)
- [Running It](./documentation/running-it.md)
- [AI Transcript](./documentation/AI-Transcript.pdf)

## Quick Start

**Requirements:** Node.js v24.13.1 (run `node -v` to confirm yours matches, or use a version manager like `nvm` to switch).

From a clean clone, with nothing else to hand:

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
echo 'DATABASE_URL="file:./dev.db"' > .env

# 3. Generate the Prisma client and create the SQLite database
npx prisma generate
npx prisma migrate dev

# 4. Run the app
npm run dev
```

Then open **http://localhost:3000** — it redirects to `/dashboard/tasks`.

## Running Tests

```bash
npm test
```

Tests use a mocked Prisma client and never touch `dev.db`, so they're safe to run at any time without affecting your local data.

## Features

- Create, edit, and archive tasks (archived tasks are never deleted — they remain viewable)
- Each task has a Title, Description, Due Date, and Topic
- Fixed statuses: Todo, In Progress, Completed
- Overdue tasks are visually flagged (computed from the due date, not stored as a status)
- Sort and filter tasks by topic, status, and due date; free-text search
- Analysis dashboard with stats and charts
- Theme switcher (Settings section), persisted in the database
- All data persists in a local SQLite database across restarts


Assisted-by: Claude-Web[Claude Sonnet 5]