import {config, STS} from 'aws-sdk';
import {APP} from './utils/app';

export const awsConfigLoader = async () => {
  const awsDetails = APP.config.awsDetails;
  // Uncomment below lines when working in local

  // const credentials = new SharedIniFileCredentials({
  //   profile: awsDetails.profile,
  // });
  // config.credentials = credentials;
  const roleToAssume = {
    RoleArn: awsDetails.roleArn,
    RoleSessionName: awsDetails.roleSessionName,
    DurationSeconds: awsDetails.durationSeconds,
  };

  /* Create the STS service object */
  const sts = new STS({apiVersion: awsDetails.apiVersion});

  /* Assume Role */
  sts.assumeRole(roleToAssume, (err, data) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err, err.stack);
    } else {
      config.update({
        accessKeyId: data?.Credentials?.AccessKeyId,
        secretAccessKey: data?.Credentials?.SecretAccessKey,
        sessionToken: data?.Credentials?.SessionToken,
      });
    }
  });
};
