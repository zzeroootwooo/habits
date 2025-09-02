import { Habits } from "./habits.model.js";

export async function getAll(req, res) {
    const { userId } = req.query; // берём userId из query (?userId=1)
    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const habits = await Habits.allByUser(userId);
    res.json(habits);
}

export async function getOne(req, res) {
    const habit = await Habits.findById(req.params.id);
    if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
    }
    res.json(habit);
}

export async function create(req, res) {
    const { name, icon, color, frequency, userId } = req.body;

    if (!name || !icon || !color || !userId) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const r = await Habits.create({ name, icon, color, frequency, userId });
        const habit = await Habits.findById(r.lastID);
        res.status(201).json(habit);
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
            res.status(400).json({ error: "Name must be unique" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
}
export async function update(req, res) {
    const { id } = req.params;
    const { name, icon, color, frequency } = req.body;
    await Habits.update({ id, name, icon, color, frequency });
    const habit = await Habits.findById(id);
    res.json(habit);
}

export async function remove(req, res) {
    const { id } = req.params;
    const result = await Habits.remove(id);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Habit not found" });
    }
    res.status(204).end();
}
