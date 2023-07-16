import express from 'express';

import { asyncHandler } from '$/utils/asyncHandler';

import { post } from './post';
import { patch } from './patch';

const shorten = express.Router();

shorten.route('/').post(asyncHandler(post)).patch(asyncHandler(patch));

export { shorten };
