import Database from "better-sqlite3";
export const db = new Database("./src/db/starstuff.db");
import { randomUUID } from "crypto";

db.pragma("journal_mode = WAL");
db.pragma("cache_size = -2000");

// Tables Setup with view
db.exec(
  `
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY , username TEXT NOT NULL, email TEXT, avatar TEXT);
    CREATE TABLE IF NOT EXISTS spaces (id TEXT PRIMARY KEY , space_name TEXT NOT NULL, avatar TEXT);
    CREATE TABLE IF NOT EXISTS communities (id TEXT PRIMARY KEY , title TEXT NOT NULL, avatar TEXT);

    CREATE VIRTUAL TABLE IF NOT EXISTS search_entities_view USING fts5(
      original_id UNINDEXED,
      name,
      type UNINDEXED,
      tokenize='trigram case_sensitive 0'
    );
`,
);

//Prepare inser statement

const insertUser = db.prepare(
  "INSERT INTO users (id,username, email) VALUES (?,?,?)",
);
const insertSpace = db.prepare(
  "INSERT INTO spaces (id,space_name) VALUES (?,?)",
);
const insertComm = db.prepare(
  "INSERT INTO communities (id,title) VALUES (?,?)",
);

//Adding Dummy 10k records at once
const seed = db.transaction(() => {
  // Clear everything
  db.prepare("DELETE FROM users").run();
  db.prepare("DELETE FROM spaces").run();
  db.prepare("DELETE FROM communities").run();
  db.prepare("DELETE FROM search_entities_view").run();

  insertUser.run(randomUUID(), "StarLord99", "starload99@gmail.com");
  insertUser.run(randomUUID(), "StarStuff", "starstuff@gmail.com");
  insertSpace.run(randomUUID(), "Stardust Cafe");
  insertComm.run(randomUUID(), "Star Wars Fans");
  insertComm.run(randomUUID(), "Star");

  for (let i = 1; i <= 34000; i++) {
    insertUser.run(randomUUID(), `GameChanger${i}`, null);
    insertSpace.run(randomUUID(), `Nova${i}`);
    insertComm.run(randomUUID(), `Final Destination Fans ${i}`);
  }

  //Once the tables created with data , we copy it to the FTS5 index
  db.prepare(
    `
    INSERT INTO search_entities_view (original_id, name, type)
    SELECT id, username, 'user' FROM users
  `,
  ).run();

  db.prepare(
    `
    INSERT INTO search_entities_view (original_id, name, type)
    SELECT id, space_name, 'space' FROM spaces
  `,
  ).run();

  db.prepare(
    `
    INSERT INTO search_entities_view (original_id, name, type)
    SELECT id, title, 'community' FROM communities
  `,
  ).run();
});

console.log("db started to seeding with 10k records..Please wait");
seed();
console.log("db has been seeded");
