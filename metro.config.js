/**
 * Metro configuration for Expo
 *
 * @format
 */

const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;

// Configure for SVG support
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
defaultConfig.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts = [...sourceExts, 'svg'];

module.exports = defaultConfig; 