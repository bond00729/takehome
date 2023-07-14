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
  } else if (err.name === "NotFoundError") {
    res.status(404).send("Not found");
  } else {
    res.status(500).send("Internal server error");
  }
}
