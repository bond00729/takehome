import { Request, Response } from 'express';
import { z } from 'zod';
import { init } from '@paralleldrive/cuid2';

import { prisma } from '../../lib/prisma';

const createId = init({ length: 9 });

const schema = z
  .object({
    url: z.string().url(),
  })
  .strict();

/**
 * @swagger
 * /api/v1/shorten:
 *   post:
 *     summary: Create a shortened link.
 *     description: Create a shortened link.
 *     requestBody:
 *       description: Create shortened link schema
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://en.wikipedia.org/wiki/John_Frusciante
 *     responses:
 *       200:
 *         description: The shortened link to use.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: http://localhost:8080/clk39pduw0002yyinboss60b2
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: invalid_string
 *                   message:
 *                     type: string
 *                     example: Invalid url
 *                   path:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: url
 */
export async function post(req: Request, res: Response) {
  const { url } = await schema.parseAsync(req.body);

  const slug = createId();
  const link = await prisma.link.create({
    data: {
      slug,
      original: url,
      new: `${process.env.SERVER_URL}/${slug}`,
    },
    select: {
      slug: true,
      original: true,
      new: true,
    },
  });

  // TODO: update swagger response type... just return the whole thing and use a component?
  res.json(link);
}
