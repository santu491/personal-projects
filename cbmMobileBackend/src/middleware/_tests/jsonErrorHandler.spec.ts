import request from 'supertest';
import express from 'express';
import {jsonErrorHandler} from '../jsonErrorHandler';

const app = express();
app.use(jsonErrorHandler);

describe('jsonErrorHandler middleware', () => {
  it('should call next() when valid JSON is provided', async () => {
    const validJson = {key: 'value'};

    app.post('/test', (req, res) => {
      res.status(200).send('Success');
    });

    const response = await request(app)
      .post('/test')
      .send(validJson)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Success');
  });

  it('should return an error for invalid JSON', async () => {
    const invalidJson = '{key: value}';

    app.post('/test', (req, res) => {
      res.status(200).send('Success');
    });

    const response = await request(app)
      .post('/test')
      .send(invalidJson)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });
});
