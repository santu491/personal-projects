/* eslint-disable no-console */
import { awsSecretDetails } from '@anthem/communityapi/common';
import { getArgument } from '@anthem/communityapi/utils';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';

const env = getArgument('env');

export const awsConfigLoader = async () => {
  try {
    /**
     *  Uncomment below 2 commented lines when working in local (17 & 18)
     *  Also before running the app make sure to export the certs.
     *  => export NODE_EXTRA_CA_CERTS=certs/wellpointinternalca-bundle.pem
     *  Use the local config to create any aws client.
     */

    const roleToAssume = {
      RoleArn: awsSecretDetails[env].roleArn,
      RoleSessionName: awsSecretDetails.roleSessionName,
      DurationSeconds: awsSecretDetails.durationSeconds
    };

    /* Create the STS service object */
    const lowerEnv = ['sit', 'sit1', 'sit2', 'dev', 'dev1', 'dev2'];
    const region = lowerEnv.includes(env) ? awsSecretDetails.region2 : awsSecretDetails.region1;
    const sts = new STSClient({ apiVersion: awsSecretDetails.apiVersion, region: region });

    /* Assume Role */
    const command = new AssumeRoleCommand(roleToAssume);
    const roleData = await sts.send(command);

    console.log('Role Data:', roleData);

    return {
      region: region,
      credentials: {
        accessKeyId: roleData.Credentials.AccessKeyId,
        secretAccessKey: roleData.Credentials.SecretAccessKey,
        sessionToken: roleData.Credentials.SessionToken
      }
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
