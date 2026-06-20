FROM node:22-alpine

WORKDIR /app

COPY apps/system-a-web/package.json ./
RUN npm install

COPY apps/system-a-web ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
