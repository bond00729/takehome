import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "$/lib/prisma";

const schema = z.object({
  url: z.string().url(),
});

export async function post(req: Request, res: Response) {
  const { url } = await schema.parseAsync(req.body);

  const { slug } = await prisma.link.create({
    data: {
      original: url,
    },
    select: {
      slug: true,
    },
  });

  res.json(slug);
}
