# Communities Node API

## Tips
#### Important Coding Tips
- most are built into typescript/tslint linters.
- api controllers goes into "api" folder under "controllers" sub folders for each feature folder. ex: api/demo/controllers/demoController.ts
- shared libraries goes into "libs folder.
- any mockable classes should be on seperate mocks folder under each feature folder. ex: api//demo/mocks/mockHttpClient.ts, libs/filters/mocks/mockAuditFilter.ts
- unit test example on covering how to mock classes and test controllers is covered in api/demo/controllers/demoController.spec.ts

#### Frameworks used for this application
- express/microframework-w3tec - for running nodejs based web server and setup express application.
- routing-controllers - to setup typescript based express route controllers
- typedi - for typescript dependency injection
- jest - for running unit tests

### Running the APP in local
  - To run the app locally without having AWS SAML set up, make sure that you update the [config.local.json](https://bitbucket.anthem.com/projects/CCX/repos/communitiesapiv2/browse/app/communityresources/config/config.local.json?at=refs%2Fheads%2Ffeature%2FCCX-6460-aws-secret-config) file.
 * Get the config from Database
   ```javascript
    db.getCollection('AppConfig').find({project: "communitiesV2", env: "<env>"})
   ```
      Copy-Past the _configDetails_ into the local config file.
#### Frequently Used Commands
- Serve:
  ```shell
  npm start --islocal=true --env=local
  ```
  - Serve specific env (ex: sit1): npm start --env=sit --httpPort=8080 --httpsPort=8443
- Test:
  ```shell
  npm run test
  ```
  - add --debug flag to run in "watch" mode
  - Run just one file --file=filenamewithoutextension

- Build:
  ```shell
  npm start build --islocal=true --env=sit
  ```
- Generate swagger (change the api DOCs based on the controllers):
  ```shell
  npm run swagger --env=dev
  ```
    Then load the http://localhost:8082/api-docs

####  Password/Secret fields in config files
- Plain text should not be stored in file. Encrypted text stored and decrypted before send it across.
- In future, if we want to encrypt any plain text or change in keys, generate encrypted text locally by using encrypt method and update it.

#### Endpoints
- apiInfo file consists of two paths - securePath and contextPath
- securePath - used to map secure endpoints
- contextpath - Used to map all public endpoints
- securePath are protected
  - Non-prod environment with Bearer authentication with value anthem ( later we can change this to local build only )
  - Prod environment protected with Access token and ID token
