#!/usr/bin/env bash
source <(dotenv-export | sed 's/\\n/\n/g')
yarn run docs:update
http-server docs/dist/ -p 8000
