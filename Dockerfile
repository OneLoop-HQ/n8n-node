FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install --global @n8n/node-cli

COPY . .

RUN npm run build

EXPOSE 5678

CMD [ "npm", "run", "dev" ]

