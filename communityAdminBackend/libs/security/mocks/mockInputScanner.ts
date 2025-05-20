import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { InputScanner } from './../inputScanner';

export const mockInputScanner: Mockify<InputScanner> = {
  scanInput: jest.fn(),
  scanUrlParams: jest.fn()
};
