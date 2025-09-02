import bcrypt from "bcrypt";
import { Users } from "./auth.model.js";

export const register = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await Users.findByUsername(username);

    if (!username || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await Users.create({ username, password_hash });

    res.status(201).json({ id: result.lastID, username });
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const user = await Users.findByUsername(username);
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
        id: user.id,
        username: user.username,
    });
};
