import express from "express";

import { v1 } from "$/v1";
import { errorHandler } from "$/utils/errorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";

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

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 [server]: Server is running at http://localhost:${port}`);
});
