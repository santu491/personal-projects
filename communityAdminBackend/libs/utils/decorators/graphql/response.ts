import { createParamDecorator } from 'type-graphql';

export function GraphqlExpressResponse() {
  return createParamDecorator<{ getResponse: () => void }>(({ context }) => {
    return context.getResponse();
  });
}

export function GraphqlExpressQueryParam(name: string) {
  return createParamDecorator<{ query: { [key: string]: string } }>(({ context }) => {
    return context.query[name];
  });
}
