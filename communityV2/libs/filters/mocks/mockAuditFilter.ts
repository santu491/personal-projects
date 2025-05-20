import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { AuditFilter } from './../auditFilter';

export const mockAuditFilter: Mockify<AuditFilter> = {
  auditRequest: jest.fn()
};
