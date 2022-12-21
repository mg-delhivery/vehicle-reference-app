const deps = require('./package.json').dependencies;
const { HEADER_URL } = require('consoleui-library');

module.exports = {
  name: 'vehiclesDemo',
  remotes: {
    header: HEADER_URL,
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps['react'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
    luxon: {
      singleton: true,
      requiredVersion: deps['luxon'],
    },
  },
};
