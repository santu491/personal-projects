import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { AuditFilter } from './../auditFilter';

export const mockAuditFilter: Mockify<AuditFilter> = {
  auditRequest: jest.fn()
};
