import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import assertArrays from 'chai-arrays';
import { Link } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

import { app } from '$/index';
import { prisma } from '$/lib/prisma';

chai.use(chaiHttp);
chai.use(assertArrays);

describe('[PATCH] /api/v1/shorten', async function () {
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

  it('returns 200 with data in the correct shape when give a valid payload', async function () {
    const url = 'https://53thieves.com/';
    const { status, body } = await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ slug: link.slug, url });

    expect(status).to.be.equal(200);

    expect(body.id).to.be.equal(link.id);
    expect(body.slug).to.be.equal(link.slug);
    expect(body.original).to.be.equal(url);
    expect(body.shortened).to.be.equal(link.shortened);
    expect(body.redirects).to.be.equal(0);
    expect(body.cursor).to.be.equal(link.cursor);

    const datetimeRegex =
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    expect(datetimeRegex.test(body.createdAt)).to.be.true;
    expect(datetimeRegex.test(body.updatedAt)).to.be.true;
  });

  it('returns 200 when give a valid https url', async function () {
    const url = 'https://53thieves.com/';
    const { status } = await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ slug: link.slug, url });

    expect(status).to.be.equal(200);
  });

  it('returns 200 when give a valid http url', async function () {
    const url = 'http://53thieves.com/';
    const { status } = await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ slug: link.slug, url });

    expect(status).to.be.equal(200);
  });

  it('returns 400 BadRequest in the correct shape', async function () {
    const { status, body } = await await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send();

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(2);

    // make sure the items in the array have the correct keys
    expect(body[0].code).to.be.a('string');
    expect(body[0].message).to.be.a('string');
    expect(body[0].path).to.be.array();
    expect(body[0].path).to.be.ofSize(1);
    expect(body[0].path[0]).to.be.a('string');
  });

  it('returns 400 BadRequest when given unrecognized data', async function () {
    const { status, body } = await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ slug: link.slug, url: 'https://53thieves.com/', redirects: 53 });

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);
  });

  it('returns 400 BadRequest when given a bad url', async function () {
    const { status, body } = await chai
      .request(app)
      .patch(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ slug: link.slug, url: 'htp://53thieves.com/' });

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);
  });
});
