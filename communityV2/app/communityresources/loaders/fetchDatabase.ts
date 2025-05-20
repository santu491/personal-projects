import { awsSecretDetails } from '@anthem/communityapi/common';
import { GetSecretValueCommand, GetSecretValueCommandInput, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const fetchDatabase = async (env: string): Promise<string> => {
  // Fetch the secret manager based on the ENV.
  try {
    const lowerEnv = ['sit', 'sit1', 'sit2', 'dev', 'dev1', 'dev2'];
    const region = lowerEnv.includes(env) ? awsSecretDetails.region2 : awsSecretDetails.region1;
    const client = new SecretsManagerClient({ region: region });
    const params: GetSecretValueCommandInput = {
      SecretId: awsSecretDetails[env].secretName,
      VersionStage: 'AWSCURRENT'
    };
    const command = new GetSecretValueCommand(params);
    const response = await client.send(command);

    return response.SecretString;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error as string;
  }
};
