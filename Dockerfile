FROM node:9.3.0

MAINTAINER Shane Jeffery <shane.jeffery@compli.com>

RUN npm i -g grpc-php pm2

COPY configs /etc/grpc-php
RUN mkdir /etc/grpc-php/services /var/log/grpc-php

VOLUME /var/log/grpc-php
VOLUME /etc/grpc-php/services

EXPOSE 50051

CMD ["pm2-docker", "/etc/grpc-php/pm2.yml"]