import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "$/lib/prisma";

const params = z.object({
  slug: z.string().cuid(),
});

export async function view(req: Request, res: Response) {
  const { slug } = await params.parseAsync(req.params);

  const link = await prisma.link.findUniqueOrThrow({
    where: { slug },
  });

  res.redirect(link.original);

  await prisma.link.update({
    where: { slug },
    data: { views: { increment: 1 } },
  });
}
