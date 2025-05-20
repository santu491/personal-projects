import * as dateFormat from 'dateformat';

export class DateUtil {
  static format(value: string | number | Date, pattern: string, utc?: boolean, gmt?: boolean): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(((value as unknown) as string) || '')) {
      value = `${value}T00:00:00`;
    }

    return dateFormat(value, pattern, utc, gmt);
  }

  /**
   * Ex: 1996-07-16 ->
   */
  static formatSoaDate(value: string): Date {
    const dp = (value || '').split('-');
    if (dp.length === 3 && dp[0].length === 4) {
      return new Date(`${('0' + dp[1]).slice(-2)}/${('0' + dp[2]).slice(-2)}/${dp[0]}`);
    }
    return null;
  }

  getServerDateTime(date?: Date): string {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'America/New_York'
    };
    const localTime: Date = date || new Date();
    const timeETC: Date = new Date(new Intl.DateTimeFormat('en-US', options).format(new Date()));
    let offset = (localTime.getTime() - timeETC.getTime()) / (60000 * 60);
    if (offset < 1) {
      offset = timeETC.getTimezoneOffset() / 60;
    }
    const timezoneOffString = ' GMT-' + this.zeroPad(offset.toFixed(2).replace('.', ''), 4) + ' (Eastern Daylight Time)';
    return DateUtil.format(timeETC, 'ddd mmm dd yyyy HH:MM:ss') + timezoneOffString;
  }

  getDateTimeBasedOnOffset(tzOffset: number, serverOffset?: number) {
    const now = new Date(Date.now()); // get the current time
    const currentTzOffset = serverOffset || -now.getTimezoneOffset() / 60;
    const deltaTzOffset = tzOffset - currentTzOffset; // timezone diff
    const nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
    const deltaTzOffsetMilli = deltaTzOffset * 3600000; // convert hours to milliseconds
    const outputDate = new Date(nowTimestamp + deltaTzOffsetMilli); // your new Date object with the timezone offset applied.
    return outputDate;
  }

  getDateString(dateToConvert: Date) {
    return `${dateToConvert.getFullYear()}-${(dateToConvert.getMonth() + 1).toString().padStart(2, '0')}-${dateToConvert.getDate().toString().padStart(2, '0')}`;
  }

  public zeroPad(num: number | string, places: number) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }
}
