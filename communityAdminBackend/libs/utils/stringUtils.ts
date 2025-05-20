export class StringUtils {

  static toTitleCase(value: string): string {
    return (value || '').replace(/\w\S*/g, (txt: string) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static trimRight(value: string, charlist?: string): string {
    if (typeof charlist === 'undefined') {
      charlist = '\\s';
    }

    return (value || '').replace(new RegExp('[' + charlist + ']+$'), '');
  }

  static trimLeft(value: string, charlist?: string) {
    if (typeof charlist === 'undefined') {
      charlist = '\\s';
    }

    return (value || '').replace(new RegExp('^[' + charlist + ']+'), '');
  }

  static toMoney(value: string, includeDollar = true): string {
    try {
      value = (value || '').replace(/,/g, '');
      return (includeDollar ? '$ ' : '') + parseFloat(value).toFixed(2); //.replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } catch (error) {
      //console.error(error);
    }

    return value;
  }

  static toJson(value: string): object | Array<unknown> {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  static makeBase64UrlSafe(bse64String: string): string {
    return bse64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  static substringBefore(str: string, separator: string): string {
    if (!str || !separator) {
      return str;
    }
    if (separator.length === 0) {
      return '';
    }
    const pos = str.indexOf(separator);
    if (pos === -1) {
      return str;
    }
    return str.substring(0, pos).trim();
  }

  static substringAfter(str: string, separator: string): string {
    if (!str) {
      return str;
    }
    if (separator === null) {
      return '';
    }
    const pos = str.indexOf(separator);
    if (pos === -1) {
      return '';
    }
    return str.substring(pos + separator.length).trim();
  }

  //web-safe unicode substitutions - https://gist.github.com/epheatt/1697194
  static substituteUnicodeSymbols(st: string): string {
    if (!st) {
      return st;
    }
    let str: string = st.trim();

    if (str.length > 0) {
      //strip iso-8859-1 and windows-1252 control characters
      str = str.replace(/[\u0081\u008D\u008F\u0090\u009D]/g, '');
      //Shift iso-8859-1 and windows-1252 up to unicode websafe equivalents
      str = str.replace(/[\u0080]/g, '\u20AC'); //euro sign
      str = str.replace(/[\u0082]/g, '\u201A'); //single low-9 quotation mark
      str = str.replace(/[\u0083]/g, '\u0192'); //florin currency symbol
      str = str.replace(/[\u0084]/g, '\u201E'); //double low-9 quotation mark
      str = str.replace(/[\u0085]/g, '\u2026'); //horizontal ellipsis
      str = str.replace(/[\u0086]/g, '\u2020'); //dagger
      str = str.replace(/[\u0087]/g, '\u2021'); //double dagger
      str = str.replace(/[\u0088]/g, '\u02C6'); //modifier letter circumflex accent
      str = str.replace(/[\u0089]/g, '\u2030'); //per mille sign
      str = str.replace(/[\u008A]/g, '\u0160'); //latin capital letter s with caron
      str = str.replace(/[\u008B]/g, '\u2039'); //single left-pointing angle quotation mark
      str = str.replace(/[\u008C]/g, '\u0152'); //latin capital ligature oe
      str = str.replace(/[\u008E]/g, '\u017D'); //latin capital letter z with caron
      str = str.replace(/[\u0091]/g, '\u2018'); //left single quotation mark
      str = str.replace(/[\u0092]/g, '\u2019'); //right single quotation mark
      str = str.replace(/[\u0093]/g, '\u201C'); //left double quotation mark
      str = str.replace(/[\u0094]/g, '\u201D'); //right double quotation mark
      str = str.replace(/[\u0095]/g, '\u2022'); //bullet
      str = str.replace(/[\u0096]/g, '\u2013'); //en dash
      str = str.replace(/[\u0097]/g, '\u2014'); //em dash
      str = str.replace(/[\u0098]/g, '\u02DC'); //small tilde
      str = str.replace(/[\u0099]/g, '\u2122'); //trade mark sign
      str = str.replace(/[\u009A]/g, '\u0161'); //latin small letter s with caron
      str = str.replace(/[\u009B]/g, '\u203A'); //single right-pointing angle quotation mark
      str = str.replace(/[\u009C]/g, '\u0153'); //latin small ligature oe
      str = str.replace(/[\u009E]/g, '\u017E'); //latin small letter z with caron
      str = str.replace(/[\u009F]/g, '\u0178'); //latin capital letter y with diaeresis
      //Replace nonbreaking space with regular space
      str = str.replace(/[\u00A0]/g, '\u0020');
      //Shift common punctiation down to ASCII
      //soft hyphen, hyphen, non-breaking-hyphen, figure dash, en dash, em dash, horizontal bar,
      //hyphen bullet, small em dash, small hyphen-minus and fullwidth hyphen-minus to hyphen-minus
      str = str.replace(/[\u00AD\u2010\u2011\u2012\u2013\u2014\u2015\u2043\uFE58\uFE63\uFE0D]/g, '\u002D');
      //left, right and high-reversed-9 single quotation mark to apostrophe
      str = str.replace(/[\u2018\u2019\u201B]/g, '\u0027');
      //left, right and high-reversed-9 double quotation mark to quotation mark
      str = str.replace(/[\u201C\u201D\u201F]/g, '\u0022');
      //single and double low-9 quotation mark to comma
      str = str.replace(/[\u201A\u201E]/g, '\u002C');
    }
    return str;
  }

  static randomString(length): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static isModerated(text: string): boolean {
    /* If the comment text contains only the special chars we will allow them.
     * Eg: :-D, :-) etc etc
    */
    if (text.match(/(\*{2,})/) !== null) {
      return true;
    }
    return false;
  }

  static areEqualArray(arr1, arr2) {
    const N = arr1.length;
    const M = arr2.length;

    if (N !== M) { return false; }

    const map = new Map();
    let count = 0;
    for (let i = 0; i < N; i++) {
      if (map.get(arr1[i]) == null) { map.set(arr1[i], 1); }
      else {
        count = map.get(arr1[i]);
        count++;
        map.set(arr1[i], count);
      }
    }
    for (let i = 0; i < N; i++) {
      if (!map.has(arr2[i])) { return false; }
      if (map.get(arr2[i]) === 0) { return false; }

      count = map.get(arr2[i]);
      --count;
      map.set(arr2[i], count);
    }

    return true;
  }
}
