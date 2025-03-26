ARG NODE_VERSION
FROM node:${NODE_VERSION} AS base

RUN apt-get update \
    && apt-get install imagemagick

RUN mkdir /app \
  && chown -R node:node /app

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -yq chromium \
    && apt-get install -yq jq nano bash-completion \
    && apt-get install -yq openssl \
    && apt-get install -yq gettext \
    && npm completion > /etc/bash_completion.d/npm

ARG NPM_VERSION
ARG NX_VERSION
ARG NG_VERSION
ARG NESTJS_VERSION
RUN npm install -g "npm@^${NPM_VERSION}" \
    && npm install -g "nx@^${NX_VERSION}" "@angular/cli@^${NG_VERSION}" "@nestjs/cli@^${NESTJS_VERSION}"

WORKDIR /app

##
FROM base AS dockershell

USER 1000

##
FROM base AS devcontainer

USER 1000

## Default fallback
FROM dockershell
