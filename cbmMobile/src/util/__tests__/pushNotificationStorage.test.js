import {
  isNotificationPermissionAlertGranted,
  setNotificationPermissionAlertGranted,
} from '../pushNotificationStorage';

describe('Test for local storage', () => {
  it('test set notification permission alert granted method ', () => {
    expect(setNotificationPermissionAlertGranted(true)).toBeDefined();
  });

  it('test get notification permission alert granted method is true ', async () => {
    expect(await isNotificationPermissionAlertGranted()).toBeTruthy();
  });

  it('test set notification permission alert granted method  send false', () => {
    expect(setNotificationPermissionAlertGranted(false)).toBeDefined();
  });

  it('test get notification permission alert granted method is false ', async () => {
    expect(await isNotificationPermissionAlertGranted()).toBeFalsy();
  });
});
