declare module '*.json' {
  let json: any;
  export default json;
}

declare module 'figlet' { }

declare module '*config.default' {
  export const DEFAULT_CONFIG: any;
}
declare module '*config.default.common' {
  export const DEFAULT_COMMON_CONFIG: any;
}
declare module '*config.common' {
  export const COMMON_CONFIG: any;
}
declare module '*config' {
  export const ENV_CONFIG: any;
}
declare module '*config' {
  export const ENV_CONFIG: any;
}
declare module 'cls-hooked' {
  export function createNamespace(name: string): any;
  export function getNamespace(name: string): any;
}

declare module 'node-esapi' {
  export function encoder(): any;
}

declare module 'node-excel-export' {
  export function buildExport(data: any): any;
}

declare module 'swagger-ui-express' {
  export function serve(): void;
  export function setup(param1: any, param2: any): () => void;
}
