import { Router } from "express";
import { register, login } from "../controller/authController"; // Import login here
import { insertUserSchema, loginSchema } from "../db/schema"; // Don't forget the login validation
import { validateBody } from "../middleware/validation";

const router = Router();

// 1. Registration
router.post("/register", validateBody(insertUserSchema), register);

// 2. Login
// It's best to validate the body here too so you don't waste DB resources
// on requests with missing emails/passwords.
router.post("/login", validateBody(loginSchema), login);

export default router;
