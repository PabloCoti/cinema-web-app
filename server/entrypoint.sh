#!/bin/sh
if [ "$NODE_ENV" = "local" ]; then
  npm install
fi

# npm run rollback
# npm run migrate
# npm run seed
npm run start