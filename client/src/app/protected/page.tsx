"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../UI/input";
import { Button } from "../../UI/button";
import confetti from "canvas-confetti";

type Habit = {
    id: number;
    name: string;
    icon: string;
    color: string;
    frequency: number;
    doneToday?: boolean;
};

export default function ProtectedHabitsPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: number; username: string } | null>(
        null
    );
    const [habits, setHabits] = useState<Habit[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [confirmId, setConfirmId] = useState<number | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("user");
            if (!saved) {
                window.location.href = "/login";
                return;
            }
            const u = JSON.parse(saved);
            if (!u?.id) {
                window.location.href = "/login";
                return;
            }
            setUser(u);
        } catch {
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const loadHabits = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/habits?userId=${user.id}`
            );
            if (!res.ok) return;
            const data = await res.json();
            setHabits(data);
        };

        loadHabits();

        // обновлять при возврате на вкладку
        const onVis = () => {
            if (document.visibilityState === "visible") loadHabits();
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [user]);

    // 3) переход на форму создания (как в HomePage)
    const handleAddHabit = () => {
        const name = inputValue.trim();
        if (!name) return;
        router.push(`/habit/new?name=${encodeURIComponent(name)}`);
    };

    // 4) локальный toggle чекбокса с конфетти
    const toggleDone = (id: number) => {
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id === id) {
                    if (!h.doneToday) confetti();
                    return { ...h, doneToday: !h.doneToday };
                }
                return h;
            })
        );
    };

    // 5) удаление с подтверждением
    const handleDeleteHabit = async (id: number) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits/${id}`, {
            method: "DELETE",
        });
        setHabits((prev) => prev.filter((h) => h.id !== id));
        setConfirmId(null);
    };

    if (!user) return <p className="p-6">Loading…</p>;

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            <div className="max-w-md mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-center">
                    Hi, {user.username}! Want to create a habit?
                </h1>

                <div className="flex gap-2">
                    <Input
                        placeholder="Enter habit name"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Button onClick={handleAddHabit}>Add Habit</Button>
                </div>

                <ul className="space-y-2 mt-4">
                    {habits.map((habit) => (
                        <li
                            key={habit.id}
                            className="flex items-center gap-3 p-3 rounded border"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 flex items-center justify-center rounded-full text-xl"
                                    style={{ backgroundColor: habit.color }}
                                >
                                    {habit.icon}
                                </div>
                                <span
                                    className={`font-medium ${
                                        habit.doneToday
                                            ? "line-through opacity-70"
                                            : ""
                                    }`}
                                >
                                    {habit.name}
                                </span>
                            </div>

                            <div className="ml-auto flex items-center gap-2">
                                <input
                                    onChange={() => toggleDone(habit.id)}
                                    checked={habit.doneToday || false}
                                    type="checkbox"
                                    className="w-5 h-5"
                                />
                                <Button
                                    onClick={() =>
                                        router.push(`/habit/edit/${habit.id}`)
                                    }
                                >
                                    Edit Habit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setConfirmId(habit.id)}
                                >
                                    X
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Модалка подтверждения удаления */}
                {confirmId !== null && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 space-y-4 w-[90%] max-w-sm">
                            <p className="text-lg font-semibold text-center">
                                Are you sure you want to delete this habit?
                            </p>
                            <div className="flex justify-between">
                                <Button
                                    variant="default"
                                    onClick={() => setConfirmId(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteHabit(confirmId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4">
                <button
                    className="text-sm text-red-600 underline"
                    onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
