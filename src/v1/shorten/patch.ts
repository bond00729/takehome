import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

const schema = z
  .object({
    slug: z.string().cuid(),
    url: z.string().url(),
  })
  .strict();

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
