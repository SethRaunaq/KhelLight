const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events'),
  http: require.resolve('react-native-http'),
  crypto: require.resolve('react-native-crypto'),
  https: require.resolve('react-native-https'),
  net: require.resolve('react-native-tcp-socket'),
  tls: require.resolve('react-native-tcp-socket'),
  zlib: require.resolve('pako'),
  url: require.resolve('react-native-url-polyfill'),
};

module.exports = defaultConfig;
