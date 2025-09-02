import { db } from "../../db/index.js";

export const Habits = {
    allByUser: (userId) =>
        db.all("SELECT * FROM habits WHERE user_id = ? ORDER BY id DESC", [
            userId,
        ]),

    findById: (id) => db.get("SELECT * FROM habits WHERE id = ?", [id]),

    create: ({ name, frequency, icon, color, userId }) =>
        db.run(
            "INSERT INTO habits (name, frequency, icon, color, user_id) VALUES (?, ?, ?, ?, ?)",
            [name, frequency, icon, color, userId]
        ),

    update: ({ id, name, icon, color, frequency }) =>
        db.run(
            `UPDATE habits
            SET name = COALESCE(NULLIF(?, ''), name),
                icon = COALESCE(NULLIF(?, ''), icon),
                color = COALESCE(NULLIF(?, ''), color),
                frequency = COALESCE(?, frequency)
            WHERE id = ?`,
            [name, icon, color, frequency, id]
        ),

    remove: (id) => db.run("DELETE FROM habits WHERE id = ?", [id]),
};
