import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof z.ZodError) {
    res.status(400).json(err.issues);
  } else {
    res.status(500).send("Internal server error");
  }
}
