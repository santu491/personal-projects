import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { OutputScanner } from './../outputScanner';

export const mockOutputScanner: Mockify<OutputScanner> = {
  scanInput: jest.fn()
};
