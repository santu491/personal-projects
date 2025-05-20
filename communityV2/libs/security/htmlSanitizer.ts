import * as sanitizeHtml from 'sanitize-html';
import { Service } from 'typedi';

@Service()
export class HtmlSanitizer {
  protected _allowedTags: string[] = [];
  protected _allowedAttributes: { [index: string]: sanitizeHtml.AllowedAttribute[] } | boolean = {};

  constructor(allowedTags?: string[], allowedAttributes?: { [index: string]: sanitizeHtml.AllowedAttribute[] } | boolean) {
    this._allowedTags = allowedTags;
    this._allowedAttributes = allowedAttributes;
  }

  sanitize(dirtyText: string): string {
    return sanitizeHtml(
      dirtyText,
      this._allowedTags && this._allowedAttributes
        ? {
          allowedTags: this._allowedTags,
          allowedAttributes: this._allowedAttributes
        }
        : undefined
    );
  }
}
