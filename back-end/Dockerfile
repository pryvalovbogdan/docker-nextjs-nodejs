FROM node:18-alpine

WORKDIR /back-end

COPY package.json yarn.lock ./
RUN yarn install

COPY .. .

EXPOSE 3000

CMD ["yarn", "dev"]
