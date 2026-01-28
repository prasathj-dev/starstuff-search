# Universal Search (Cmd + K)

This repository contains a **full-stack implementation of a Universal Search**
experience for _Starstuff_. The goal is to provide a fast, keyboard-driven search
that lets users quickly find **Users, Spaces, and Communities** from anywhere in
the app.

The focus is not just on returning results, but on making the search feel
**snappy, forgiving of typos, and easy to scale** as the dataset grows.

---

## Repository Structure

This repo contains both frontend and backend projects.  
Each part has its own README with more detailed explanations.

- **`backend/README.md`** → Backend-specific info: API, database, search logic, performance
- **`frontend/README.md`** → Frontend-specific info: UI, SvelteKit pages, Tailwind setup

---

## Key Features

- Global Hotkey: Instant access via Cmd/Ctrl + K.

- Unified Results: Categorized results (Users, Spaces, Communities) in a single view.

- Debounced API Calls: Optimized network traffic to prevent server hammering.

- Typo-Tolerance: Smart fallback logic for near-miss searches.

## Tech Stack

### Frontend

- **SvelteKit 5**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Node.js**
- **Express**
- **SQLite (via `better-sqlite3`)**
- **SQLite FTS5** for full-text search

---

## How to Run the Project

### 1. Start the Backend

```bash
cd starstuff-backend
npm install
npm run start
```

**The backend will be available at:**

**- http://localhost:3000 -**

On startup, it:

Creates the SQLite database

Seeds mock data

### 2. Start the Frontend

```bash
cd starstuff-frontend
npm install
npm run dev
```

**The frontend will be available at:**

**- http://localhost:5173 -**

## How It Works

- The frontend listens for Cmd / Ctrl + K to open the search modal

- User input is debounced to avoid unnecessary requests

- Queries are sent to the backend search API

- The backend searches across users, spaces, and communities

- Results are returned in a unified format and displayed in grouped sections

- Search Strategy (Key Design Decision)

- The backend uses a two-step search approach:

- Fast path (Primary search)

        SQLite FTS5 is used to quickly retrieve the best matching candidates using
        indexed full-text search.

- Fallback path (Typo-tolerant)

        If FTS returns no results (for example due to typos), a controlled LIKE-based
        fuzzy query is used as a fallback.

This approach balances:

- Performance — indexed search with limited result sets

- User experience — forgiving of typos like Strstuff → StarStuff

- The fallback only runs when needed, keeping performance predictable.

**- Why SQLite + better-sqlite3? -**

- SQLite was chosen for this assignment because:

- Zero setup and zero network latency

- Excellent read performance with FTS5

- The better-sqlite3 library was used because it provides:

        Synchronous, predictable queries

        Very low overhead

        Strong performance for read-heavy workloads

## Scaling Strategy (Future)

**Database**

- Migrate from SQLite to PostgreSQL using full-text search or pg_trgm.
  The API contract can remain unchanged.

- Backend scaling

- Run multiple Node.js instances behind a load balancer to handle concurrent traffic.

**Search evolution**

- For advanced ranking, personalization, or heavy typo tolerance, move search
  indexing to a dedicated search engine (e.g. Elasticsearch).

- The current design avoids over-engineering while keeping a clear upgrade path.

## Summary

- This project focuses on:

- Fast perceived performance

- Clean separation between frontend and backend

- Practical, realistic scaling decisions

- A modern, keyboard-first search experience
