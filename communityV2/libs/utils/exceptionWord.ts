import { v4 as uuid } from 'uuid';
import { APP } from './app';

export function generateErrorSerial() {
  try {
    const length = APP.config.wordList.exceptionMsgWords.length;
    const r1Num = Math.floor(Math.random() * length);
    const r2Num = Math.floor(Math.random() * length);
    const r3Num = Math.floor(Math.random() * length);

    return APP.config.wordList.exceptionMsgWords[r1Num] + '-' + APP.config.wordList.exceptionMsgWords[r2Num] + '-' + APP.config.wordList.exceptionMsgWords[r3Num];
  } catch (exception) {
    return uuid();
  }
}
