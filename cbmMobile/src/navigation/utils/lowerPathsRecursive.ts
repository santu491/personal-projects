import { PathConfig } from '@react-navigation/native';

export function lowerPathsRecursive<U extends Record<string, unknown>, T extends PathConfig<U>>(config: T) {
  if (!config.screens) {
    return config;
  }
  const screens = config.screens;

  const lowerPathsScreens = { ...screens };
  for (const key in lowerPathsScreens) {
    const screen = lowerPathsScreens[key];
    if (!screen) {
      console.error({ config });
      throw new Error('unexpected PathConfig');
    }
    lowerPathsScreens[key] = (
      typeof screen === 'string' ? screen.toLowerCase() : lowerPathsRecursive(screen)
    ) as (typeof lowerPathsScreens)[typeof key];
  }

  return {
    ...config,
    screens: lowerPathsScreens,
  };
}
