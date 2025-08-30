// server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;
// open() returns a db object with async methods
const db = await open({
    filename: "./db/habits.db",
    driver: sqlite3.Database,
});

// create a table (only runs once)
await db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    frequency INTEGER DEFAULT 0,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

app.get("/api/habits", async (req, res) => {
    const rows = await db.all("SELECT * FROM habits ORDER BY id DESC");
    res.json(rows);
});

app.get("/api/habits/:id", async (req, res) => {
    const { id } = req.params;
    const habit = await db.get("SELECT * FROM habits WHERE id = ?", [id]);
    if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
    }
    res.json(habit);
});

app.delete("/api/habits/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { changes } = await db.run("DELETE FROM habits WHERE id = ?", [
            id,
        ]);
        if (changes === 0) {
            res.status(404).json({ error: "Habit not found" });
        } else {
            res.status(204).end();
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/habits", async (req, res) => {
    const { name, icon, color, frequency } = req.body;
    if (!name || !icon || !color) {
        return res
            .status(400)
            .json({ error: "Name, icon, and color required" });
    }

    try {
        const result = await db.run(
            "INSERT INTO habits (name, frequency, icon, color) VALUES (?, ?, ?, ?)",
            [name, frequency, icon, color]
        );
        const habit = await db.get("SELECT * FROM habits WHERE id = ?", [
            result.lastID,
        ]);
        res.status(201).json(habit);
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
            res.status(400).json({ error: "Name must be unique" });
        } else {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

app.put("/api/habits/:id", async (req, res) => {
    const { id } = req.params;
    const { name, icon, color, frequency } = req.body;

    await db.run(
        `UPDATE habits
   SET name = CASE WHEN ? = '' THEN name ELSE ? END,
       icon = CASE WHEN ? = '' THEN icon ELSE ? END,
       color = CASE WHEN ? = '' THEN color ELSE ? END,
       frequency = COALESCE(?, frequency)
   WHERE id = ?`,
        [name, name, icon, icon, color, color, frequency, id]
    );

    const habit = await db.get("SELECT * FROM habits WHERE id = ?", [id]);
    res.json(habit);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
