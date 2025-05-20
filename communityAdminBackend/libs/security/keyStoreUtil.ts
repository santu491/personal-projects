import { APP } from '@anthem/communityadminapi/utils';
//import * as child_process from 'child_process';
//import * as path from 'path';

export class KeyStoreUtil {

  public static getKey(keyPath: string, alias: string, secret: string): string {
    if (alias === 'signature') {
      return APP.config.security.encryption.keyStoreKey;
    }
    else if(alias === 'encryption'){
      return APP.config.security.encryption.encryptionKey;
    }

    return '';
    /*let result = child_process.execSync(`java KeyTool "${path.join(__dirname, `./keystore/${keyPath}`)}" "${alias}" "${secret}"`, {
      cwd: `${path.join(__dirname, './keystore/keytool')}`
    });

    if (result) {
      return result.toString();
    }

    return null;*/
  }
}
