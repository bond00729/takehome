import express from "express";

import { shorten } from "./shorten";
import { stats } from "./stats";
import { view } from "./view";

const v1 = express.Router();

v1.use("/shorten", shorten);
v1.use("/stats", stats);

export { v1, view as v1View };
