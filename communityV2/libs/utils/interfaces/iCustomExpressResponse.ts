import * as express from 'express';

export interface ICustomExpressResponse extends express.Response {
  audited?: boolean;
}
