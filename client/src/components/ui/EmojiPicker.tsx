"use client";

import { useState } from "react";

// Популярные emoji — можешь дополнить свой список
const emojis = [
    "📚",
    "💪",
    "🧘",
    "🎯",
    "🚰",
    "📝",
    "🧹",
    "🥗",
    "😴",
    "🏃",
    "🛏️",
    "🍎",
    "💻",
    "📖",
    "🧼",
    "🦷",
    "🧴",
    "🎧",
    "🧠",
    "⚽",
    "🪥",
    "🧊",
    "🕒",
    "💤",
    "☀️",
    "🔥",
    "🌿",
    "🧃",
];

export function EmojiPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (emoji: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="text-2xl border rounded-full w-12 h-12 flex items-center justify-center bg-white shadow-sm hover:scale-105 transition"
            >
                {value}
            </button>

            {open && (
                <div className="absolute z-10 mt-2 w-[220px] max-h-[200px] overflow-y-auto bg-white border rounded shadow-lg p-3 grid grid-cols-5 gap-2">
                    {emojis.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                                onChange(emoji);
                                setOpen(false);
                            }}
                            className="text-xl hover:scale-125 transition-all p-1 rounded hover:bg-gray-100"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
