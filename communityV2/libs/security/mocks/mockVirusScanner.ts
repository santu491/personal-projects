import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { VirusScanner } from '../virusScanner';

export const mockVirusScanner: Mockify<VirusScanner> = {
  virusScan: jest.fn()
};
