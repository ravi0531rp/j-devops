FROM node:14-apline

WORKDIR /usr/app

# This copy is before in order to reduce the building again & again for even minor changes in code
COPY ./package.json ./
RUN npm install

COPY ./ ./

CMD ["npm", "start"]