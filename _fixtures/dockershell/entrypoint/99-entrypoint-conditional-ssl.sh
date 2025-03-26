#!/bin/sh

set -e

if [ -f "/etc/nginx/certs/server.crt" ]; then
  mv /etc/nginx/conf.d/default-https.conf /etc/nginx/conf.d/default.conf
  rm /etc/nginx/conf.d/default-http.conf
else
  mv /etc/nginx/conf.d/default-http.conf /etc/nginx/conf.d/default.conf
  rm /etc/nginx/conf.d/default-https.conf
fi

exec "$@"
