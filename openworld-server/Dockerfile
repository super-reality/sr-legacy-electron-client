FROM node:12
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
USER node
CMD ["npm", "run", "start"]
