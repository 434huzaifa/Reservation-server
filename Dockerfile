FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
    
COPY public ./public

COPY src/fonts ./dist/fonts

COPY tsconfig.json ./

RUN npm run build

EXPOSE 3030

RUN rm -rf src

CMD ["node", "dist/index.js"]