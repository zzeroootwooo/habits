"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../../../UI/input";
import { Button } from "../../../../UI/button";
import { EmojiPicker } from "../../../../components/ui/EmojiPicker";
import { ColorPicker } from "../../../../components/ui/ColorPicker";

type FormData = {
    name: string;
    icon: string;
    color: string;
};

export default function EditHabitPage() {
    const { id } = useParams();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    // Load habit data from backend
    useEffect(() => {
        if (!id || typeof id !== "string") return;

        const loadHabit = async () => {
            try {
                const res = await fetch(`/api/habits/${id}`);
                if (!res.ok) throw new Error("Failed to fetch habit");
                const habit = await res.json();

                setValue("name", habit.name);
                setValue("icon", habit.icon);
                setValue("color", habit.color);
            } catch (err) {
                console.error("Failed to load habit", err);
            }
        };

        loadHabit();
    }, [id, setValue]);

    // Save updates
    const onSubmit = async (data: FormData) => {
        if (!id || typeof id !== "string") return;

        try {
            const res = await fetch(`/api/habits/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update habit");

            router.push("/");
        } catch (err) {
            console.error("Failed to update habit", err);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Edit Habit</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1">Habit Name</label>
                    <Input {...register("name", { required: true })} />
                    {errors.name && (
                        <p className="text-red-500 text-sm">Name is required</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Emoji</label>
                    <EmojiPicker
                        value={watch("icon")}
                        onChange={(val) => setValue("icon", val)}
                    />
                </div>

                <div>
                    <label className="block mb-1">Color</label>
                    <ColorPicker
                        value={watch("color")}
                        onChange={(val) => setValue("color", val)}
                    />
                </div>

                <Button type="submit" className="mt-4 w-full">
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
