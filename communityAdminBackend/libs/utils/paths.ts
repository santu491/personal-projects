export function getControllerPaths(app: string, api?: string, controller?: string) {
  return `/api/${app}/${api && app.indexOf('virtual') < 0 ? api + '/' : ''}**/controllers/*${controller || 'Controller'}{.js,.ts}`;
}

export function getMiddlewarePaths(app: string, middlewares?: string) {
  if (middlewares) {
    return `/libs/middleware/express/{${middlewares.split('|').join(',')}}{.js,.ts}`;
  }
  return `/app/${app}/middlewares/express/*Middleware{.js,.ts}`;
}

export function getResolverPaths(app: string, api?: string) {
  return `/api/${app}/${api && app.indexOf('virtual') < 0 ? api + '/' : ''}**/resolvers/*Resolver{.js,.ts}`;
}

export function getSwaggerPaths(app: string, api?: string) {
  return `/api/${app}/${api && app.indexOf('virtual') < 0 ? api + '/' : ''}**/swagger/*.json`;
}
