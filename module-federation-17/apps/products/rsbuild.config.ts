import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3001,
  },
  dev: {
    assetPrefix: 'http://localhost:3001',
  },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'products',
          filename: 'remoteEntry.js',
          exposes: {
            './ProductList': './src/ProductList.tsx',
            './ProductCard': './src/ProductCard.tsx',
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
