# Database Design

SQLite database, accessed via Prisma. Two independent tables — there are no foreign key relationships between them; each is a self-contained resource.

## `Task`

The core entity of the app. One row per to-do item.

| Column | Type | Notes |
|---|---|---|
| `id` | `Int` (PK, autoincrement) | |
| `title` | `String` | |
| `description` | `String` | |
| `dueDate` | `DateTime` | Used to compute the "Overdue" indicator (not a stored status). |
| `topic` | `String` | Free text; the UI offers suggestions but any value is accepted. |
| `status` | `Status` enum | One of `Todo`, `InProgress`, `Completed`. Fixed set, not user-configurable. |
| `archived` | `Boolean` (default `false`) | Soft-delete flag. Tasks are archived, never deleted, so they remain viewable. |
| `createdAt` | `DateTime` (default `now()`) | |
| `updatedAt` | `DateTime` (auto-updated) | |

## `Settings`

A singleton table — always exactly one row (`id` fixed at `1`) — holding app-wide preferences shared across the whole (single-user) app.

| Column | Type | Notes |
|---|---|---|
| `id` | `Int` (PK, fixed at `1`) | |
| `theme` | `String` (default `"blue"`) | One of `"blue"`, `"purple"`, `"mono"`. Read by the root layout to set the active theme before render. |


Assisted-by: Claude-Web[Claude Sonnet 5]