import { db } from "../../db/index.js";

export const Users = {
    create: ({ username, password_hash }) =>
        db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [
            username,
            password_hash,
        ]),

    findByUsername: (username) =>
        db.get("SELECT * FROM users WHERE username = ?", [username]),
};
