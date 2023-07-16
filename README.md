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

_Note: must complete step one of dev setup before running the tests_

**Integration tests:**
Integration tests for each api route are alongside the implementation (`*.spec.ts`)

```
pnpm test
```

**Load tests:**
Load test are run via `artillery`

```
pnpm test:load
```

There are currently two load test scenarios being run:

- create and update
- go to shortened link

An html report of a load test is stored in `/artillery/reports`

## Running the API via docker-compose

To build/start the api server and associated database run:

```
pnpm start
```

Once running, the API documentation can be found at `http://localhost:8080/api/v1/docs`

## Assumptions

- The api does not require any authentication or authorization.

## Approaches

- Used cursor based pagination for `/api/v1/stats` instead of pages since it, in theory, could be over a large recordset.
