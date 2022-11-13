FROM node:18-alpine AS deps

WORKDIR /app

COPY ./client .

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE 3000

CMD yarn start