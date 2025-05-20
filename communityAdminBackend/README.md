# Sydney Community Admin Portal 
## NodeJS Backend

### All the admin accessible APIs are restructed over here.
### Important Coding Tips
- APIs are built into typescript/tslint linters.
- API controllers goes into "api" folder under "controllers" sub folders for each feature folder.
- Shared libraries goes into "libs folder.
- Any mockable classes should be on seperate mocks folder under each feature folder.

### Frameworks used for this application
- express/microframework-w3tec - for running nodejs based web server and setup express application.
- routing-controllers - to setup typescript based express route controllers
- typedi - for typescript dependency injection
- jest - for running unit tests


### Application Usage

- Serve:
  ```shell
  npm start
  ```
  - Serve specific env (ex: sit1): npm start --env=sit --httpPort=8080 --httpsPort=8443
- Test:
  ```shell
  npm test
  ```
  - add --debug flag to run in "watch" mode
  - Run just one file --file=filenamewithoutextension

- Build:
  ```shell
  npm start build
  ```
- Generate swagger (change the api DOCs based on the controllers):
  ```shell
  npm run swagger
  ```
    Then load the http://localhost:8082/api-docs

### Endpoints
- apiInfo file consists of two paths - securePath and contextPath
- securePath - used to map secure endpoints
- contextpath - Used to map all public endpoints
- securePath are protected
