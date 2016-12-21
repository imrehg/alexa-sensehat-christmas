FROM resin/raspberrypi3-node:6

WORKDIR /usr/src/app
ENV INITSYSTEM on

COPY package.json ./
RUN JOBS=MAX npm i --unsafe-perm --production && npm cache clean

CMD while : ; do echo "idling"; sleep 10; done
