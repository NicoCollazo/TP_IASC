FROM node:slim

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
EXPOSE 8081

CMD [ "npm", "start" ]