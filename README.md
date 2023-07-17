# Backend Takehome Assessment

This repo contains the completed code for the takehome assessment.

## Prerequisites

- [Node 18](https://nodejs.org/en/download)
- [PNPM](https://pnpm.io/installation)
  - _Note: you may use `npm` or `yarn` instead of `pnpm` to run the commands (except for `test:load`)._
- [Docker](https://docs.docker.com/engine/install/)

## Dev Setup

1. install dependencies

```
pnpm i
```

2. start the dev server (on port `8080`) in watch mode so changes to the source code are automatically applied to the running dev server.

```
pnpm dev
```

or on a specific port

```
PORT=8081 pnpm dev
```

3. write some code!

## Tests

_Note: must complete step one of "Dev Setup" before running the tests_

**Integration tests:**
Integration tests for each api route are alongside the implementation (`*.spec.ts`)

```
pnpm test
```

**Load tests:**
Load tests are run via `artillery` and requires `pnpm` to be installed on the host machine

```
pnpm test:load
```

There are currently two load test scenarios being run:

- create and update
- go to shortened link

A html report of the load test is saved to `/artillery`

## Running the API via `docker-compose`

To build/start the api server and associated database run:

```
pnpm start
```

Once running, the API documentation can be found at `http://localhost:8080/api/v1/docs`

## Assumptions

- The api does not require any authentication or authorization.
- Redirect count is not unique per viewer, just a total number of times the shortened url has been hit.

## Approaches

- Used cursor based pagination for `/api/v1/stats` instead of pages since it, in theory, could be over a large recordset.
