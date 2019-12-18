FROM alpine:3.10.3

MAINTAINER joe@djeebus.net

RUN apk add --update nodejs npm

ADD package*.json /src/
RUN cd /src/ && npm install

ADD . /src/

WORKDIR /src
