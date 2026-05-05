# Interact with the Database

## Overview

The project uses **PostgreSQL 16** as the database and **Prisma ORM v5** as the data access layer.
The Prisma schema is the single source of truth: `backend/database/prisma/schema.prisma`.
Application code never queries the database directly — it always goes through the `layer` package.

---

## Connection Details

| Setting  | Value              |
|----------|--------------------|
| Host     | `localhost` (host) / `db` (inside Docker) |
| Port     | `5432`             |
| User     | `news_summarizer`  |
| Password | `news_summarizer`  |
| Database | `news_summarizer`  |

**DATABASE_URL format:**
```
# Local (host machine)
DATABASE_URL="postgresql://news_summarizer:news_summarizer@localhost:5432/news_summarizer"

# Inside Docker containers
DATABASE_URL="postgresql://news_summarizer:news_summarizer@db:5432/news_summarizer"
```

Environment variables are read from `backend/database/.env` (not committed — copy from `backend/database/env.example`):
```
POSTGRES_USER=news_summarizer
POSTGRES_PASSWORD=news_summarizer
POSTGRES_DB=news_summarizer
```

---

## Schema — Video Model

File: `backend/database/prisma/schema.prisma`

```prisma
model Video {
  id               Int      @id @default(autoincrement())
  videoId          String   @unique @map("video_id")
  title            String
  description      String?
  publishedAt      DateTime @map("published_at")
  generatedContent String   @map("generated_content")
  youtubeUrl       String?  @map("youtube_url")
  source           String?
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("videos")
}
```

---

## Prisma Commands

All Prisma commands must point to the schema file in `backend/database/`.

```bash
# Push schema changes to the database (no migration file generated)
cd backend/database
npx prisma db push --schema prisma/schema.prisma

# Generate / regenerate Prisma Client after schema changes
npx prisma generate --schema prisma/schema.prisma

# Open Prisma Studio (GUI browser for the database)
npx prisma studio --schema prisma/schema.prisma

# Run migrations (production-grade, creates migration files)
npx prisma migrate dev --schema prisma/schema.prisma --name <migration_name>
```

> After any schema change, regenerate the client in **both** `backend/database` and `backend/layer`:
> ```bash
> cd backend/database && npx prisma generate --schema prisma/schema.prisma
> cd ../layer      && npx prisma generate --schema ../database/prisma/schema.prisma
> ```

---

## psql — Direct Database Access

Connect to the running Docker container:
```bash
docker exec -it news_summarizer_db psql -U news_summarizer -d news_summarizer
```

Useful psql commands:
```sql
\dt                          -- list all tables
\d videos                    -- describe the videos table
SELECT * FROM videos;        -- list all videos
SELECT COUNT(*) FROM videos; -- count rows
```

---

## Layer API — Application Code

Application code uses the `layer` package (`backend/layer`), not Prisma directly.
Import from `layer/feature/youtube`:

```js
const {
  getAllProcessedItems,   // returns all videos as API-shaped objects
  hasVideo,              // returns true if a videoId already exists
  saveProcessedItem,     // upserts a video record
  seedIfEmpty,           // seeds initial data only if the table is empty
} = require('layer/feature/youtube');
```

### Function reference

#### `getAllProcessedItems() → Promise<ApiItem[]>`
Returns all `Video` rows ordered by `publishedAt` descending, mapped to the API shape:
```js
{
  id, title, summary, youtubeUrl, publishedAt, source, description
}
```

#### `hasVideo(videoId: string) → Promise<boolean>`
Returns `true` if a row with the given `videoId` already exists.

#### `saveProcessedItem(item) → Promise<ApiItem>`
Upserts a video. Input shape:
```js
{
  id | videoId,   // required
  title,
  description,
  publishedAt,    // ISO string or Date
  summary | generatedContent,
  youtubeUrl,     // optional — defaults to youtube.com/watch?v=<id>
  source          // optional — defaults to 'api'
}
```

#### `seedIfEmpty(seedItems[]) → Promise<void>`
Calls `saveProcessedItem` for each item only when the `videos` table is empty.
Used in `backend/server/index.js` on server startup.

---

## PrismaClient Instantiation (layer internals)

File: `backend/layer/db/prisma/index.js`

The client uses a try/catch fallback so it works both locally (where `@prisma/client` is
generated inside `backend/layer/node_modules`) and inside Docker containers (where it falls
back to the generated client in `/app/database/node_modules/@prisma/client`):

```js
function createPrismaClient() {
  try {
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient();
  } catch (error) {
    const { PrismaClient } = require('/app/database/node_modules/@prisma/client');
    return new PrismaClient();
  }
}
```

---

## Docker Compose — DB Service

The `db` service defined in `docker-compose.yml`:
- Image: `postgres:16-alpine`
- Container name: `news_summarizer_db`
- Port: `5432:5432`
- Health check: `pg_isready -U news_summarizer`
- `backend` and `backend_cron` services depend on `db` being healthy before starting and run
  `npx prisma db push` before their main process.

---

## Adding a New Model

1. Add the model to `backend/database/prisma/schema.prisma`.
2. Run `npx prisma db push` (or `migrate dev`) from `backend/database/`.
3. Regenerate the client in `backend/database` and `backend/layer` (see commands above).
4. Add data-access functions to a new or existing file under `backend/layer/feature/`.
5. Export the new functions from `backend/layer/feature/index.js`.
