
export class RequestValidator {

  sanitize(dirtyText: string, whitelistRegex: RegExp): string {
    return dirtyText.replace(whitelistRegex, '');
  }
}
