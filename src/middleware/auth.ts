import { Request, Response, NextFunction } from "express";
import { JWTPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authenticated " });
    }

    const decoded = await verifyToken(token);

    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as AuthenticatedRequest).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};
