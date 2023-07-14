import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

const params = z
  .object({
    limit: z.coerce.number().min(1).max(100).default(10).optional(),
    cursor: z.coerce.number().positive().optional(),
  })
  .strict();

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
      cursor: "asc",
    },
  });

  res.json(links);
}
