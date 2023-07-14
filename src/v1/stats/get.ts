import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "$/lib/prisma";

const params = z.object({
  limit: z.number().optional().default(10),
  cursor: z.number().optional(),
});

export async function get(req: Request, res: Response) {
  const { limit, cursor } = await params.parseAsync(req.body);

  const link = await prisma.link.findMany({
    take: limit,
    skip: 1, // skip the cursor
    cursor: {
      cursor,
    },
    orderBy: {
      cursor: "asc",
    },
  });

  res.json(link);
}
