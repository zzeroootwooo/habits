import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = await open({
    filename: path.join(__dirname, "habits.db"),
    driver: sqlite3.Database,
});

// читаем и применяем схему
const schemaPath = path.join(__dirname, "habits.sql");
const schema = await fs.readFile(schemaPath, "utf8");
await db.exec(schema);
