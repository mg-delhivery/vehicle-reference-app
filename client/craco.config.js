const cracoModuleFederation = require('craco-module-federation');

const getLocalHostProxyDomain = () => {
  if (process.env.TENANT_URL) {
    const tenantUrl = process.env.TENANT_URL;
    const domainParts = tenantUrl.replace('https://', '').split('.');
    domainParts[0] = domainParts[0] + '-cdev';
    return domainParts.join('.');
  } else {
    return 'svvtdd4k5b-cdev.preprod.dlv2.fxtrt.io';
  }
};

module.exports = {
  plugins: [
    {
      plugin: require('./craco-plugins/module-federation'),
    },
  ],
  devServer: {
    port: 8082,
    historyApiFallback: true,
    host: getLocalHostProxyDomain(),
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:5000',
    //     pathRewrite: { '^/api': '' },
    //   },
    // },
  },
};
