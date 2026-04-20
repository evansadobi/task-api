import { Router } from "express";
import { getAllUsers, deleteUser } from "../controller/userController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();
router.use(authenticateToken);

// GET all users - admin only
router.get("/", requireAdmin, getAllUsers);

// DELETE user - admin only
router.delete("/:id", requireAdmin, deleteUser);

export default router;
