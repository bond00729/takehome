import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 8080;

// TODO: add base api route (/api/v1/...) to api routes

// TODO: move these to separate routers
app.post("/shorten", (req: Request, res: Response) => {
  res.send("POST to /shorten");
});
app.patch("/shorten", (req: Request, res: Response) => {
  res.send("PATCH to /shorten");
});

app.get("/stats", (req: Request, res: Response) => {
  res.send("GET to /stats");
});

app.get("/:id", (req: Request, res: Response) => {
  res.send(`GET to /:id (${req.params.id})`);
});

// TODO: handle 404s

app.listen(port, () => {
  console.log(`🚀 [server]: Server is running at http://localhost:${port}`);
});
