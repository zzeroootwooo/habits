"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../../../UI";
import { Button } from "../../../UI";
import { EmojiPicker } from "../../../components/ui/EmojiPicker";
import { ColorPicker } from "../../../components/ui/ColorPicker";
import { useEffect, useState } from "react";

type FormData = { name: string; icon: string; color: string };

export default function HabitForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialName = searchParams.get("name") || "";
    const [user, setUser] = useState<{ id: number } | null>(null);

    useEffect(() => {
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
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: { name: initialName, icon: "", color: "#60a5fa" },
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (!user?.id) return;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/habits`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...data,
                        frequency: 0,
                        userId: user.id,
                    }),
                }
            );
            if (!res.ok) throw new Error("Failed to create habit");
            await res.json();
            router.push("/protected");
        } catch (error) {
            console.error("Failed to save habit", error);
            alert("Failed to save habit");
        }
    };

    if (!user) return <p className="p-6">Loading…</p>;

    return (
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
    );
}
