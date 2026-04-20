import { Request, Response } from "express";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "../utils/jwt";
import { hashPassword, comparePasswords } from "../utils/password";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, age, password, role } = req.body;

    const hashedPassword = await hashPassword(password);
    const userRole = role || "user";

    const [newUser] = await db
      .insert(users)
      .values({ email, name, age, password: hashedPassword })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        age: users.age,
        role: users.role,
      });

    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      age: newUser.age,
      role: newUser.role || "user",
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // 2. Validate user existence and password
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 4. Return success with user data (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        age: user.age,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to login",
    });
  }
};
