# Carelon Behaviour Health - APIs

## Prerequisites

- node > v18+
- npm > v9+
- yarn: 1.22+ (or npm is sufficient)

### Quick Links:

- [TypeScript](https://confluence.elevancehealth.com/display/AKCP/TypeScript+Coding+Standards)
- [NodeJS](https://confluence.elevancehealth.com/display/NKCP/NodeJS-Express+REST+API+coding+standards)
- [JavaScript](https://confluence.elevancehealth.com/display/AKCP/Javascript+standards)

## Frameworks used for this application

- express - for running nodejs based web server and setup express application.
- routing-controllers - to setup typescript based express route controllers
- jest - for running unit tests
- DynamoDb DAL services is used for Database Access.
- Docker for application orchestration and deployments.

## Getting Started with the Application

- To get started clone the project repo.
- Install the package using npm/yarn.

## Frequently Used Commands

- Setup: Connect with dev team for the local .env file and keep it at the application `root`.

```bash
  npm install
  # OR
  yarn install
```

- Serve: (locally)

```bash
# using npm
npm run dev --env=dev1

# OR using Yarn
env=dev1 yarn dev
```

- Test: On successfull execution of the test scripts it will generate the coverage report.

```bash
  npm run test
  #OR
  yarn run test
```

- Build:

```bash
npm run build --env=dev1
#OR
env=dev1 yarn build
```

### Pending Work

- Generate swagger API docs with Open API v3
