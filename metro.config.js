// In metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.resolverMainFields = ['browser', 'module', 'main'];

module.exports = defaultConfig;
