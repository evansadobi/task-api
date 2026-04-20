import { Request, Response } from "express";
import { db } from "../db/connection";
import { tags } from "../db/schema";

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const allTags = await db.select().from(tags);
    res.json(allTags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};
