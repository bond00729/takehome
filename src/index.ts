import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { v1 } from "$/v1";

const app = express();
app.use(express.json());

app.use("/api/v1", v1);

// TODO: move to handler function
app.get("/:id", (req, res) => {
  // fetch shortenedLink from db
  // if !shortenedLink; return 404
  // else return redirect (temp or perm?)
  res.send(`GET to /:id (${req.params.id})`);
});

// TODO: move to util function (?)
app.use((req, res) => {
  res.status(404).send("Not found");
});

// TODO: move to util function
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    console.log(err.issues);
    res.status(400).json(err.issues);
  } else {
    res.status(500).send("Internal server error");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 [server]: Server is running at http://localhost:${port}`);
});
