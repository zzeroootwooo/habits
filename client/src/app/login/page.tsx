"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../../UI/register";
import { Input } from "../../UI/input";
import { Button } from "../../UI/button";
import { useForm } from "react-hook-form";

type FormData = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const { register, handleSubmit } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) throw new Error("Login failed");

            const user = await res.json(); // { id, username }
            localStorage.setItem("user", JSON.stringify(user));

            console.log("✅ Login success:", user);

            // Хак — гарантированный переход
            window.location.href = "/protected";
        } catch (e) {
            console.error(e);
            alert("Ошибка при входе");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <Input
                            placeholder="Username"
                            {...register("username", { required: true })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-blue-500">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
