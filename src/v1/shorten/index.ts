import express from "express";

import { post } from "./post";
import { patch } from "./patch";

const shorten = express.Router();
shorten.route("/").post(post).patch(patch);

export { shorten };
