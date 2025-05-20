import { getNestedActiveRoute } from '../getActiveRoute';

describe('getNestedActiveRoute', () => {
  it('should return the same route if there is no nested state', () => {
    const route = { key: 'route1', name: 'Route1' };
    const result = getNestedActiveRoute(route);
    expect(result).toBe(route);
  });

  it('should return the nested active route', () => {
    const nestedRoute = { key: 'route2', name: 'Route2' };
    const route = {
      key: 'route1',
      name: 'Route1',
      state: {
        index: 0,
        routes: [nestedRoute],
      },
    };
    const result = getNestedActiveRoute(route);
    expect(result).toBe(nestedRoute);
  });

  it('should return the deeply nested active route', () => {
    const deeplyNestedRoute = { key: 'route3', name: 'Route3' };
    const route = {
      key: 'route1',
      name: 'Route1',
      state: {
        index: 0,
        routes: [
          {
            key: 'route2',
            name: 'Route2',
            state: {
              index: 0,
              routes: [deeplyNestedRoute],
            },
          },
        ],
      },
    };
    const result = getNestedActiveRoute(route);
    expect(result).toBe(deeplyNestedRoute);
  });

  it('should return the same route if index is undefined', () => {
    const route = {
      key: 'route1',
      name: 'Route1',
      state: {
        routes: [{ key: 'route2', name: 'Route2' }],
      },
    };
    const result = getNestedActiveRoute(route);
    expect(result).toBe(route);
  });
});
