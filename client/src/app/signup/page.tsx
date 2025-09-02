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
import { useRouter } from "next/navigation";

type FormData = {
    username: string;
    password: string;
};

export default function SignUpPage() {
    const { register, handleSubmit } = useForm();
    const router = useRouter();
    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                }
            );

            if (!res.ok) throw new Error("Registration failed");

            const user = await res.json(); // { id, username }
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/login"); // редирект в защищёнку
        } catch (e) {
            console.error(e);
            alert("Ошибка при регистрации");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your account</CardDescription>
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
                            Sign Up
                        </Button>
                    </form>
                </CardContent>

                <CardFooter>
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-500">
                            Log in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
