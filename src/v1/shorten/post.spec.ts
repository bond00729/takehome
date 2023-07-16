import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import assertArrays from 'chai-arrays';

import { app } from '$/index';
import { prisma } from '$/lib/prisma';

chai.use(chaiHttp);
chai.use(assertArrays);

describe('[POST] /api/v1/shorten', async function () {
  afterEach(async () => {
    await prisma.$transaction([prisma.link.deleteMany()]);

    await prisma.$disconnect();
  });

  it('returns 200 with data in the correct shape when give a valid url', async function () {
    const url = 'https://redhotchilipeppers.com/';
    const { status, body } = await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ url });

    expect(status).to.be.equal(200);

    expect(body.id).to.be.a('string');
    expect(body.slug).to.be.a('string');
    expect(body.original).to.be.equal(url);
    expect(body.shortened).to.be.a('string');
    expect(body.redirects).to.be.a('number');
    expect(body.cursor).to.be.a('number');
    expect(body.createdAt).to.be.a('string');
    expect(body.updatedAt).to.be.a('string');
  });

  it('returns 200 when give a valid https url', async function () {
    const url = 'https://redhotchilipeppers.com/';
    const { status } = await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ url });

    expect(status).to.be.equal(200);
  });

  it('returns 200 when give a valid http url', async function () {
    const url = 'http://redhotchilipeppers.com/';
    const { status } = await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ url });

    expect(status).to.be.equal(200);
  });

  it('returns 400 BadRequest in the correct shape', async function () {
    const { status, body } = await await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
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

  it('returns 400 BadRequest when given unrecognized data', async function () {
    const { status, body } = await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ url: 'https://53thieves.com/', redirects: 53 });

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);
  });

  it('returns 400 BadRequest when given a bad url', async function () {
    const { status, body } = await chai
      .request(app)
      .post(`/api/v1/shorten`)
      .set('content-type', 'application/json')
      .send({ url: 'htp://53thieves.com/' });

    expect(status).to.be.equal(400);
    expect(body).to.be.array();
    expect(body).to.be.ofSize(1);
  });
});
