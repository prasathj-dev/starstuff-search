This project implements a universal search API similar to a command palette
(Cmd / Ctrl + K). It allows searching across **users**, **spaces**, and
**communities** from a single endpoint, with fast responses and typo tolerance.

The focus of this project is search experience, performance, and clean backend
architecture.

## Tech Stack

- Node.js
- Express
- SQLite (better-sqlite3)
- SQLite FTS5 (trigram tokenizer)

---

## How to Run

1. Install dependencies

```bash
npm install
```

2. Star the Server

```bash
 npm run start
```

- After you start it, the server will create three files in src/db, including the main starstuff.db database. The other two are .db-wal and .db-shm (used by SQLite for temporary logging and shared memory).

## Server will run at

[text](http://localhost:3000)

## Search Endpoint

GET /api/search?q=<query>

## Example

http://localhost:3000/api/search?q=Strstuﬀ

I chose a flat, typed results array with metadata for flexibility and future-proofing:

      - {
        "results": [
        {
        "id": "uuid",
        "name": "StarStuff",
        "type": "community" // 'user' | 'space' | 'community'
        }
        ],
        "meta": {
        "total": 1,
        "query": "Strstuﬀ"
        //we can include pagination in future
        }
        }

## Database Design

Data is stored in three tables:

- users
- spaces
- communities

Added FTS5 virtual table for speedup search

- search_entities_view

## Search Implementation & Design Decisions

- **Initial approach**

- I started with a straightforward solution:
  - Queried all searchable entities (users, spaces, communities) using UNION ALL

  - Used LIKE for prefix matching

  - Applied Fuse.js in memory to handle typos and rank results

  - This worked fine for small data, but once the dataset grew to a few thousand rows, performance became noticeable.
    On my machine, search requests were taking ~180–220 ms, mainly because:

             - Multiple tables were scanned per request

             - LIKE queries were not selective enough

             - Fuse was running on a relatively large result set

             - At that point, it was clear this approach wouldn’t scale well.

- **Moving to SQLite FTS5**
  - To improve performance, I introduced SQLite FTS5 as a dedicated search index.

  - All searchable data is synced into a single virtual table (search_entities_view) that contains:

            - The entity ID

            - The searchable name

            - The entity type (user, space, community)

            - This allows the database to handle fast prefix matching and ranking natively.

- With FTS5 in place:

         -  The initial entity set is filtered directly by SQLite

         -   Queries consistently run in under 100 ms

         -  Only a small, relevant subset of results is returned to the API

         -  FTS acts as a high-speed entity filter, which significantly reduces the amount of work done in Node.js.

- Why a Fallback Query Is Needed

        SQLite FTS5 is fast but only finds exact matches, so typos or small mistakes can return no results.

        A fallback query helps by doing a looser, “fuzzy” search on a smaller set of data when FTS5 finds too few matches.

        This way, searches stay:

            Fast by default (thanks to FTS5)

            Friendly to typos or incomplete input

            Efficient, since the fallback runs only when needed

## Performance Awareness & Scaling

**Current setup (~10k records)**

- For the mock dataset, performance is already within a comfortable range:
- Search queries are consistently fast (generally under 100 ms on my machine).
- On the frontend, the input is debounced (~300 ms) and a loading state is shown, so typing feels responsive and doesn’t trigger unnecessary requests.
- Results are intentionally limited (top 10–15 items total across categories).
- This keeps the UI clean and matches how cmd+k style search is typically used.

**Pagination note:**

- For this universal / command-palette style search, I intentionally didn’t implement pagination or “Load more”.
- If this were expanded into a dedicated search page later, the API can easily support cursor-based pagination (e.g. lastId + type) without changing the core search logic.

**For real scale (10 million rows + hundreds concurrent users):**

- If this needed to scale to millions of rows and high concurrency, the overall approach would stay the same, but the underlying storage would change:

  **Database**: Move from SQLite to PostgreSQL and use pg_trgm with GIN indexes for fast fuzzy text matching at scale.

  **Query strategy**: I’d still use the same strategy: database filters first to get a manageable entity set, then apply ranking in memory.
  This way, even with millions of records, the API stays fast and predictable.

  **Caching**: If many users search for the same thing (like “star”), I can temporarily store the result in memory (Redis).
  That way, the server doesn’t need to hit the database every time for the same query.

  **Backend scaling**: If more people use the app, I can run several copies of the server. A load balancer will share the work, so the app can handle more users at once.

  **Monitoring**: I would add simple monitoring to see how long search requests take.
  If something suddenly becomes slow, it’s easy to notice and fix early.
