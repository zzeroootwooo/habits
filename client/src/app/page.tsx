"use client";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { Input } from "../UI/input";
import { Button } from "../UI/button";
import { useRouter } from "next/navigation";

type Habit = {
    id: string;
    name: string;
    icon: string;
    color: string;
    doneToday?: boolean;
};

export default function HomePage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [confirmId, setConfirmId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        const loadHabits = async () => {
            const response = await fetch("/api/habits");
            const data = await response.json();
            setHabits(data);
        };

        loadHabits();

        const handleVisibility = () => {
            if (document.visibilityState === "visible") loadHabits();
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const handleAddHabit = () => {
        if (inputValue.trim() === "") return;

        router.push(`/habit/new?name=${encodeURIComponent(inputValue)}`);
    };

    const toggleDone = (id: string) => {
        const updated = habits.map((habit: any) => {
            if (habit.id === id) {
                if (!habit.doneToday) {
                    confetti();
                }
                return { ...habit, doneToday: !habit.doneToday };
            }
            return habit;
        });

        setHabits(updated);
        localStorage.setItem("habits", JSON.stringify(updated));
    };

    const handleDeleteHabit = async (id: string) => {
        const updatedHabits = habits.filter((habit) => habit.id !== id);
        await fetch(`/api/habits/${id}`, {
            method: "DELETE",
        });

        setHabits(updatedHabits);
        setConfirmId(null);
    };

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            <div className="max-w-md mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-center">Habit Loop</h1>

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
                                {confirmId && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 space-y-4 w-[90%] max-w-sm">
                                            <p className="text-lg font-semibold text-center">
                                                Are you sure you want to delete
                                                this habit?
                                            </p>
                                            <div className="flex justify-between">
                                                <Button
                                                    variant="default"
                                                    onClick={() =>
                                                        setConfirmId(null)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDeleteHabit(
                                                            confirmId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
