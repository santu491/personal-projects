import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { InputScanner } from './../inputScanner';

export const mockInputScanner: Mockify<InputScanner> = {
  scanInput: jest.fn(),
  scanUrlParams: jest.fn()
};
