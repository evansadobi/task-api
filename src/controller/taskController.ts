import { Request, Response } from "express";
import { db } from "../db/connection";
import { tasks } from "../db/schema";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const allTasks = await db.select().from(tasks);
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
