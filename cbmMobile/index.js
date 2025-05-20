import './src/init'; // Do required init stuff before anything else

import { AppRegistry, Text, TextInput } from 'react-native';

import { name as appName } from './app.json';
import { App } from './src/app';

// Disable console.log
if (!__DEV__) {
  console.log = () => {};
}

if (Text.defaultProps == null) {
  Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
}

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}

AppRegistry.registerComponent(appName, () => App);
