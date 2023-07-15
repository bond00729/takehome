import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../../lib/prisma';

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
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: link ID.
 *                     example: clk39pduw0002yyinboss60b2
 *                   slug:
 *                     type: string
 *                     description: link's slug.
 *                     example: pxee0kr3n
 *                   original:
 *                     type: string
 *                     description: link's original url.
 *                     example: https://redhotchilipeppers.com/
 *                   redirects:
 *                     type: integer
 *                     description: number of times the shortened link has redirected.
 *                     example: 7
 *                   cursor:
 *                     type: integer
 *                     description: cursor used for pagination
 *                     example: 11
 *                   createdAt:
 *                     type: date-time
 *                     description: time the link was created
 *                     example: 2023-07-15T00:28:24.033Z
 *                   updatedAt:
 *                     type: date-time
 *                     description: last time the link was updated
 *                     example: 2023-07-15T00:28:29.885Z
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
