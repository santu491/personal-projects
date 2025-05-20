import {config, STS} from 'aws-sdk';
import {awsConfigLoader} from './awsConfigLoader';
import {APP} from './utils/app';

jest.mock('aws-sdk', () => ({
  config: {
    credentials: null,
    update: jest.fn(),
  },
  STS: jest.fn().mockImplementation(() => ({
    assumeRole: jest.fn().mockImplementationOnce((roleToAssume, callback) => {
      callback(null, {
        Credentials: {
          AccessKeyId: 'accessKeyId',
          SecretAccessKey: 'secretAccessKey',
          SessionToken: 'sessionToken',
        },
      });
    }),
  })),
  SharedIniFileCredentials: jest.fn(),
}));

beforeEach(() => {
  APP.config.awsDetails = {
    roleArn: 'arn:aws:iam::xxxxx:role/slvr-sydcom-devrole',
    profile: 'slvr-sydcom',
    roleSessionName: 'session1',
    durationSeconds: 900,
    apiVersion: 'latest',
    region: 'us-east-2',
    iosArn: 'arn:aws:sns:us-east-1:xxxxx:app/APNS/carelon-ios-dev1',
    notificationQueue: '',
  };
});

describe('awsConfigLoader', () => {
  it('should load AWS config', async () => {
    await awsConfigLoader();

    // expect(SharedIniFileCredentials).toHaveBeenCalled();
    expect(STS).toHaveBeenCalled();
    expect(config.update).toHaveBeenCalledWith({
      accessKeyId: 'accessKeyId',
      secretAccessKey: 'secretAccessKey',
      sessionToken: 'sessionToken',
    });
  });

  it('should load AWS config: Error', async () => {
    await awsConfigLoader();

    jest.mock('aws-sdk', () => ({
      STS: jest.fn().mockImplementationOnce(() => ({
        assumeRole: jest
          .fn()
          .mockImplementationOnce((roleToAssume, callback) => {
            callback(true, null);
          }),
      })),
      SharedIniFileCredentials: jest.fn(),
    }));
    // expect(SharedIniFileCredentials).toHaveBeenCalled();
    expect(STS).toHaveBeenCalled();
  });
});
