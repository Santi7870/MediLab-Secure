FROM node:22-alpine

WORKDIR /app

COPY apps/system-b-web/package.json ./
RUN npm install

COPY apps/system-b-web ./

EXPOSE 5174

CMD ["npm", "run", "dev"]
