import { Suspense } from "react";
import HabitForm from "../HabitAddForm/HabitAddForm";

export default function AddHabitPage() {
    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Create a Habit</h1>
            <Suspense fallback={<div>Loading form...</div>}>
                <HabitForm />
            </Suspense>
        </div>
    );
}
