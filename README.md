# NextJS + TRPC server template

The template for full-stack apps

## What's inside?

[Turborepo](https://github.com/vercel/turborepo) helps to work with multiple apps simultaneously

The template consists of two parts: server and client. Core technologies in it:

### On the Server

- [Fastify](https://github.com/fastify/fastify): Backend framework
- [Prisma](https://github.com/prisma/prisma): Database ORM

### On the Client

- [NextJS](https://github.com/vercel/next.js): React SSR Framework
- [React Hook Form](https://github.com/react-hook-form/react-hook-form): It makes easier to work with forms
- [React Query](https://github.com/tannerlinsley/react-query): Fetching, caching and updating data

### On both

- [Zod](https://github.com/colinhacks/zod): Validation
- [TRPC](https://github.com/colinhacks/zod): Type safe RPC client

Each app is 100% [TypeScript](https://www.typescriptlang.org/)

Additional implemented features:

- WebSockets
- Authorization

## Quick start

Clone this repo, install all dependencies, and create `.env`

```
git clone git@github.com:Firebain/nextjs-trpc-template.git
cd nextjs-trpc-template
yarn install
cp apps/server/.env.example apps/server/.env
```

Set `DATABASE_URL` value in `.env`

Build package dependencies

```
yarn deps
```

Migrate tables to database

```
yarn push
```

Run the project for developing

```
yarn dev
```

Or build entire project and run it in production mode

```
yarn start
```

## Should I use it?

It's up to you. I built it for my personal use because I was tired of copy-pasting code from my old projects again and again.
There are no tests or guarantees that the code works. Use it at your own risk.