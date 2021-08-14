const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;
module.exports = {
  entry: "./src/index.js",
  mode: 'development',
  devServer: {
    port: 8087,
  },
  devtool: 'cheap-module-source-map',
  module: {},
  plugins: [
    new ModuleFederationPlugin(
      {
        name: "libApp",
        filename: "remoteEntry.js",
        exposes: {
          ...Object.keys(deps).reduce((acc, cValue) => ({
            ...acc,
            [`./${cValue}`]: cValue,
          }), {}),
          './store': './src/store',
          './routes': './src/routes'
        },
        remotes: {
          Wrapper:
            'Wrapper@http://localhost:8086/remoteEntry.js',
          Page1:
            'Page1@http://localhost:8083/remoteEntry.js',
          Page2:
            'Page2@http://localhost:8084/remoteEntry.js',
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
          },
          "react-dom": {
            singleton: true,
          },
        },
      }
    )
  ],
};
