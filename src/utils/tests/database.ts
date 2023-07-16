import { createId } from '@paralleldrive/cuid2';

import { prisma } from '$/lib/prisma';

export async function truncate() {
  await prisma.$transaction([prisma.link.deleteMany()]);

  await prisma.$disconnect();
}

export async function seed() {
  const slug1 = createId();
  const slug2 = createId();
  const slug3 = createId();

  await prisma.link.createMany({
    data: [
      {
        slug: slug1,
        original: 'https://redhotchilipeppers.com/',
        shortened: `http://localhost:9090/${slug1}`,
      },
      {
        slug: slug2,
        original: 'https://53theives.com/',
        shortened: `http://localhost:9090/${slug2}`,
      },
      {
        slug: slug3,
        original: 'https://www.lordhuron.com/#/',
        shortened: `http://localhost:9090/${slug3}`,
      },
    ],
  });

  await prisma.$disconnect();
}
