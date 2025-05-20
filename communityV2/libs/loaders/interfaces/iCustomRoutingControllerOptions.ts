import { GraphQLSchema } from 'graphql';
import { RoutingControllersOptions } from 'routing-controllers';

export interface ICustomRoutingControllerOptions extends RoutingControllersOptions {
  graphqlSchema?: GraphQLSchema;
  graphqlRoute?: string;
}
