import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import assertArrays from 'chai-arrays';
import { createId } from '@paralleldrive/cuid2';
import { Link } from '@prisma/client';

import { app } from '$/index';
import { prisma } from '$/lib/prisma';

chai.use(chaiHttp);
chai.use(assertArrays);

describe('[GET] /:slug', async function () {
  let link: Link;

  beforeEach(async () => {
    const slug = createId();
    link = await prisma.link.create({
      data: {
        slug,
        original: 'https://redhotchilipeppers.com/',
        shortened: `http://localhost:9090/${slug}`,
      },
    });

    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.$transaction([prisma.link.deleteMany()]);

    await prisma.$disconnect();
  });

  it('redirects to the original url', async function () {
    const { redirects } = await chai.request(app).get(`/${link.slug}`).send();

    expect(redirects[0]).to.be.equal(link.original);
  });

  it('increments redirect count', async function () {
    expect(link.redirects).to.be.equal(0);
    await chai.request(app).get(`/${link.slug}`).send();

    const { redirects } = await prisma.link.findUniqueOrThrow({
      where: { slug: link.slug },
    });

    expect(redirects).to.be.equal(1);
  });

  it('returns 404 if the slug doesnt exist', async function () {
    const { status } = await chai.request(app).get('/nonexistentslug').send();

    expect(status).to.be.equal(404);
  });
});
