import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { JsonTransformer } from './../jsonTransformer';

export const mockJsonTransformer: Mockify<JsonTransformer> = {
  jsonToClass: jest.fn(),
  classToJson: jest.fn()
};
