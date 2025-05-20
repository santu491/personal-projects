#!/bin/sh
export ENV=$NODE_ENV
export NODE_ENV=sit
export host=$(hostname)

export COLLECTOR_AGENT_HOST=localhost
export COLLECTOR_AGENT_PORT=5005
export CA_APM_HOSTNAME="Community-API-$ENV"
export CA_APM_PROBENAME=$API

# uncomment below line to test docker locally
mkdir /logs
echo "docker starting with API=$API HTTP_PORT=$HTTP_PORT HTTPS_PORT=$HTTPS_PORT ENV=$ENV NODE_ENV=$NODE_ENV HOST=$host COLLECTOR_AGENT_HOST=$COLLECTOR_AGENT_HOST COLLECTOR_AGENT_PORT=$COLLECTOR_AGENT_PORT CA_APM_HOSTNAME=$CA_APM_HOSTNAME CA_APM_PROBENAME=$CA_APM_PROBENAME"
# echo "docker starting with API=$API HTTP_PORT=$HTTP_PORT HTTPS_PORT=$HTTPS_PORT ENV=$ENV NODE_ENV=$NODE_ENV HOST=$host COLLECTOR_AGENT_HOST=$COLLECTOR_AGENT_HOST COLLECTOR_AGENT_PORT=$COLLECTOR_AGENT_PORT CA_APM_HOSTNAME=$CA_APM_HOSTNAME CA_APM_PROBENAME=$CA_APM_PROBENAME" >> /logs/$APP_NAME.$host.log
# node --print 'process.env' >> /logs/$APP_NAME.$host.log

containerId=$(sed -rn '1s#.*/##; 1s/(.{12}).*/\1/p' /proc/self/cgroup)
node_modules/.bin/pm2-runtime process.yml --only communityresources -- --app=communityresources --api=$API --env=$ENV --cid=$containerId
# >> /logs/$APP_NAME.$host.log 2>&1
