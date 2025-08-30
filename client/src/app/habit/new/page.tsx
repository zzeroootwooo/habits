"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../../../UI/input";
import { Button } from "../../../UI/button";
import { EmojiPicker } from "../../../components/ui/EmojiPicker";
import { ColorPicker } from "../../../components/ui/ColorPicker";

type FormData = {
    name: string;
    icon: string;
    color: string;
};

export default function AddHabitPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialName = searchParams.get("name") || "";

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: initialName,
            icon: "",
            color: "#60a5fa",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, frequency: 0 }),
            });

            if (!res.ok) {
                throw new Error("Failed to create habit");
            }

            await res.json();
            router.push("/"); // go back to homepage
        } catch (error) {
            console.error("Failed to save habit", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Create a Habit</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1">Habit Name</label>
                    <Input {...register("name", { required: true })} />
                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            This field is required
                        </p>
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
                    Save Habit
                </Button>
            </form>
        </div>
    );
}
