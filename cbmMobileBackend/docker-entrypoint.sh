#!/bin/sh
export ENV=$NODE_ENV

pm2-runtime start dist/index.js -- --env=$ENV
