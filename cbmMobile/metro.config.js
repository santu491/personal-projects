const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts: defaultSourceExts, assetExts: defaultAssetExts },
} = defaultConfig;

// import svgs as components
const babelTransformerPath = require.resolve('react-native-svg-transformer');
const assetExts = defaultAssetExts.filter((ext) => ext !== 'svg');
const sourceExts = [
  ...defaultSourceExts,
  'd.ts',
  'svg',
  'mjs', // storybook
  'js', // add js to sourceExts
];

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    babelTransformerPath,
    minifierPath: require.resolve('metro-minify-terser'),
  },
  resolver: {
    assetExts,
    sourceExts,
  },
};

module.exports = mergeConfig(defaultConfig, config);
