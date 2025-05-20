import { Container } from 'typedi';
import { LoggerFactory } from './../loggerFactory';

export function LoggerParam(scope: string): (object: object, propertyName: string, index?: number) => void {
  return (object: object, propertyName: string, index?: number) => {
    const logger = LoggerFactory.getLogger(scope);
    Container.registerHandler({ object, propertyName, index, value: () => logger });
  };
}
