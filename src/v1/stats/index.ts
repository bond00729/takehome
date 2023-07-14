import express from "express";

import { asyncHandler } from "$/utils/asyncHandler";

import { get } from "./get";

const stats = express.Router();
stats.route("/").get(asyncHandler(get));

export { stats };
