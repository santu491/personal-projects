import { awsSecretDetails } from '@anthem/communityadminapi/common';
import * as SecretManager from 'aws-sdk/clients/secretsmanager';

export const secretManager = async (env: string): Promise<string> => {
  // Fetch the secret manager based on the ENV.
  try {
    const lowerEnv = ['sit', 'sit1', 'sit2', 'dev', 'dev1', 'dev2'];
    const region = lowerEnv.includes(env) ? awsSecretDetails.region2 : awsSecretDetails.region1;
    const secret = new SecretManager({ region: region });
    const params: SecretManager.GetSecretValueRequest = {
      SecretId: awsSecretDetails[env].secretName,
      VersionStage: 'AWSCURRENT'
    };
    const response = await secret.getSecretValue(params).promise();
    return response.SecretString;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error as string;
  }
};
