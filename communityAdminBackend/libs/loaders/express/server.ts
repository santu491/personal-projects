import { APP, StringUtils } from '@anthem/communityadminapi/utils';
import { plainToClass } from 'class-transformer';
import { useContainer, validateOrReject as validate, ValidationError } from 'class-validator';
import { graphqlHTTP } from 'express-graphql';
import { Action, BadRequestError, BaseDriver, ControllerMetadata, createServer, ParamMetadata } from 'routing-controllers';
import { ActionParameterHandler } from 'routing-controllers/cjs/ActionParameterHandler';
import { Container } from 'typedi';
import { ICustomRoutingControllerOptions } from '../interfaces/iCustomRoutingControllerOptions';
import { ExpressDriver2 } from './driver';

useContainer(Container);

/**
 * issue https://github.com/typestack/routing-controllers/issues/384
 * a copy of https://github.com/typestack/routing-controllers/blob/4a56d176db77bc081dfcd3d8550e8433b5bc476e/src/ActionParameterHandler.ts#L179-L199
 * @param value
 * @param paramMetadata
 */
ActionParameterHandler.prototype['validateValue'] = function (this: ActionParameterHandler<BaseDriver>, value: typeof paramMetadata.targetType, paramMetadata: ParamMetadata) {
  const isValidationEnabled =
    paramMetadata.validate instanceof Object || paramMetadata.validate === true || (((this as unknown) as { driver: BaseDriver }).driver.enableValidation === true && paramMetadata.validate !== false);
  const shouldValidate = paramMetadata.targetType && paramMetadata.targetType !== Object && value instanceof paramMetadata.targetType;

  if (isValidationEnabled && shouldValidate) {
    const options = paramMetadata.validate instanceof Object ? paramMetadata.validate : ((this as unknown) as { driver: BaseDriver }).driver.validationOptions;
    return validate(value, options)
      .then(() => value)
      .catch((validationErrors: ValidationError[]) => {
        const error = (new BadRequestError(`Invalid ${paramMetadata.type}, check 'errors' property for more info.`) as unknown) as { errors: ValidationError[]; paramName: string };
        error.errors = validationErrors;
        error.paramName = paramMetadata.name;
        throw error;
      });
  }

  return value;
};

ActionParameterHandler.prototype['transformValue'] = function (this: ActionParameterHandler<BaseDriver>, value: typeof paramMetadata.targetType, paramMetadata: ParamMetadata): unknown {
  if (((this as unknown) as { driver: BaseDriver }).driver.useClassTransformer && paramMetadata.targetType && paramMetadata.targetType !== Object && !(value instanceof paramMetadata.targetType)) {
    const options = paramMetadata.classTransform || ((this as unknown) as { driver: BaseDriver }).driver.plainToClassTransformOptions;
    value = plainToClass(paramMetadata.targetType, value, options);
  }

  return value;
};

export async function useExpressServer<T>(expressApp: T, options?: ICustomRoutingControllerOptions): Promise<T> {
  const driver = new ExpressDriver2(expressApp);
  const t = createServer(driver, options);

  let gqlRoute = '';
  if (APP.config.graphql.enable && options.graphqlSchema) {
    gqlRoute = options.graphqlRoute;
    if (gqlRoute.slice(-1) === '/') {
      gqlRoute += ':api';
    }
    driver.registerAction(
      {
        isBodyUsed: true,
        isJsonTyped: true,
        uses: [],
        controllerMetadata: ({
          uses: []
        } as unknown) as ControllerMetadata,
        fullRoute: `${StringUtils.trimRight(gqlRoute, '/')}/graphql`,
        type: 'post',
        isGraphql: true
      },
      (graphqlHTTP({
        schema: options.graphqlSchema,
        graphiql: false
      }) as unknown) as (options: Action) => void
    );

    driver.registerAction(
      {
        uses: [],
        controllerMetadata: ({
          uses: []
        } as unknown) as ControllerMetadata,
        fullRoute: `${StringUtils.trimRight(gqlRoute, '/')}/graphql`,
        type: 'get',
        isGraphql: true
      },
      (graphqlHTTP({
        schema: options.graphqlSchema,
        graphiql: false
      }) as unknown) as (options: Action) => void
    );

    if (APP.config.graphql.enableGraphiql) {
      driver.registerAction(
        {
          uses: [],
          controllerMetadata: ({
            uses: []
          } as unknown) as ControllerMetadata,
          fullRoute: `${StringUtils.trimRight(gqlRoute, '/')}/graphiql`,
          type: 'get',
          isGraphql: true
        },
        (graphqlHTTP({
          schema: options.graphqlSchema,
          graphiql: true
        }) as unknown) as (options: Action) => void
      );

      driver.registerAction(
        {
          uses: [],
          controllerMetadata: ({
            uses: []
          } as unknown) as ControllerMetadata,
          fullRoute: `${StringUtils.trimRight(gqlRoute, '/')}/graphiql`,
          type: 'post',
          isGraphql: true
        },
        (graphqlHTTP({
          schema: options.graphqlSchema,
          graphiql: false
        }) as unknown) as (options: Action) => void
      );
    }
  }

  return t;
}
