import { Router } from "express";
import { db } from "../db/connection";
import { tags } from "../db/schema";
import { getAllTags } from "../controller/tagsController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use(authenticateToken);

// GET all tags
router.get("/", getAllTags);

//  POST create a new tag
router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body;

    const newTag = await db.insert(tags).values({ name, color }).returning();

    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tag" });
  }
});

export default router;
