import express from "express";

import { v1, v1View } from "$/v1";
import { errorHandler } from "$/utils/errorHandler";
import { notFoundHandler } from "$/utils/notFoundHandler";
import { asyncHandler } from "$/utils/asyncHandler";

const app = express();
app.use(express.json());

app.use("/api/v1", v1);
app.get("/:slug", asyncHandler(v1View));

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 [server]: Server is running at http://localhost:${port}`);
});
