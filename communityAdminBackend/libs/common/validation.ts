import { PageParam } from 'api/adminresources/models/pageParamModel';
import { AdminUser } from 'api/adminresources/models/userModel';
import { API_RESPONSE } from '.';
import { APP, RequestContext } from '../utils';

import htmlToText = require('html-to-text');
import cleanser = require('profanity-cleanser');

export class ValidationResponse {
  validationResult: boolean;
  reason: string;
}
export class Validation {
  public isHex(id): boolean {
    // To validate if the id is hexadecimal
    if (id === undefined || /^ *$/.test(id) || id.length !== 24) {
      return false;
    }
    const regexp = /^[0-9a-fA-F]+$/;

    return regexp.test(id);
  }

  public isNullOrWhiteSpace(data: string): boolean {
    return data === undefined || data === null || data.match(/^ *$/) !== null;
  }

  public sort(data, sortOrder: number, key: string) {
    let sortedData = [];
    if (sortOrder === 1) {
      //Ascending Order
      sortedData = data.sort((a, b) => {
        return a[key] - b[key];
      });
    } else {
      //Descending Order
      sortedData = data.sort((a, b) => {
        return b[key] - a[key];
      });
    }
    return sortedData;
  }

  public isValid(pageParam: PageParam): ValidationResponse {
    const validate = new ValidationResponse();
    validate.validationResult = true;
    if (pageParam.pageNumber < 1) {
      validate.validationResult = false;
      validate.reason = API_RESPONSE.messages.pageNumberMissing;
    }

    if (pageParam.pageSize < 0) {
      validate.validationResult = false;
      validate.reason = API_RESPONSE.messages.pageSizeMissing;
    }

    if (pageParam.sort > 1 || pageParam.sort < -1) {
      validate.validationResult = false;
      validate.reason = API_RESPONSE.messages.sortInvalid;
    }

    return validate;
  }

  public moderatedWords(text: string): string {
    if (text.match(/^[^a-zA-Z0-9]+$/) !== null) {
      return text;
    }
    cleanser.setLocale();
    cleanser.addWords(APP.config.wordList.badWords);
    APP.config.wordList.sensitiveWords.forEach((word: string) =>
      cleanser.removeWords(word)
    );

    const output = cleanser.replace(text.toLowerCase());
    if (output.match(/\*{2,}/) === null) {
      return text;
    }
    return output;
  }

  public identifySpecialKeyWords(text: string) {
    /* If the text contains only the special keywords specified by the Admins then alert the admin regarding the content. */
    for (const key of APP.config.wordList.sensitiveWords) {
      const filteredKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const test = '(?<!\\S)' + filteredKey + '(?!\\S)';
      const regx = new RegExp(test, 'i');
      if (text.match(regx) !== null) {
        return true;
      }
    }
    return false;
  }

  public checkUserIdentity() {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser: AdminUser = JSON.parse(userIdentity);

    return currentUser;
  }

  public incrementVersion = (version: string) => {
    const versionArr = version.split('.');
    const numArr = versionArr.map(Number);
    if (numArr.length < 3) {
      numArr[0]++;
      numArr[1] = 0;
      const strString = numArr.map(String);
      return strString.join('.');
    }
    numArr[2]++;
    if (numArr[2] >= 10) {
      numArr[1]++;
      numArr[2] = 0;
    }
    if (numArr[1] >= 10) {
      numArr[0]++;
      numArr[1] = 0;
      numArr[2] = 0;
    }
    const strArr = numArr.map(String);
    return strArr.join('.');
  };

  public isValidUrl(url: string) {
    let urlLink;
    try {
      urlLink = new URL(url);
    } catch (_) {
      return false;
    }
    return urlLink.protocol === 'http:' || urlLink.protocol === 'https:';
  }

  public convertHtmlToPlainText(text: string = '') {
    return htmlToText.convert(text, { wordwrap: false });
  }

  public isValidDate(date: string) {
    const dateValue = Date.parse(date);
    return !Number.isNaN(dateValue);
  }
}
