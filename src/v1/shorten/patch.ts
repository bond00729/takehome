import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '$/lib/prisma';

const schema = z
  .object({
    slug: z.string(),
    url: z.string().url(),
  })
  .strict();

/**
 * @swagger
 * /api/v1/shorten:
 *   patch:
 *     summary: Update a link.
 *     description: Update a link.
 *     requestBody:
 *       description: Update link schema
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *               - url
 *             properties:
 *               slug:
 *                 type: string
 *                 example: bxazg6osq
 *               url:
 *                 type: string
 *                 example: https://redhotchilipeppers.com
 *     responses:
 *       200:
 *         description: The updated link.
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
 *       404:
 *         description: Not found
 */
export async function patch(req: Request, res: Response) {
  const { slug, url } = await schema.parseAsync(req.body);

  const link = await prisma.link.update({
    where: {
      slug,
    },
    data: {
      original: url,
      redirects: 0,
    },
  });

  res.json(link);
}
