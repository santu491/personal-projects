import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { JsonTransformer } from './../jsonTransformer';

export const mockJsonTransformer: Mockify<JsonTransformer> = {
  jsonToClass: jest.fn(),
  classToJson: jest.fn()
};
