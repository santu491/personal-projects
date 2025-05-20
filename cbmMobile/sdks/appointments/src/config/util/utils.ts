import { RequestCurrentStatus } from '../../models/appointments';
import { requestStatusStyles } from '../../overrideStyles/requestStatus.styles';

export const currentStatusMap: { [key: string]: string } = {
  [RequestCurrentStatus.REJECTED]: 'Canceled by you',
  [RequestCurrentStatus.APPROVED_BY_OTHERS]: 'Canceled by you',
  [RequestCurrentStatus.PDR_CANCEL]: 'Canceled by Counselor',
  [RequestCurrentStatus.PDR_NO_RESPONSE]: 'No response from Counselor',
  [RequestCurrentStatus.MBR_CANCEL]: 'Canceled by you',
  [RequestCurrentStatus.APPROVED]: 'Confirmed',
  [RequestCurrentStatus.INITIATED]: 'Approval pending',
  [RequestCurrentStatus.MULTIPLE_RESPONSES]: 'Multiple responses',
  [RequestCurrentStatus.ACCEPTED]: 'Approved',
  [RequestCurrentStatus.MBR_NO_RESPONSE]: 'No response from you',
  [RequestCurrentStatus.DECLINED]: 'Declined by Counselor',
  [RequestCurrentStatus.NEW_TIME_PROPOSED]: 'New time proposed',
};

export const getRequestCurrentStatusMessage = (currentStatus: string) => {
  return currentStatusMap[currentStatus] || '';
};

export const getStatusViewStyle = (status: string) => {
  switch (status) {
    case RequestCurrentStatus.INITIATED:
      return requestStatusStyles.pending;
    case RequestCurrentStatus.APPROVED:
    case RequestCurrentStatus.ACCEPTED:
    case RequestCurrentStatus.MULTIPLE_RESPONSES:
    case RequestCurrentStatus.NEW_TIME_PROPOSED:
      return requestStatusStyles.approved;
    case RequestCurrentStatus.APPROVED_BY_OTHERS:
    case RequestCurrentStatus.PDR_CANCEL:
    case RequestCurrentStatus.PDR_NO_RESPONSE:
    case RequestCurrentStatus.MBR_NO_RESPONSE:
    case RequestCurrentStatus.DECLINED:
    default:
      return requestStatusStyles.rejected;
  }
};

export const getStatusTextStyle = (status: string) => {
  switch (status) {
    case RequestCurrentStatus.INITIATED:
      return requestStatusStyles.pendingTextStyle;
    case RequestCurrentStatus.APPROVED:
    case RequestCurrentStatus.ACCEPTED:
    case RequestCurrentStatus.MULTIPLE_RESPONSES:
    case RequestCurrentStatus.NEW_TIME_PROPOSED:
      return requestStatusStyles.approvedTextStyle;
    case RequestCurrentStatus.APPROVED_BY_OTHERS:
    case RequestCurrentStatus.PDR_CANCEL:
    case RequestCurrentStatus.PDR_NO_RESPONSE:
    case RequestCurrentStatus.MBR_NO_RESPONSE:
    case RequestCurrentStatus.DECLINED:
    default:
      return requestStatusStyles.rejectedTextStyle;
  }
};

export const showCancelOption = (currentStatus: string) => {
  return (
    currentStatus === RequestCurrentStatus.MBR_CANCEL ||
    currentStatus === RequestCurrentStatus.PDR_CANCEL ||
    currentStatus === RequestCurrentStatus.APPROVED_BY_OTHERS ||
    currentStatus === RequestCurrentStatus.REJECTED ||
    currentStatus === RequestCurrentStatus.DECLINED ||
    currentStatus === RequestCurrentStatus.PDR_NO_RESPONSE ||
    currentStatus === RequestCurrentStatus.MBR_NO_RESPONSE
  );
};

export const showConfirmOption = (currentStatus: string) => {
  return currentStatus === RequestCurrentStatus.ACCEPTED || currentStatus === RequestCurrentStatus.NEW_TIME_PROPOSED;
};
