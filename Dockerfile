#########
# Build #
#########
FROM node:18 as build
WORKDIR /app

RUN npm i -g pnpm@7.22.0
COPY pnpm-lock.yaml ./
RUN pnpm fetch

ADD . ./

RUN pnpm i --offline && pnpm db:generate && pnpm build && pnpm prune --prod

#######
# App #
#######
FROM node:18 as app
WORKDIR /app

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./

EXPOSE 8080
CMD [ "node", "./index.js" ]
