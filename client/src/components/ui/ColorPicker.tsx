"use client";

type Props = {
    value: string;
    onChange: (color: string) => void;
};

const colors = [
    "#f87171",
    "#facc15",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
];

export function ColorPicker({ value, onChange }: Props) {
    return (
        <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={`w-8 h-8 rounded-full border-2 transition duration-200 ${
                        value === color
                            ? "border-black scale-110"
                            : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
}
