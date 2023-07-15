import { Request, Response } from 'express';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

const params = z
  .object({
    slug: z.string().cuid(),
  })
  .strict();

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
