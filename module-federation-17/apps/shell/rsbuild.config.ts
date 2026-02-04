import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3000,
  },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'shell',
          remotes: {
            products: 'products@http://localhost:3001/mf-manifest.json',
            cart: 'cart@http://localhost:3002/mf-manifest.json',
          },
          shared: {
            react: { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
            'react-router-dom': { singleton: true, eager: true },
          },
        }),
      ],
    },
  },
});
