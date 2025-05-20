import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, AppException, ThreadPool } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { Worker } from 'worker_threads';

@Service()
export class VirusScanner {
  constructor(private _pool: ThreadPool, @LoggerParam(__filename) private _log: ILogger) {}

  virusScan(files: { originalname: string; buffer: Buffer }[]): Promise<boolean> {
    if (!APP.config.security.virusScan.enable) {
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      this._pool.acquire(
        process.cwd() + '/workers/icap/virusScan.js',
        {
          workerData: {
            ip: APP.config.security.virusScan.ip,
            port: APP.config.security.virusScan.port,
            serviceName: APP.config.security.virusScan.serviceName,
            files: files.map((f) => {
              return {
                name: f.originalname,
                buffer: f.buffer
              };
            })
          }
        },
        (err: Error, worker: Worker) => {
          if (err) {
            this._log.error(err);
            reject(
              AppException.getException(500, [
                {
                  code: '500',
                  message: 'Request validation failed',
                  detail: 'Bad Request'
                }
              ])
            );
            return;
          }
          worker.on('message', (data) => {
            //console.log(`worker message`);
            const fileNames = files.map((f) => {
              return f.originalname;
            });
            if (data.error) {
              this._log.error(data.error);
              reject(
                AppException.getException(500, [
                  {
                    code: '500',
                    message: 'Request validation failed',
                    detail: `virus scan failed: ${fileNames.join(', ')}`
                  }
                ])
              );
              return;
            } else {
              this._log.debug(`virus scan success: ${fileNames.join(', ')}`);
              resolve(true);
              return;
            }
          });
          worker.on('exit', () => {
            //console.log(`worker exited`);
          });

          worker.on('error', (error) => {
            this._log.error(error.stack || error.message);
            reject(
              AppException.getException(500, [
                {
                  code: '500',
                  message: 'Request validation failed',
                  detail: 'ThreadWorker error'
                }
              ])
            );
          });
        }
      );
    });
  }
}
