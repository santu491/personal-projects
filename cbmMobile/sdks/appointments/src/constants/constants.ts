export enum CancelRequestType {
  CANCEL = 'Cancel',
  CANCEL_ALL = 'CancelAll',
  CONFIRM = 'Confirm',
  REQUESTS_CANCELED = 'RequestsCanceled',
  REQUEST_CANCELED = 'RequestCanceled',
  REQUEST_CONFIRMED = 'RequestConfirmed',
  SERVER_ERROR = 'ServerError',
}

export enum CancelScreenType {
  APPOINTMENT_DETAIL_REQUEST = 'APPOINTMENT_DETAIL_REQUEST',
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  MULTIPLE_PENDING_REQUESTS = 'MULTIPLE_PENDING_REQUESTS',
}
