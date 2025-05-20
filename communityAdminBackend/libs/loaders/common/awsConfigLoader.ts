import { awsSecretDetails } from '@anthem/communityadminapi/common';
import { getArgument } from '@anthem/communityadminapi/utils';
import { config, STS } from 'aws-sdk';

export const awsConfigLoader = async () => {
// Uncomment below lines when working in local
  const env = getArgument('env');

  // const credentials = new SharedIniFileCredentials({ profile:  awsSecretDetails.profile });
  // config.credentials = credentials;
  const roleToAssume = {
    RoleArn: awsSecretDetails[env].roleArn,
    RoleSessionName: awsSecretDetails.roleSessionName,
    DurationSeconds: awsSecretDetails.durationSeconds
  };

  /* Create the STS service object */
  const sts = new STS({ apiVersion: awsSecretDetails.apiVersion });

  /* Assume Role */
  sts.assumeRole(roleToAssume, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err, err.stack);
    }
    else {
      config.update({
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      });
    }
  });
};
