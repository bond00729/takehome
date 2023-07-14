import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "$/lib/prisma";

const schema = z.object({
  slug: z.string().cuid(),
  url: z.string().url(),
});

export async function patch(req: Request, res: Response) {
  const { slug, url: original } = await schema.parseAsync(req.body);

  const link = await prisma.link.update({
    where: {
      slug,
    },
    data: {
      original,
    },
    select: {
      slug: true,
      original: true,
      views: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.json(link);
}
