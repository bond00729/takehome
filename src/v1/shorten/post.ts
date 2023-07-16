import { Request, Response } from 'express';
import { z } from 'zod';
import { init } from '@paralleldrive/cuid2';

import { prisma } from '$/lib/prisma';

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
 *               type: object
 *               $ref: '#/components/schemas/Link'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/BadRequest'
 */
export async function post(req: Request, res: Response) {
  const { url } = await schema.parseAsync(req.body);

  const slug = createId();
  const link = await prisma.link.create({
    data: {
      slug,
      original: url,
      shortened: `${process.env.SERVER_URL}/${slug}`,
    },
  });

  res.json(link);
}
