import { ILogger, LoggerFactory } from '@anthem/communityadminapi/logger';
import { OutputScanner } from '@anthem/communityadminapi/security';
import { APP } from '@anthem/communityadminapi/utils';

export class OutputFilter {
  private static _scanner: OutputScanner;

  private static init() {
    if (!this._scanner) {
      this._scanner = new OutputScanner(
        APP.config.security ? APP.config.security.suppressErrorProps : [],
        APP.config.security ? APP.config.security.errorMaps : {},
        APP.config.security ? APP.config.security.outputEncryptedProps : []
      );
    }
  }

  private static _log: ILogger = LoggerFactory.getLogger(__filename);

  public static scanOutput(body: object | Array<unknown> | string, httpStatus: number): string | object | Array<unknown> {
    try {
      this.init();
      let input: string | object | Array<unknown> = 'Application Error';

      if (typeof body === 'object' || Array.isArray(body)) {
        //remove reference to original object. otherwise original object get modified
        input = JSON.parse(JSON.stringify(body));
      } else if (typeof body === 'string') {
        input = body;
      }

      if (httpStatus >= 400 || httpStatus <= 0) {
        //do not return string error response. convert to generic errror otheriwse it could expose internal stack traces.
        if (typeof body === 'string') {
          input = 'Application Error';
        }
      }

      return this._scanner.scanInput(input, httpStatus.toString());
    } catch (e) {
      this._log.error(e.stack || e.message);
    }

    return {};
  }
}
