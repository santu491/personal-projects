import { AllHtmlEntities } from 'html-entities';
import { DomHandler, DomUtils, Parser } from 'htmlparser2';

export class HtmlParser {
  static parse(html: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const handler = new DomHandler((error: Error | null, dom) => {
        if (error) {
          reject(error);
        } else {
          resolve(dom);
        }
      });
      const parser = new Parser(handler, {});
      parser.write(html);
      parser.done();
    });
  }

  static getElementByType(tagName: string, dom) {
    return DomUtils.getElementsByTagName(tagName, dom, true);
  }

  static decodeHtmlChars(html: string) {
    const parser = new AllHtmlEntities();
    return parser.decode(html);
  }
}
