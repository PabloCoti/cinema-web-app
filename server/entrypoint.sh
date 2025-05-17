#!/bin/sh
if [ "$NODE_ENV" = "local" ]; then
  npm install
fi

npm run start