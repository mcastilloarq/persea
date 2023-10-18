# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# production image
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 2010
COPY package*.json ./
RUN yarn install --production
CMD ["yarn", "start"]