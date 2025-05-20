import * as JsonLogic from 'json-logic-js';

export class JsonLogicParser {
  static parse(rule: string, ruleData: {}): boolean {
    try {
      if (rule && ruleData) {
        return JsonLogic.apply(JSON.parse(rule), ruleData);
      }
    } catch (error) {
      // tslint:disable: no-console
      // eslint-disable-next-line no-console
      console.error('json logic parser error');
      // eslint-disable-next-line no-console
      console.error(error);
      // tslint: enable
    }

    return false;
  }
}
