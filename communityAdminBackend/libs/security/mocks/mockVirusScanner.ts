import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { VirusScanner } from '../virusScanner';

export const mockVirusScanner: Mockify<VirusScanner> = {
  virusScan: jest.fn()
};
