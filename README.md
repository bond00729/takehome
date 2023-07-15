# Backend Takehome Assessment

This repo contains the completed code for the takehome assessment.

## Prerequisites

- [Node 18](https://nodejs.org/en/download)
- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/engine/install/)

## Dev Setup

1. install dependencies

```
pnpm i
```

2. start the dev server on port `8080`

```
pnpm dev
```

or on a specific port

```
PORT=8081 pnpm dev
```

this will start the dev server in watch mode so changes to the source code are automatically applied to the running dev server.

3. write some code!

## Tests

There are two kinds of tests in this repo, integration tests and load tests. They can be run as followed:

**Integration tests:**

```
pnpm test
```

**Load tests:**

```
pnpm test:load
```

## Running the API via docker-compose

To build/start the api server and associated database run:

```
pnpm start
```

_Note: if you don't want to install `pnpm`, you can use `npm` but will need to update the `start` command in `package.json` to use `npm` instead of `pnpm`_

Once running, the available API routes are as followed:

- `POST - http://localhost:8080/api/v1/shorten`

```json
body:
{
  "url": "https://redhotchilipeppers.com/"
}

response:
"clk34xqxs0001q0010eh45ioh"
```

- `PATCH - http://localhost:8080/api/v1/shorten`

```json
body:
{
  "slug": "clk34xqxs0001q0010eh45ioh",
  "url": "https://www.53thieves.com/"
}

response:
{
  "slug": "clk34xqxs0001q0010eh45ioh",
  "original": "https://www.53thieves.com/",
  "redirects": 0,
  "createdAt": "2023-07-14T22:13:04.287Z",
  "updatedAt": "2023-07-14T22:13:04.287Z"
}
```

- `GET - http://localhost:8080/api/v1/stats`

```json
optional query params:
- limit: number (default = 10)
- cursor: number (used for pagination)

response:
[
  {
      "id": "clk34xqxs0000q001h57gt0ba",
      "slug": "clk34xqxs0001q0010eh45ioh",
      "original": "https://www.53thieves.com/",
      "redirects": 0,
      "cursor": 1,
      "createdAt": "2023-07-14T22:13:04.287Z",
      "updatedAt": "2023-07-14T22:13:04.287Z"
  }
]
```

- `GET - http://localhost:8080/:slug`

If the slug has a corresponding original url, a `302 - Temporary redirect` is returned. Otherwise, a `404 - Not found` is returned.
