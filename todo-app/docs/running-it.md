# Running It

**Requirements:** Node.js v24.13.1 (developed and tested on this version — run node -v to confirm yours matches, or use a version manager like nvm to switch).

From a clean clone, with nothing else to hand:

```bash
# 1. Move into project
git clone https://github.com/Blessing-Kgatla/Todo-list.git

cd Todo-list
cd todo-app

# 2. Install dependencies
npm install

# 3. Create your local environment file
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Generate the Prisma client and create the SQLite database
npx prisma generate
npx prisma migrate dev --name init

# 5. Run the app
npm run dev
```

Then open **http://localhost:3000** — it redirects to `/dashboard/tasks`.

## Running tests

```bash
npm test
```

Tests use a mocked Prisma client (see `lib/__mocks__/prisma.ts`) and never touch `dev.db`, so they're safe to run at any time without affecting your local data.


Assisted-by: Claude-Web[Claude Sonnet 5]