import { Router } from "express";
import { db } from "../db/connection";
import { tasks, users, tags, taskTags } from "../db/schema";
import { getAllTasks } from "../controller/taskController";
import { authenticateToken } from "../middleware/auth";

const router = Router();
router.use(authenticateToken);

// GET all tasks with user info
router.get("/", getAllTasks);

// POST create task (linked to user)
router.post("/", async (req, res) => {
  try {
    const { summary, details, userId, tagIds } = req.body;

    const [newTask] = await db
      .insert(tasks)
      .values({ summary, details, userId })
      .returning();

    // link tags
    if (tagIds && Array.isArray(tagIds)) {
      const taskTagValues = tagIds.map((tagId: string) => ({
        taskId: newTask.id,
        tagId,
      }));
      await db.insert(taskTags).values(taskTagValues);
    }

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

export default router;
