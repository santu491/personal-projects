import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import * as fs from 'fs';
import helmet from 'helmet';
import * as path from 'path';
import {resolve} from 'path';
import 'reflect-metadata';
import {useExpressServer} from 'routing-controllers';
import * as swaggerUi from 'swagger-ui-express';
import {
  authenticationHandler,
  currentUserhandler,
} from './middleware/authMiddleware';
import {HttpErrorHandler} from './middleware/httpMiddleware';
import {JwtMiddleware} from './middleware/jwtAuthMiddleware';
import {ResponseMiddleware} from './middleware/responseMiddleware';
import {PUBLIC_ROUTES} from './routingConstants';
import {swaggerLoader} from './swagger';
import {getArgument} from './utils/common';
import {loadConfigData, setupAPP} from './utils/setupConfig';
import {jsonErrorHandler} from './middleware/jsonErrorHandler';
import {RequestMiddleware} from './middleware/requestMiddleware';
// import { awsConfigLoader } from './awsConfigLoader';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Helmet configuration.
app.use(helmet());
// To add secure headers
app.use(helmet({contentSecurityPolicy: false}));
// Configure HSTS
app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true, // Add the preload flag
  }),
);
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(
  helmet.frameguard({
    action: 'sameorigin',
  }),
);

// To compress the http response data
const shouldCompress = (
  req: express.Request,
  res: express.Response,
): boolean => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
};
app.use(
  compression({
    filter: shouldCompress,
  }),
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['set-cookie'],
  }),
);
app.use(cookieParser());
app.use(jsonErrorHandler);
app.use(bodyParser.urlencoded({extended: true}));

const controllers: string[] = [];
controllers.push(path.join(process.cwd(), '**/controllers/*.{ts,js}'));
useExpressServer(app, {
  cors: true,
  classTransformer: true,
  controllers: controllers,
  defaultErrorHandler: false,
  middlewares: [
    ResponseMiddleware,
    HttpErrorHandler,
    JwtMiddleware,
    RequestMiddleware,
  ],
  currentUserChecker: currentUserhandler,
  authorizationChecker: authenticationHandler,
});

const env = getArgument('env');
if (env === '') {
  throw new Error('Environment not provided');
}

const start = async (): Promise<void> => {
  try {
    // Set up config
    const configs = await Promise.all([
      loadConfigData(resolve(__dirname, './config/common.config.json')),
      loadConfigData(resolve(__dirname, `./config/${env}.config.json`)),
    ]);

    // Start the aws config loader
    // await awsConfigLoader();

    // Set up swagger Ui
    swaggerLoader();

    /**
     * The OpenAPI Specifications for all the NODE JS APIs.
     * Render the JSON file that contains the API specs of all the APIs in Swagger UI.
     * Generation of JSON File: npm run swagger
     * Load: http://localhost:3000/v1/public/api-docs/ will load the Swagger UI with APIs.
     */
    const swaggerJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../swagger.json'), 'utf-8'),
    );
    console.log(
      'Swagger JSON loaded:',
      path.resolve(__dirname, '../swagger.json'),
    );
    app.use(
      PUBLIC_ROUTES.swagger,
      swaggerUi.serve,
      swaggerUi.setup(swaggerJson),
    );
    setupAPP(configs[0], configs[1]);

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
