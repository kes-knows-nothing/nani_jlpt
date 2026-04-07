// @ts-check
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { withNativeWind } = require(
  path.join(__dirname, 'node_modules', 'nativewind', 'dist', 'metro', 'index.js')
);

module.exports = withNativeWind(config, { input: './global.css' });
