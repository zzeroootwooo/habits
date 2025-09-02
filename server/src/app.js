import express from "express";
import cors from "cors";
import { habitsRouter } from "./modules/habits/habits.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";

export const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000", // для локальной разработки
            "http://192.168.100.4:3000", // для доступа с твоего устройства
            "https://habitloop.cc", // твой домен на проде
        ],
        credentials: true,
    })
);
app.use(express.json());

// роуты
app.use("/api/habits", habitsRouter);
app.use("/api/auth", authRouter);
