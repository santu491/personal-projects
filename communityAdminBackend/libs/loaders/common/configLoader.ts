import { SpringCloudConfigClient } from '@anthem/communityadminapi/common';
import { getApiArgument } from '@anthem/communityadminapi/utils';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import Container from 'typedi';

export const configLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  const configClient: SpringCloudConfigClient = Container.get(SpringCloudConfigClient);
  configClient.init(getApiArgument('api'), getApiArgument('env'));
};
