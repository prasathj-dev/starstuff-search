import { db } from "../db/database.js";

export const universalFilter = (req, res) => {
  const { q } = req.query;

  if (!q) return res.json({ results: [] });

  const cleanQuery = q.normalize("NFKC").toLowerCase();

  let viewResults = db
    .prepare(
      `
    SELECT original_id AS id, name, type
    FROM search_entities_view
    WHERE name MATCH ?
    ORDER BY rank
    LIMIT 200`,
    )
    .all(cleanQuery);

  // Fallback: If FTS5 index (MATCH) misses due to typos,
  // i use a fuzzy LIKE pattern to ensure the user still finds results.

  if (viewResults.length === 0) {
    const fuzzyPattern = `${cleanQuery[0]}%${cleanQuery.slice(1).split("").join("%")}%`;
    viewResults = db
      .prepare(
        `
        SELECT original_id AS id, name, type
        FROM search_entities_view
        WHERE name LIKE ?
        ORDER BY (name LIKE ?) DESC, LENGTH(name) ASC
        LIMIT 100
    `,
      )
      .all(fuzzyPattern, `${cleanQuery}%`);
  }

  res.json({
    results: viewResults,
    meta: {
      total: viewResults.length,
      query: q,
    },
  });
};
