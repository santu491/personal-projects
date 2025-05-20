/* eslint-disable @typescript-eslint/naming-convention */
import { PathConfig } from '@react-navigation/native';

import { lowerPathsRecursive } from '../lowerPathsRecursive';

describe('lowerPathsRecursive', () => {
  it('should return the same config if no screens are present', () => {
    const config: PathConfig<{}> = {};
    const result = lowerPathsRecursive(config);
    expect(result).toEqual(config);
  });

  it('should convert all screen paths to lowercase', () => {
    const config: PathConfig<{}> = {
      screens: {
        Home: 'HOME',
        Profile: 'PROFILE',
        Settings: 'SETTINGS',
      },
    };
    const expectedConfig: PathConfig<{}> = {
      screens: {
        Home: 'home',
        Profile: 'profile',
        Settings: 'settings',
      },
    };
    const result = lowerPathsRecursive(config);
    expect(result).toEqual(expectedConfig);
  });

  it('should handle nested screen paths', () => {
    const config: PathConfig<{}> = {
      screens: {
        Home: 'HOME',
        Profile: {
          screens: {
            UserProfile: 'USER_PROFILE',
            EditProfile: 'EDIT_PROFILE',
          },
        },
        Settings: 'SETTINGS',
      },
    };
    const expectedConfig: PathConfig<{}> = {
      screens: {
        Home: 'home',
        Profile: {
          screens: {
            UserProfile: 'user_profile',
            EditProfile: 'edit_profile',
          },
        },
        Settings: 'settings',
      },
    };
    const result = lowerPathsRecursive(config);
    expect(result).toEqual(expectedConfig);
  });

  it('should throw an error if a screen is undefined', () => {
    const config: PathConfig<{}> = {
      screens: {
        Home: 'HOME',
        Profile: undefined,
      },
    };
    expect(() => lowerPathsRecursive(config)).toThrow('unexpected PathConfig');
  });
});
