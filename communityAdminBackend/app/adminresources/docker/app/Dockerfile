# Stage 1: Dockerfile build.
FROM quay.apps.lz-np2.ent-ocp4-useast1.aws.internal.das/openshift-base-images/ubi8-nodejs18-image-with-certs AS BUILD_IMAGE
ARG API
ARG ENV

# Change user to root
RUN currusr=$whoami
USER root

WORKDIR /codebase

# Copy the certificates.
COPY /certs /usr/local/share/ca-certificates/

RUN update-ca-trust extract && ls -la /etc/pki/ca-trust/source/anchors/.
RUN yum -y install gcc-c++ gcc make
RUN yum -y install python3

COPY  . /codebase

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/wellpointinternalca-bundle.pem

RUN npm install
RUN npm install pm2 --save
RUN ./node_modules/.bin/pm2 install typescript

RUN npm rebuild bcrypt --build-from-source
RUN npm start build --env=${ENV} --api=${API}
RUN npm prune --production

# Stage 2: Dockerfile build.
FROM quay.apps.lz-np2.ent-ocp4-useast1.aws.internal.das/openshift-base-images/ubi8-nodejs18-image-with-certs
ARG API
WORKDIR /usr/src/app
COPY --from=BUILD_IMAGE /codebase/dist ./
COPY --from=BUILD_IMAGE /codebase/node_modules ./node_modules

# Change the user to no-root user
USER $currusr

# EXPOSE ${HTTP_PORT} ${HTTPS_PORT}
EXPOSE 8082 443

# Change the header size value
ENV NODE_OPTIONS=--max-http-header-size=80000

# Env passed over the build arg.
ENV API=$API

ENTRYPOINT [ "/usr/src/app/docker-entrypoint.sh" ]
HEALTHCHECK --interval=1m1s CMD node /usr/src/app/healthCheck.js

LABEL maintainer "dl-SydneyCommunityDevops@anthem.com"
LABEL applicationname "Sydney Community Admin API"
LABEL emaildistribution "dl-SydneyCommunityDevops@anthem.com"
# LABEL costcenter ""
# LABEL apm ""
# LABEL applicationid ""

# local docker usage
# change docker-entrypoint.sh to remove ">> /logs/$APP_NAME.$host.log 2>&1".
# otherwise docker run fails. this section is meant only for actual docker setup which uses mounted /log folder
# docker build --build-arg API="adminresources" -f ./app/adminresources/docker/app/Dockerfile -t admin_api .
# docker run -p 80:3000 -p 443:443 -e NODE_ENV=sit -e APP_NAME="adminresources" -t admin_api
# use node arg --trace-warnings in process.yml to see warning errors for "Accessing non-existent property '__required__' of module exports inside circular dependency"

# Following is the updated commands for building and running the docker
# docker build --build-arg API="adminresources" --build-arg ENV="sit" -f ./app/adminresources/docker/app/Dockerfile -t admin_api .
# docker run -p 3000:8082 -p 443:443 -e NODE_ENV=sit -e APP_NAME="adminresources" -t admin_api
