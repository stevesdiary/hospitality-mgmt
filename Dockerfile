FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads

ENV PORT=3360
EXPOSE 3360

CMD ["npm", "start"]
