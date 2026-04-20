import dotenv from "dotenv";

import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import tagsRoutes from "./routes/tagsRoutes";
import tasksRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/tasks", tasksRoutes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
