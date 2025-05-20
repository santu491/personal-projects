FROM quay-nonprod.elevancehealth.com/openshift-base-images/ubi8-nodejs18-image-with-certs AS BUILD_IMAGE
ARG API
ARG ENV

# Change user to root
RUN currusr=$whoami
USER root

COPY /certs /usr/local/share/ca-certificates/
#RUN update-ca-trust extract && ls -la /etc/pki/ca-trust/source/anchors/.
# Install python to support bcrypt
#install python to support bcrypt
WORKDIR /codebase

COPY certs/anthem-root-chain.crt /codebase
COPY certs/anthem-root-chain.crt /etc/pki/ca-trust/source/anchors/.
RUN update-ca-trust extract && ls -la /etc/pki/ca-trust/source/anchors/.
RUN yum -y install gcc-c++ gcc make
RUN yum -y install python3
#RUN yum  python3


# COPY package.json /codebase
# COPY package-lock.json /codebase
# COPY /tools /codebase/tools
COPY  . /codebase

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/wellpointinternalca-bundle.pem

RUN npm install --legacy-peer-deps
RUN npm install pm2 --save --force
RUN ./node_modules/.bin/pm2 install typescript

RUN npm rebuild bcrypt
# RUN npm start test --api=$API
RUN npm start build --env=${ENV} --api=${API}
RUN npm prune --production --force

FROM quay-nonprod.elevancehealth.com/openshift-base-images/ubi8-nodejs18-image-with-certs

USER $currusr

ARG API
WORKDIR /usr/src/app
COPY --from=BUILD_IMAGE /codebase/dist ./
COPY --from=BUILD_IMAGE /codebase/node_modules ./node_modules

# EXPOSE ${HTTP_PORT} ${HTTPS_PORT}
EXPOSE 8082 443
ENV NODE_OPTIONS=--max-http-header-size=80000
ENV API=$API
# RUN chmod +x docker-entrypoint.sh
ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
HEALTHCHECK --interval=1m1s CMD node /usr/src/app/healthCheck.js
LABEL maintainer "dl-SydneyCommunityDevops@anthem.com"
LABEL applicationname "Sydney Community API V2"
LABEL costcenter "6216501000"
LABEL emaildistribution "dl-SydneyCommunityDevops@anthem.com"
LABEL apm "APM1007923"
LABEL applicationid "APM1007923"

# local docker usage
# change docker-entrypoint.sh to remove ">> /logs/$APP_NAME.$host.log 2>&1".
# otherwise docker run fails. this section is meant only for actual docker setup which uses mounted /log folder
# docker build --build-arg API="communityresources" -f ./app/communityresources/docker/app/Dockerfile -t community_api .
# docker run -p 80:3000 -p 443:443 -e NODE_ENV=sit -e APP_NAME=communityresources -t community_api
# use node arg --trace-warnings in process.yml to see warning errors for "Accessing non-existent property '__required__' of module exports inside circular dependency"
# Following is the updated commands for building and running the docker
# docker build --build-arg API="communityresources" --build-arg ENV="sit" -f ./app/communityresources/docker/app/Dockerfile -t community_api .
# docker run -p 3000:8082 -p 443:443 -e NODE_ENV=sit -e APP_NAME="communityresources" -t community_api
