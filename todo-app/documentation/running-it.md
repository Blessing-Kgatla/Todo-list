# Running It

**Requirements:** Node.js v24.13.1 (developed and tested on this version — run node -v to confirm yours matches, or use a version manager like nvm to switch).

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

## Running tests

```bash
npm test
```

Tests use a mocked Prisma client (see `lib/__mocks__/prisma.ts`) and never touch `dev.db`, so they're safe to run at any time without affecting your local data.


Assisted-by: Claude-Web[Claude Sonnet 5]