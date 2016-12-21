FROM resin/raspberrypi3-node:7.2.1-20161216

WORKDIR /usr/src/app
ENV INITSYSTEM on

COPY package.json ./
RUN JOBS=MAX npm i --unsafe-perm --production && npm cache clean

COPY . ./

CMD ["npm", "start"]
