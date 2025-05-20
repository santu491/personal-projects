import { KEYS, collections } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import { Agenda } from 'agenda/es';
import { Service } from 'typedi';

@Service()
export class AgendaHelperService {
  constructor(
    private mongoDB: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async getAgenda() {
    try {
      // Handle the agenda.
      const client = await this.mongoDB.getDbClient();
      const agenda: Agenda = new Agenda(
        {
          db: {
            collection: collections.SCHEDULED_JOB,
            options: APP.config.database.options
          },
          mongo: client.db(APP.config.database.name),
          processEvery: KEYS.DELAY
        }
      );
      await agenda.start();

      return agenda;
    } catch (error) {
      this._log.error(error as Error);

      return null;
    }
  }

  public async stopAgenda(agenda: Agenda) {
    await agenda.stop();
    await agenda.close();
  }

}
