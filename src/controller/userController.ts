import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users);
    // Exclude passwords when sending to client
    const sanitizedUsers = allUsers.map(({ password, ...rest }) => rest);
    res.json(sanitizedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id as string;

    // Check if user exists
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
