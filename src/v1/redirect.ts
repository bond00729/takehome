import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

const params = z
  .object({
    slug: z.string(),
  })
  .strict();

/**
 * @swagger
 * /{slug}:
 *   get:
 *     summary: Use a shortened url.
 *     description: Use a shortened url.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug for the original url.
 *     responses:
 *       302:
 *         description: Slug found, redirect to original
 *       404:
 *         description: Slug not found
 */
export async function redirect(req: Request, res: Response) {
  const { slug } = await params.parseAsync(req.params);

  const link = await prisma.link.findUniqueOrThrow({
    where: { slug },
  });

  res.redirect(link.original);

  await prisma.link.update({
    where: { slug },
    data: { redirects: { increment: 1 } }, // TODO: are redirects unique to users or to links?
  });
}
