import bodyParser from 'body-parser';
import * as express from 'express';
import logger from '../utils/logger';

const jsonParser = bodyParser.json();

export const jsonErrorHandler: express.RequestHandler = (req, res, next) => {
  jsonParser(req, res, err => {
    if (err) {
      logger().error('Invalid JSON:', err);
      // Set HSTS headers to the response if not present already
      if (!res.get('Strict-Transport-Security')) {
        res.set(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains; preload',
        );
      }
      return res.status(400).json({
        errors: [{message: 'Invalid JSON'}],
        statusCode: 400,
      });
    }
    next();
  });
};
