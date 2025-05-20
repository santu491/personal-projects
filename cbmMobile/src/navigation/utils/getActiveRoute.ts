import { NavigationState, PartialRoute } from '@react-navigation/native';

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

type NavigationRoute = ArrayElement<NavigationState['routes']>;

export const getNestedActiveRoute = (
  route: NavigationRoute | PartialRoute<NavigationRoute>
): NavigationRoute | PartialRoute<NavigationRoute> => {
  const { routes, index } = route.state ?? {};
  if (!routes || index === undefined) {
    return route;
  }

  return getNestedActiveRoute(routes[index]);
};

export const getActiveRoute = (navState: NavigationState): NavigationRoute | PartialRoute<NavigationRoute> => {
  const route: NavigationRoute = navState.routes[navState.index];
  return getNestedActiveRoute(route);
};
