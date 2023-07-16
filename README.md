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
Integration tests for each api route are alongside the implementation (\*.spec.ts)

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

Once running, the API documentation can be found at `http://localhost:8080/api/v1/docs`
