# Create the node stage with the name "builder"
FROM quay.apps.lz-np2.ent-ocp4-useast1.aws.internal.das/openshift-base-images/ngnix-image-with-certs:latest AS builder
# Set the working directory
WORKDIR /codebase
# Copy files from dist folder to working directory
COPY /dist /codebase/dist

# Create the nginx stage for serving content
FROM quay.apps.lz-np2.ent-ocp4-useast1.aws.internal.das/openshift-base-images/ngnix-image-with-certs:latest
# Copy Static assets from builder stage
COPY --from=builder --chown=nginx:nginx /codebase/dist/community-admin-web  /usr/share/nginx/html
# Comment the below line when building docker in local
COPY default.conf /etc/nginx/conf.d/
#***********************************************************************#
# Run below commands for time being, will improvise it in future.

# Use build-dev for DEV
# Use build-sit for SIT
# Use build-uat for UAT
# Use build-perf for PERF
# Use build-prod for PROD
# Use build-dr for DR (Disaster Recovery)
#***********************************************************************#

# rm -rf node_modules dist package-lock.json
# npm install && npm run build-prod
# docker build -t community-admin-web .
# docker run --rm -it -p 4200:80 community-admin-web

#***********************************************************************#
#***********************************************************************#