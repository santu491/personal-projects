import { RequestCurrentStatus } from '../../../models/appointments';
import { requestStatusStyles } from '../../../overrideStyles/requestStatus.styles';
import {
  getRequestCurrentStatusMessage,
  getStatusTextStyle,
  getStatusViewStyle,
  showCancelOption,
  showConfirmOption,
} from '../utils';

describe('getRequestCurrentStatusMessage', () => {
  it('should return "Canceled by you" for REJECTED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.REJECTED)).toBe('Canceled by you');
  });

  it('should return "Canceled by you" for APPROVED_BY_OTHERS status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.APPROVED_BY_OTHERS)).toBe('Canceled by you');
  });

  it('should return "Canceled by Counselor" for PDR_CANCEL status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.PDR_CANCEL)).toBe('Canceled by Counselor');
  });

  it('should return "No response from Counselor" for PDR_NO_RESPONSE status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.PDR_NO_RESPONSE)).toBe('No response from Counselor');
  });

  it('should return "Canceled by you" for MBR_CANCEL status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.MBR_CANCEL)).toBe('Canceled by you');
  });

  it('should return "Confirmed" for APPROVED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.APPROVED)).toBe('Confirmed');
  });

  it('should return "Approval pending" for INITIATED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.INITIATED)).toBe('Approval pending');
  });

  it('should return "Multiple responses" for MULTIPLE_RESPONSES status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.MULTIPLE_RESPONSES)).toBe('Multiple responses');
  });

  it('should return "Approved" for ACCEPTED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.ACCEPTED)).toBe('Approved');
  });

  it('should return "No response from you" for MBR_NO_RESPONSE status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.MBR_NO_RESPONSE)).toBe('No response from you');
  });

  it('should return "Declined by Counselor" for DECLINED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.DECLINED)).toBe('Declined by Counselor');
  });

  it('should return "New time proposed" for NEW_TIME_PROPOSED status', () => {
    expect(getRequestCurrentStatusMessage(RequestCurrentStatus.NEW_TIME_PROPOSED)).toBe('New time proposed');
  });

  it('should return an empty string for an unknown status', () => {
    expect(getRequestCurrentStatusMessage('UNKNOWN_STATUS')).toBe('');
  });

  it('should return pending style for INITIATED status', () => {
    expect(getStatusViewStyle(RequestCurrentStatus.INITIATED)).toBe(requestStatusStyles.pending);
  });

  it('should return approved style for APPROVED status', () => {
    expect(getStatusViewStyle(RequestCurrentStatus.APPROVED)).toBe(requestStatusStyles.approved);
  });

  it('should return rejected style for unknown status', () => {
    expect(getStatusViewStyle('UNKNOWN_STATUS')).toBe(requestStatusStyles.rejected);
  });

  it('should return pending text style for INITIATED status', () => {
    expect(getStatusTextStyle(RequestCurrentStatus.INITIATED)).toBe(requestStatusStyles.pendingTextStyle);
  });

  it('should return approved text style for APPROVED status', () => {
    expect(getStatusTextStyle(RequestCurrentStatus.APPROVED)).toBe(requestStatusStyles.approvedTextStyle);
  });

  it('should return rejected text style for unknown status', () => {
    expect(getStatusTextStyle('UNKNOWN_STATUS')).toBe(requestStatusStyles.rejectedTextStyle);
  });

  it('should return true for MBR_CANCEL status', () => {
    expect(showCancelOption(RequestCurrentStatus.MBR_CANCEL)).toBe(true);
  });

  it('should return false for APPROVED status', () => {
    expect(showCancelOption(RequestCurrentStatus.APPROVED)).toBe(false);
  });

  it('should return false for unknown status', () => {
    expect(showCancelOption('UNKNOWN_STATUS')).toBe(false);
  });

  it('should return true for ACCEPTED status', () => {
    expect(showConfirmOption(RequestCurrentStatus.ACCEPTED)).toBe(true);
  });

  it('should return false for INITIATED status', () => {
    expect(showConfirmOption(RequestCurrentStatus.INITIATED)).toBe(false);
  });

  it('should return false for unknown status', () => {
    expect(showConfirmOption('UNKNOWN_STATUS')).toBe(false);
  });
});
