import { Router } from "express";
import { getAll, getOne, create, update, remove } from "./habits.controller.js";

export const habitsRouter = Router();

habitsRouter.get("/", getAll);
habitsRouter.get("/:id", getOne);
habitsRouter.post("/", create);
habitsRouter.put("/:id", update);
habitsRouter.delete("/:id", remove);
