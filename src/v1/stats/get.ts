import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '$/lib/prisma';

const params = z
  .object({
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    cursor: z.coerce.number().positive().optional(),
  })
  .strict();

/**
 * @swagger
 * /api/v1/stats:
 *   get:
 *     summary: Retrieve a list of links.
 *     description: Retrieve a list of links.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of links to return.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The cursor of the last link in the previous set for pagination.
 *     responses:
 *       200:
 *         description: A list of links.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/Link'
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
export async function get(req: Request, res: Response) {
  const { limit, cursor } = await params.parseAsync(req.query);

  const links = await prisma.link.findMany({
    take: limit,
    ...(cursor && { skip: 1 }), // skip the cursor
    ...(cursor && {
      cursor: {
        cursor,
      },
    }),
    orderBy: {
      cursor: 'asc',
    },
  });

  res.json(links);
}
