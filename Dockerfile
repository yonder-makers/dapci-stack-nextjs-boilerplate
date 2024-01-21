FROM node:latest as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci
COPY . /app/

RUN npm run build

FROM node:latest as production-stage

WORKDIR /app

COPY --from=build-stage /app/node_modules /app/node_modules
COPY ./package*.json /app/
COPY --from=build-stage /app/.next /app/.next

COPY ./prisma /app/prisma
COPY ./public /app/public
COPY ./start.sh /app/start.sh

RUN mkdir /app/public/avatars
RUN mkdir /app/_temp-upload

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "start.sh"]