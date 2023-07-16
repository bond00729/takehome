import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import assertArrays from 'chai-arrays';
import { createId } from '@paralleldrive/cuid2';

import { app } from '$/index';
import { prisma } from '$/lib/prisma';

chai.use(chaiHttp);
chai.use(assertArrays);

describe('[GET] /v1/stats', async function () {
  const slug1 = createId(),
    slug2 = createId(),
    slug3 = createId();

  const original1 = 'https://redhotchilipeppers.com/',
    original2 = 'https://53thieves.com/',
    original3 = 'https://www.lordhuron.com/#/';

  const shortened1 = `http://localhost:9090/${slug1}`,
    shortened2 = `http://localhost:9090/${slug2}`,
    shortened3 = `http://localhost:9090/${slug3}`;

  beforeEach(async () => {
    await prisma.link.createMany({
      data: [
        {
          slug: slug1,
          original: original1,
          shortened: shortened1,
        },
        {
          slug: slug2,
          original: original2,
          shortened: shortened2,
        },
        {
          slug: slug3,
          original: original3,
          shortened: shortened3,
        },
      ],
    });

    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.$transaction([prisma.link.deleteMany()]);

    await prisma.$disconnect();
  });

  it('returns 200 with data in the correct shape', async function () {
    const { status, body } = await chai
      .request(app)
      .get('/api/v1/stats')
      .send();

    expect(status).to.be.equal(200);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(3);

    // make sure the items in the array have the correct keys
    expect(body[0].id).to.be.a('string');
    expect(body[0].slug).to.be.equal(slug1);
    expect(body[0].original).to.be.equal(original1);
    expect(body[0].shortened).to.be.equal(shortened1);
    expect(body[0].redirects).to.be.a('number');
    expect(body[0].cursor).to.be.a('number');
    expect(body[0].createdAt).to.be.a('string');
    expect(body[0].updatedAt).to.be.a('string');
  });

  it('returns 200 with a limited result set', async function () {
    const limit = 2;
    const { status, body } = await chai
      .request(app)
      .get(`/api/v1/stats?limit=${limit}`)
      .send();

    expect(status).to.be.equal(200);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(limit);
  });

  it('return 200 and properly paginates using the cursor', async function () {
    const limit = 1;
    const res = await chai
      .request(app)
      .get(`/api/v1/stats?limit=${limit}`)
      .send();

    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.array();
    expect(res.body).to.be.ofSize(limit);

    const res2 = await chai
      .request(app)
      .get(`/api/v1/stats?limit=${limit}&cursor=${res.body[0].cursor}`)
      .send();

    expect(res2.status).to.be.equal(200);
    expect(res2.body).to.be.array();
    expect(res2.body).to.be.ofSize(limit);

    const res3 = await chai
      .request(app)
      .get(`/api/v1/stats?limit=${limit}&cursor=${res2.body[0].cursor}`)
      .send();

    expect(res3.status).to.be.equal(200);
    expect(res3.body).to.be.array();
    expect(res3.body).to.be.ofSize(limit);

    const res4 = await chai
      .request(app)
      .get(`/api/v1/stats?limit=${limit}&cursor=${res3.body[0].cursor}`)
      .send();

    expect(res4.status).to.be.equal(200);
    expect(res4.body).to.be.array();
    expect(res4.body).to.be.ofSize(0); // only had 3 items to paginate through
  });

  it('returns 400 BadRequest in the correct shape', async function () {
    const { status, body } = await chai
      .request(app)
      .get(`/api/v1/stats?limit=test`)
      .send();

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);

    // make sure the items in the array have the correct keys
    expect(body[0].code).to.be.a('string');
    expect(body[0].message).to.be.a('string');
    expect(body[0].path).to.be.array();
    expect(body[0].path).to.be.ofSize(1);
    expect(body[0].path[0]).to.be.a('string');
  });

  it('returns 400 BadRequest when given unrecognized query params', async function () {
    const { status, body } = await chai
      .request(app)
      .get(`/api/v1/stats?test=test`)
      .send();

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);
  });

  it('returns 400 BadRequest when given incorrect query params', async function () {
    const { status, body } = await chai
      .request(app)
      .get(`/api/v1/stats?limit=test&cursor=test`)
      .send();

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(2);
  });
});
