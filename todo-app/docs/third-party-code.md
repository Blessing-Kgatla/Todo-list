# Third-Party Code

Packages installed for this project, beyond the base Next.js/React scaffold, and why each was chosen.

| Package | Why |
|---|---|
| `prisma` / `@prisma/client` | Type-safe ORM for SQLite — generates TypeScript types directly from `schema.prisma`, so the database and app code can't drift apart. |
| `recharts` | React charting library used for the Analysis section's pie and bar charts — composes as React components rather than needing manual canvas/SVG work. |
| `vitest` | Test runner — fast, native TypeScript/ESM support, and near drop-in Jest-compatible API. |
| `@vitejs/plugin-react` | Lets Vitest compile and render JSX/TSX in tests. |
| `vite-tsconfig-paths` | Makes Vitest understand the `@/*` import alias defined in `tsconfig.json`, so tests can import the same way the app does. |
| `jsdom` | Simulates a browser DOM inside Node so component tests can render and be queried. |
| `@testing-library/react` | Renders React components in tests and queries them the way a user would (by visible text/role), rather than by internal implementation detail. |
| `@testing-library/user-event` | Simulates realistic user interactions (typing, clicking) in tests. |
| `@testing-library/jest-dom` | Adds readable DOM assertions (e.g. `toBeInTheDocument()`) on top of Vitest's expect. |
| `vitest-mock-extended` | Auto-generates a fully-typed mock Prisma client, so tests exercise real logic (validation, query shape) without touching the actual SQLite database. |

Core framework dependencies (`next`, `react`, `react-dom`, `tailwindcss`, `typescript`) came from the initial `create-next-app` scaffold and are not listed above.

Assisted-by: Claude-Web[Claude Sonnet 5]