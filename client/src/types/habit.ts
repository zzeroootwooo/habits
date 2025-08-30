export type Habit = {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    type?: "good" | "bad";
    difficulty?: "easy" | "medium" | "hard";
    frequency?: number; // times per day
    daysOfWeek?: string[]; // ['Mon', 'Wed', 'Fri']
    startDate?: string; // ISO
    endDate?: string; // ISO
    createdAt: string;
    completedDates: string[];
};
