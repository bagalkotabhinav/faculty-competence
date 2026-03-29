FROM node:20-alpine
WORKDIR /client
COPY package.json package-lock.json ./
RUN npm i
COPY . .
EXPOSE 8080
CMD ["npm", "start"]