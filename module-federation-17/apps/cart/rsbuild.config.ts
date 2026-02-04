import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3002,
  },
  dev: {
    assetPrefix: 'http://localhost:3002',
  },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'cart',
          filename: 'remoteEntry.js',
          exposes: {
            './Cart': './src/Cart.tsx',
          },
          shared: {
            react: { singleton: true },
            'react-dom': { singleton: true },
            'react-router-dom': { singleton: true },
          },
        }),
      ],
    },
  },
});
