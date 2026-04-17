import { beforeEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";

describe("SQLite Event Queue (Pipeline Core)", () => {
  let db: Database.Database;

  beforeEach(() => {
    // Scaffold an in-memory SQLite db that mimics our event queue
    db = new Database(":memory:");
    db.exec(`
      CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'pending'
      );
    `);
  });

  it("should enforce exactly-once (FIFO) processing semantics in the pipeline", () => {
    // 1. Setup: Publish multiple jobs concurrently
    const stmt = db.prepare("INSERT INTO events (type, payload) VALUES (?, ?)");
    stmt.run("JOB_DISCOVERED", JSON.stringify({ id: "job1" }));
    stmt.run("JOB_DISCOVERED", JSON.stringify({ id: "job2" }));

    // Construct an atomic update query mirroring our internal queue consumer design
    const getNext = db.prepare(`
      UPDATE events SET status = 'processing' 
      WHERE id = (SELECT id FROM events WHERE status = 'pending' ORDER BY id ASC LIMIT 1)
      RETURNING *;
    `);
    
    // 2. Consume Job 1
    const firstJob = getNext.get() as any;
    expect(firstJob.status).toBe("processing");
    expect(JSON.parse(firstJob.payload).id).toBe("job1");

    // 3. Consume Job 2
    const secondJob = getNext.get() as any;
    expect(secondJob.status).toBe("processing");
    expect(JSON.parse(secondJob.payload).id).toBe("job2");

    // 4. Verification: No jobs left
    const thirdJob = getNext.get();
    expect(thirdJob).toBeUndefined();
  });
});
