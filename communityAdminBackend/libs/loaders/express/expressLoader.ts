import { SWAGGER_API_DOCS } from '@anthem/communityadminapi/common';
import { APP, getApiArgument, getArgument, getControllerPaths, getMiddlewarePaths, getResolverPaths, getSwaggerPaths, RequestContext } from '@anthem/communityadminapi/utils';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import { GraphQLSchema } from 'graphql';
import * as helmet from 'helmet';
import * as http from 'http';
import * as https from 'https';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import * as nocache from 'nocache';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { buildSchema, NonEmptyArray } from 'type-graphql';
import Container from 'typedi';
import { getFilesFromGlobPaths, importClassesFromDirectories } from '../util/importClassesFromDirectories';
import { useExpressServer } from './server';

// eslint-disable-next-line complexity
export const expressLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined): Promise<void> => {
  if (settings) {
    /**
     * We create a new express server instance.
     * We could have also use useExpressServer here to attach controllers to an existing express instance.
     */
    const expressApp = express();

    expressApp.set('x-powered-by', false);
    expressApp.set('etag', false);
    expressApp.options('*', (req, res, next) => {
      next();
    });
    expressApp.use(cookieParser());
    if (APP.config.security.noCache) {
      expressApp.use(nocache());
    }

    if (APP.config.security.noSniff) {
      expressApp.use(helmet.noSniff());
    }

    if (APP.config.security.https) {
      expressApp.use(helmet.hsts());
    }

    if (APP.config.security.hidePoweredBy) {
      expressApp.use(helmet.hidePoweredBy());
    }

    if (APP.config.security.frameguardAction) {
      expressApp.use(
        helmet.frameguard({
          action: APP.config.security.frameguardAction
        })
      );
    }

    /*
    import * as session from 'express-session';
    expressApp.use(session({
            name: 'xsession',
            secret: APP.config.session.secret,
            saveUninitialized: true,
            resave: true,
            cookie: {
                secure: APP.config.session.secure,
                path: APP.config.session.path,
                httpOnly: APP.config.session.http
            }
        }));*/

    const apiArg = getApiArgument('api') ?? '';
    const apiRoot = apiArg.indexOf('legacy-') >= 0 ? apiArg.split('-').join('/') : apiArg;
    const pwd = process.env.PWD ? process.env.PWD : process.cwd();
    const controllers: string[] = [];
    const swaggers: string[] = [];
    APP.config.app.apiRoots.forEach((root) => {
      controllers.push(path.join(pwd, getControllerPaths(root, apiArg, getApiArgument('controller'))));
      if (root.indexOf('virtual') < 0 && APP.config.swagger.enable) {
        swaggers.push(getSwaggerPaths(root, apiArg));
      }
    });

    const graphqlRoute = `${APP.config.graphql.root}/${apiRoot}`;
    if (APP.config.swagger.enable) {
      const swaggerFiles = getFilesFromGlobPaths(swaggers);
      const swaggerDefs: { filePath: string; route: string }[] = [];
      swaggerFiles.forEach((file) => {
        swaggerDefs.push({
          filePath: path.join(pwd, `${file}`),
          route: `${graphqlRoute}/${file}`
        });
      });

      swaggerDefs.forEach((swagger) => {
        expressApp.route(swagger.route).get((req, res) => {
          return res.download(swagger.filePath);
        });
      });

      if (swaggerFiles.length) {
        expressApp.use(
          `${graphqlRoute}/swagger-docs`,
          swaggerUi.serve,
          swaggerUi.setup(undefined, {
            explorer: true,
            swaggerUrl: swaggerDefs[0].route,
            swaggerOptions: {
              'urls.primaryName': swaggerDefs[0].route.replace(path.basename(swaggerDefs[0].route), ''),
              urls: swaggerDefs.map((swagger) => ({
                name: path.basename(swagger.route),
                url: swagger.route
              }))
            }
          })
        );
      }
    }

    RequestContext.createNamespace();

    let graphqlSchema: GraphQLSchema;
    if (APP.config.graphql.enable) {
      const resolversPaths: string[] = [];
      APP.config.app.apiRoots.forEach((root) => {
        resolversPaths.push(path.join(pwd, getResolverPaths(root, apiArg)));
      });

      const resolvers = importClassesFromDirectories(resolversPaths);
      if (resolvers.length) {
        graphqlSchema = await buildSchema({
          resolvers: resolvers as NonEmptyArray<Function>,
          emitSchemaFile: true,
          container: Container
        });
      }
    }

    /**
     * The OpenAPI Specifications for all the NODE JS APIs.
     * Render the JSON file that contains the API specs of all the APIs in Swagger UI.
     * Generation of JSON File: npm run swagger
     *  @output api/adminresources/swagger/swagger.json
     * Load: http://localhost:8082/api-docs will load the Swagger UI with APIs.
     */
    const swaggerFilePath = (getArgument('env') === 'default') ? SWAGGER_API_DOCS.FILEPATH : SWAGGER_API_DOCS.GLOBAL_FILEPATH;
    fs.stat(swaggerFilePath, (e, stat) => {
      // File exists in path.
      if (stat) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const swaggerFile = require(swaggerFilePath);
        expressApp.use('/admin/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, null));
      }
    });

    useExpressServer(expressApp, {
      classTransformer: true,
      routePrefix: APP.config.app.routePrefix,
      defaultErrorHandler: false,
      /**
       * We can add options about how routing-controllers should configure itself.
       * Here we specify what controllers should be registered in our express server.
       */
      controllers: controllers,
      middlewares: [path.join(pwd, getMiddlewarePaths(APP.config.appInfo.root, APP.config.app.middlewares))],
      graphqlSchema: graphqlSchema,
      graphqlRoute: graphqlRoute
    });

    if (APP.config.app.staticPath) {
      expressApp.use(express.static(path.join(pwd, `../../../../${APP.config.app.staticPath}`)));

      expressApp.get('*', (req, res) => {
        res.sendFile(path.join(pwd + `../../../../../${APP.config.app.staticPath}/index.html`));
      });
    }

    // Run application to listen on given port
    const server = http.createServer(expressApp).listen(APP.config.app.port);
    if (APP.config.app.keepAliveTimeout) {
      server.keepAliveTimeout = APP.config.app.keepAliveTimeout;
    }

    if (APP.config.app.headersTimeout) {
      server.headersTimeout = APP.config.app.headersTimeout;
    }
    let httpsServer: https.Server;
    settings.setData('express_server', server);

    const hasCertFile = fs.existsSync(APP.config.app.certFile);
    const hasKeyFile = fs.existsSync(APP.config.app.keyFile);
    if (!hasKeyFile || !hasCertFile) {
      // eslint-disable-next-line no-console
      console.error(`https cert: @{APP.config.app.certFile} key: ${APP.config.app.keyFile} files missing`);
    }

    if (APP.config.app.https) {
      const httpsOptions: https.ServerOptions = {
        cert: hasKeyFile ? fs.readFileSync(APP.config.app.certFile) : undefined,
        key: hasCertFile ? fs.readFileSync(APP.config.app.keyFile) : undefined
      };
      if (APP.config.app.secret) {
        httpsOptions.passphrase = APP.config.app.secret;
      }
      httpsServer = https.createServer(httpsOptions, expressApp).listen(APP.config.app.httpsPort);
      if (APP.config.app.keepAliveTimeout) {
        httpsServer.keepAliveTimeout = APP.config.app.keepAliveTimeout;
      }

      if (APP.config.app.headersTimeout) {
        httpsServer.headersTimeout = APP.config.app.headersTimeout;
      }
      settings.setData('express_server_https', httpsServer);
    }

    process.on('exit', (err) => {
      server.close();
      if (httpsServer) {
        httpsServer.close();
      }
    });

    process.on('unhandledRejection', (err) => {
      // tslint:disable:no-console
      // eslint-disable-next-line no-console
      console.error('unhandledRejection');
      // eslint-disable-next-line no-console
      console.error(err);
    });

    // Here we can set the data for other loaders
    settings.setData('express_app', expressApp);

    return Promise.resolve();
  }

  return Promise.reject('no MicroframeworkSettings available');
};
