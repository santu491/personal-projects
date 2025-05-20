import crypto from 'crypto';
import { NativeModules, PixelRatio, Platform, Text } from 'react-native';
import mockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler.js';

global.window = global;

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

jest.mock('react-native-modal', () => 'react-native-modal');

jest.mock('react-native/Libraries/Utilities/BackHandler', () => mockBackHandler);

jest.useFakeTimers();

jest.mock('react-native-push-notification', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    requestPermissions: jest.fn(),
    configure: jest.fn(),
    setApplicationIconBadgeNumber: jest.fn(),
  };
});

jest.mock('react-native-ssl-public-key-pinning', () => ({
  disableSslPinning: jest.fn().mockResolvedValue(),
  addSslPinningErrorListener: jest.fn().mockResolvedValue(),
  initializeSslPinning: jest.fn().mockResolvedValue(),
}));

jest.mock('@sydney/motif-components', () => '@sydney/motif-components');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-device-info', () => {
  return {
    getVersion: jest.fn().mockReturnValue('1.0.0'),
    getSystemVersion: jest.fn().mockReturnValue('10.1'),
    hasNotch: () => jest.fn(),
    getDeviceType: jest.fn().mockReturnValue('Tablet'),
  };
});

jest.mock('@react-navigation/stack', () => {
  return {
    createStackNavigator: () => jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => jest.fn(),
  };
});

jest.mock('react-native-modal', () => {
  return {
    isVisible: () => true,
  };
});

jest.mock('react-native/Libraries/LogBox/LogBox');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: jest.fn(),
  };
});

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useIsFocused: () => true,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      goBack: jest.fn(),
      useState: jest.fn(),
      isFocused: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      canGoBack: jest.fn(),
    }),
    useRoute: () => jest.fn(),
    NavigationContainer: () => '',
    getStateFromPath: () => jest.fn(),
  };
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  const WebView = (props) => <View {...props} />;
  return {
    WebView,
    default: WebView,
    __esModule: true,
  };
});

jest.mock(
  '@react-navigation/core',
  () => {
    const { useEffect } = require('react');

    let params = undefined;

    const mockNavigation = {
      addListener: jest.fn(),
      dispatch: jest.fn(),
      goBack: jest.fn(),
      navigate: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      setOptions: jest.fn(),
      setParams: jest.fn().mockImplementation((newParams) => {
        if (!params) {
          params = newParams;
        } else {
          Object.assign(params, newParams);
        }
      }),
    };
    const mockRoute = {
      key: 'mock-route-key',
      name: 'mock-route-name',
      get params() {
        return params;
      },
    };
    return {
      useFocusEffect: jest.fn().mockImplementation((fn) => useEffect(fn, [fn])),
      useNavigation: jest.fn().mockImplementation(() => mockNavigation),
      useRoute: jest.fn().mockImplementation(() => mockRoute),
      useIsFocused: jest.fn().mockReturnValue(true),
    };
  },
  { virtual: true }
);

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
}));

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: () => jest.fn(),
  };
});

// ensure window is set, needed for react-hook-form
global.window = global;

NativeModules.RNGestureHandlerModule = {
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
  State: {},
  Direction: {},
};

NativeModules.MotifAccessibility = {
  getAccessibilityLabel: jest.fn().mockImplementation(async () => 'mocked accessibility label'),
};

NativeModules.RNAccessibilityWrapperManager = {
  setAccessibilityFields: jest.fn(),
};

PixelRatio.getFontScale = jest.fn(() => 1);
Platform.OS = 'ios';
Platform.select = (opts) => opts[Platform.OS] ?? opts.native ?? opts.default;

jest.mock('react-native/Libraries/Utilities/Platform', () => {
  let platform = {
    OS: 'ios',
  };

  const select = jest.fn().mockImplementation((obj) => {
    const value = obj[platform.OS];
    return !value ? obj.default : value;
  });

  platform.select = select;

  return platform;
});

jest.mock('react-native-modal', () => 'Modal');
jest.mock('@react-native-community/push-notification-ios', () => ({
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
}));

jest.mock('react-native-date-picker');

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: () => {
      return {
        top: jest.fn(),
        left: jest.fn(),
        right: jest.fn(),
        bottom: jest.fn(),
      };
    },
  };
});

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  useNetInfo: jest.fn().mockReturnValue({ isConnected: true }),
}));

jest.mock('jail-monkey', () => jest.fn(() => ({ isJailBroken: false })));

jest.mock('@sydney/motif-components', () => {
  const { TouchableOpacity, Text, TextInput } = jest.requireActual('react-native');
  return {
    Drawer: ({ children }) => <>{children}</>,
    Radio: ({ children }) => <>{children}</>,
    Field: ({ children }) => <>{children}</>,
    Select: ({ children }) => <>{children}</>,
    TextInput: jest.fn((props) => {
      return <TextInput {...props} />;
    }),
    InputScroll: ({ children }) => <>{children}</>,
    Input: ({ children }) => <>{children}</>,
    Selector: ({ children }) => <>{children}</>,
    Button: ({ onPress, title, children, testID }) => (
      <TouchableOpacity onPress={onPress} testID={testID}>
        <Text>{title || children}</Text>
      </TouchableOpacity>
    ),
    Accordion: ({ children }) => <>{children}</>,
    CheckBox: ({ children }) => <>{children}</>,
    useAccessibility: jest.fn(() => ({
      setAccessibilityFocus: jest.fn(),
    })),
  };
});

// @sydney/motif-components
NativeModules.RNAccessibilityWrapperManager = {
  setAccessibilityFields: jest.fn(),
};

jest.mock('react-native-keychain', () => {
  const actualKeychain = jest.requireActual('react-native-keychain');
  const store = {};
  return {
    ...actualKeychain,
    setGenericPassword: jest.fn((username, password, { service }) =>
      Promise.resolve((store[service] = { username, password, service }))
    ),
    getGenericPassword: jest.fn(({ service = '' } = {}) => (store[service] ? store[service] : false)),
    resetGenericPassword: jest.fn(({ service }) => delete store[service]),
  };
});

jest.mock('react-native-elements', () => ({
  Image: jest.fn(() => <></>),
  Button: jest.fn(() => <></>),
  Text: jest.fn(() => <></>),
}));

jest.mock('react-native-autocomplete-dropdown', () => ({
  AutocompleteDropdownContextProvider: ({ children }) => <>{children}</>,
  AutocompleteDropdown: jest.fn(() => null),
}));

jest.mock('@react-native-community/netinfo', () => ({
  configure: jest.fn(),
}));

NativeModules.SettingsManager = {
  settings: {
    AppleLocale: 'en_US',
    AppleLanguages: ['en'],
  },
};

NativeModules.FileReaderModule = {
  readFile: jest.fn().mockResolvedValue('mocked file content'),
};

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  return {
    ...originalModule,
    Controller: ({ render }) =>
      render({
        field: {
          onChange: jest.fn(),
          onBlur: jest.fn(),
          value: '',
        },
        fieldState: {
          invalid: false,
          isTouched: false,
          isDirty: false,
          error: 'no error',
        },
      }),
  };
});

jest.mock('react-native-keychain');

jest.mock('crypto-js');

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    BottomTabBar: jest.fn(),
  };
});

NativeModules.NativeSettingsManager = {
  getConstants: jest.fn(),
};

jest.mock('react-native-network-logger', () => ({
  startNetworkLogging: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  useNetInfo: jest.fn(),
  configure: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en', countryCode: 'US', languageTag: 'en_US', isRTL: false }]),
}));

jest.mock('@adobe/react-native-aepcore', () => ({
  MobileCore: {
    trackAction: (tag, params) => {},
    trackState: (tag, params) => {},
  },
}));
