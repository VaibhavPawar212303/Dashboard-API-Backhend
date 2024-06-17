# Build stage
FROM node:18 AS build

WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY config /app/config
COPY Controller /app/Controller
COPY routes /app/routes
COPY .env /app
COPY ./package.json /app
COPY ./package-lock.json /app
COPY server.js /app

# Install dependencies
RUN yarn install 

EXPOSE 8084

CMD [ "npm" , "run","server"]