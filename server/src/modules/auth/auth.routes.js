import { Router } from "express";
import { register, login } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
