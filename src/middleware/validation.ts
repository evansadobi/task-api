import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateBody = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return res.status(400).json({ error: "validation failed", details });
      }

      next(error);
    }
  };
};
