import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma';

const schema = z
  .object({
    slug: z.string().cuid(),
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
 *               properties:
 *                 slug:
 *                   type: string
 *                   description: link's slug.
 *                   example: bxazg6osq
 *                 original:
 *                   type: string
 *                   description: link's original url.
 *                   example: https://www.53thieves.com/
 *                 redirects:
 *                   type: integer
 *                   description: number of times the shortened link has redirected.
 *                   example: 16
 *                 cursor:
 *                   type: integer
 *                   description: cursor used for pagination
 *                   example: 3
 *                 createdAt:
 *                   type: date-time
 *                   description: time the link was created
 *                   example: 2023-07-15T00:39:14.033Z
 *                 updatedAt:
 *                   type: date-time
 *                   description: last time the link was updated
 *                   example: 2023-07-15T00:59:42.885Z
 */
export async function patch(req: Request, res: Response) {
  const { slug, url } = await schema.parseAsync(req.body);

  const link = await prisma.link.update({
    where: {
      slug,
    },
    data: {
      original: url,
      redirects: 0, // TODO: is the ability to reset the view count independent of updating the original or are they tied together?
    },
    select: {
      slug: true,
      original: true,
      redirects: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json(link);
}
