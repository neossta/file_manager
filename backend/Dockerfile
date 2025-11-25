FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p files

EXPOSE 8000

CMD ["npm", "start"]