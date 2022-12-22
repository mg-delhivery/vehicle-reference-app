const path = require('path');

const { whenProd, whenDev } = require('@craco/craco');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

const getLocalHostProxyDomain = () => {
  if (process.env.TENANT_URL) {
    const tenantUrl = process.env.TENANT_URL;
    const domainParts = tenantUrl.replace('https://', '').split('.');
    domainParts[0] = domainParts[0] + '-cdev';
    return domainParts.join('.');
  } else {
    return 'alpha-cdev.preprod.fxtrt.io';
  }
};

module.exports = {
  plugins: [
    {
      plugin: require('./craco-plugins/module-federation'),
    },
  ],
  typescript: whenDev(() => ({
    enableTypeChecking: false,
  })),
  postcss: {
    mode: 'extends',
    plugins: [tailwindcss, autoprefixer],
  },
  webpack: whenProd(() => ({
    configure: (webpackConfig, { paths }) => {
      paths.appBuild = webpackConfig.output.path = path.resolve(
        __dirname,
        'dist'
      );
      return webpackConfig;
    },
  })),
  devServer: {
    port: 8082,
    historyApiFallback: true,
    host: getLocalHostProxyDomain(),
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
