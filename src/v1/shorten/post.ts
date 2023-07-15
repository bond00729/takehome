import { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "../../lib/prisma";

const schema = z
  .object({
    url: z.string().url(),
  })
  .strict();

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

  // TODO: should protocol + host be an env var?
  res.json(`http://localhost:${process.env.PORT || 8080}/${slug}`);
}
