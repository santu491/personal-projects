// eslint-disable-next-line no-restricted-imports
import * as _ from 'lodash';
import { OperationObject, ReferenceObject, ResponsesObject, SchemaObject } from 'openapi3-ts';
// eslint-disable-next-line no-restricted-imports
import { getContentType, getStatusCode, IRoute, OpenAPI, OpenAPIParam } from 'routing-controllers-openapi';
import { getArgument } from '../args';

export function OpenAPI2(spec: OpenAPIParam) {
  const openApi = OpenAPI(spec);
  // tslint:disable-next-line:ban-types
  return (...args: [Function] | [object, string, PropertyDescriptor]) => {
    const generateSwagger = getArgument('swagger');
    if (!generateSwagger) {
      return;
    }

    openApi(...args);
  };
}

export function ResponseSchema2(
  responseClass: Function | string, // tslint:disable-line
  options: {
    contentType?: string;
    description?: string;
    statusCode?: string | number;
    isArray?: boolean;
    example?: {};
  } = {}
) {
  const setResponseSchema = (source: OperationObject, route: IRoute) => {
    const contentType = options.contentType || getContentType(route);
    const description = options.description || '';
    const isArray = options.isArray || false;
    const statusCode = (options.statusCode || getStatusCode(route)) + '';

    let responseSchemaName = '';
    if (typeof responseClass === 'function' && responseClass.name) {
      responseSchemaName = responseClass.name;
    } else if (typeof responseClass === 'string') {
      responseSchemaName = responseClass;
    }

    if (responseSchemaName) {
      const reference: ReferenceObject = {
        $ref: `#/components/schemas/${responseSchemaName}`
      };
      const schema: SchemaObject = isArray ? { items: reference, type: 'array' } as SchemaObject : reference as unknown as SchemaObject;
      const responses: ResponsesObject = {
        [statusCode]: {
          content: {
            [contentType]: {
              schema,
              example: options.example
            }
          },
          description
        }
      };

      return _.merge({}, source, { responses });
    }

    return source;
  };

  return OpenAPI(setResponseSchema);
}
