#!/usr/bin/env sh
AUTH_TOKEN=`cat ~/.npmrc | grep -Ei 'artifactory\.elevancehealth\.com.+_authToken' | head -n1 | sed 's/[^=]*=\(.*\)/\1/'`
echo "
npmRegistries:
  https://artifactory.elevancehealth.com/artifactory/api/npm/sydmem-npm-public/:
    npmAlwaysAuth: true
    npmAuthToken: '$AUTH_TOKEN'
" > ./.yarnrc.carelon.yml
npx --yes --quiet merge-yaml-cli -i ./.yarnrc.yml ./.yarnrc.carelon.yml -o  ./.yarnrc.yml
rm -f ./.yarnrc.carelon.yml
