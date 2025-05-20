import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const iocLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

  /**
     * Setup routing-controllers to use typedi container.
     */
  routingUseContainer(Container);

};
