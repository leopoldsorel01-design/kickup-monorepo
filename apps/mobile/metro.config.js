const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');

const root = path.resolve(__dirname, '../..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [root],
    resolver: {
        extraNodeModules: {
            'react': path.resolve(root, 'node_modules/react'),
            'react-native': path.resolve(root, 'node_modules/react-native'),
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
