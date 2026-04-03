const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Merge with our custom config
const config = mergeConfig(defaultConfig, {
  resolver: {
    // Add tflite to asset extensions
    assetExts: [...defaultConfig.resolver.assetExts, 'tflite'],
  },
});

module.exports = config;