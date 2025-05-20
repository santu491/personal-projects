import { SpringCloudConfigClient } from '@anthem/communityapi/common';
import { getApiArgument } from '@anthem/communityapi/utils';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import Container from 'typedi';

export const configLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  const configClient: SpringCloudConfigClient = Container.get(SpringCloudConfigClient);
  configClient.init(getApiArgument('api'), getApiArgument('env'));
};
