# Use an official Node.js runtime as the base image
FROM quay-nonprod.elevancehealth.com/cbhm/ubi8-nodejs-minimal:nodejs-18 AS build_image
ARG ENV

# Change user to root
USER root

# Set the working directory in the Docker image
WORKDIR /codebase

# Copy required files to the Docker image
COPY . .

# Install the application dependencies in the Docker image
RUN npm install yarn -g

# RUN yarn install ## --production
RUN yarn install

# Build the application in the Docker image
RUN env=${ENV} yarn build

# Remove development dependencies from the Docker image
RUN npm prune --omit=dev --force

# Build the final image
FROM quay-nonprod.elevancehealth.com/cbhm/ubi8-nodejs-minimal:nodejs-18
ARG ENV
ARG currusr

RUN currusr=$whoami
USER $currusr

WORKDIR /usr/src/app

# Install PM2
RUN npm install pm2 -g

COPY --from=build_image /codebase/dist ./dist
COPY --from=build_image /codebase/node_modules ./node_modules
COPY src/certs/ ./dist/certs
RUN chmod 755 /usr/src/app/dist/certs/wellpointinternalca-bundle.pem
ENV NODE_EXTRA_CA_CERTS=/usr/src/app/dist/certs/wellpointinternalca-bundle.pem
RUN chmod +x ./dist/docker-entrypoint.sh

# Expose port 3000 in the Docker image
EXPOSE 3000 443

# Define the command to run the application using PM2
ENTRYPOINT [ "/usr/src/app/dist/docker-entrypoint.sh" ]

# local docker usage
# docker build --build-arg ENV="dev1" -t carelon-mobile-api . 
# docker run -p 3000:3000 -e NODE_ENV=dev1 -t carelon-mobile-api

# For Quay
# docker build --build-arg ENV="dev1" -t quay-nonprod.elevancehealth.com/cbhm/carelon-mobile-api:<version tag> .
# docker run -p 3000:3000 -e NODE_ENV=dev1 -t quay-nonprod.elevancehealth.com/cbhm/carelon-mobile-api:<version tag>