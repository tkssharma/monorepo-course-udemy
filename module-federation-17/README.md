# Module 17: Module Federation - Micro-Frontends in Monorepos

## 🎬 Video Script

---

### INTRO (0:00 - 2:00)

Hey everyone, welcome back! I'm TK Sharma, and in this module, we're diving into one of the most exciting topics in modern frontend development - **Module Federation** and **Micro-Frontends**.

Have you ever worked on a massive frontend application where:

- Deployments take forever because everything is coupled?
- Teams step on each other's toes?
- One team's bug breaks the entire application?

Module Federation solves this by letting you **split your frontend into independently deployable pieces** that come together at runtime.

By the end of this video, you'll build a working micro-frontend e-commerce app with:

- A **Shell** app that hosts everything
- A **Products** app that can be deployed independently
- A **Cart** app that communicates across apps

Let's build it!

---

### PART 1: What is Module Federation? (2:00 - 6:00)

#### The Problem: Monolithic Frontends

```
Traditional SPA:
┌─────────────────────────────────────────┐
│           Single React App              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Header  │ │Products │ │  Cart   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  One build, one deploy, one team 😰    │
└─────────────────────────────────────────┘
```

Problems:

- **Slow builds** - Change one component, rebuild everything
- **Coupled deployments** - Products team waits for Cart team
- **Scaling issues** - Hard to split work across teams

#### The Solution: Micro-Frontends

```
Module Federation:
┌─────────────────────────────────────────────────┐
│                 Shell (Host)                     │
│           Loads remotes at runtime               │
└─────────────────────────────────────────────────┘
         ↓                    ↓
┌─────────────────┐  ┌─────────────────┐
│ Products Remote │  │   Cart Remote   │
│    Port 3001    │  │    Port 3002    │
│  Team: Catalog  │  │  Team: Checkout │
└─────────────────┘  └─────────────────┘
```

Each app:

- Has its own repo/folder
- Builds independently
- Deploys independently
- Shares common dependencies (React)

#### Key Concepts

| Term        | Definition                               |
| ----------- | ---------------------------------------- |
| **Host**    | The container app that loads remotes     |
| **Remote**  | An app that exposes modules              |
| **Exposes** | What a remote makes available            |
| **Shared**  | Dependencies shared to avoid duplication |

---

### PART 2: Setting Up the Project (6:00 - 12:00)

#### Project Structure

```
module-federation-17/
├── apps/
│   ├── shell/          # Host application (port 3000)
│   ├── products/       # Remote: Product catalog (port 3001)
│   └── cart/           # Remote: Shopping cart (port 3002)
├── packages/           # Shared code (optional)
├── package.json
└── pnpm-workspace.yaml
```

#### Using Rsbuild + Module Federation

We're using **Rsbuild** (Rspack's build tool) because it's:

- 10x faster than Webpack
- Drop-in replacement
- Better Module Federation support

#### Shell App Configuration

```typescript
// apps/shell/rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  server: { port: 3000 },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'shell',
          remotes: {
            // Load ProductList from products app
            products: 'products@http://localhost:3001/mf-manifest.json',
            // Load Cart from cart app
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
```

Key points:

- `remotes` - Where to load external modules from
- `shared` - React must be singleton (one instance)
- `eager` - Load immediately in host

#### Products Remote Configuration

```typescript
// apps/products/rsbuild.config.ts
export default defineConfig({
  server: { port: 3001 },
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'products',
          exposes: {
            // What we're sharing
            './ProductList': './src/ProductList.tsx',
            './ProductCard': './src/ProductCard.tsx',
          },
          shared: {
            react: { singleton: true },
            'react-dom': { singleton: true },
          },
        }),
      ],
    },
  },
});
```

---

### PART 3: Building the Shell (Host) (12:00 - 18:00)

#### Lazy Loading Remote Modules

```tsx
// apps/shell/src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Lazy load remote modules
const ProductList = React.lazy(() => import('products/ProductList'));
const Cart = React.lazy(() => import('cart/Cart'));

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
```

Important patterns:

- **React.lazy** - Load remote only when needed
- **Suspense** - Show loading state while fetching
- **Error Boundary** - Handle failed remote loads

#### Adding Error Boundaries

```tsx
class RemoteErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to load remote module. Is it running?</div>;
    }
    return this.props.children;
  }
}

// Usage
<RemoteErrorBoundary>
  <Suspense fallback={<Loading />}>
    <ProductList />
  </Suspense>
</RemoteErrorBoundary>;
```

---

### PART 4: Building the Remotes (18:00 - 25:00)

#### Products Remote

```tsx
// apps/products/src/ProductList.tsx
import React from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, name: 'Laptop', price: 999, image: '💻' },
  { id: 2, name: 'Headphones', price: 199, image: '🎧' },
];

const ProductList: React.FC = () => {
  return (
    <div>
      <h2>Products (from port 3001)</h2>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
```

#### Cross-App Communication

How do Products and Cart talk to each other? **Custom Events!**

```tsx
// In ProductCard.tsx - dispatch event
const addToCart = () => {
  window.dispatchEvent(
    new CustomEvent('add-to-cart', {
      detail: { id: 1, name: 'Laptop', price: 999 },
    }),
  );
};

// In Cart.tsx - listen for event
useEffect(() => {
  const handler = (e: CustomEvent) => {
    setItems((prev) => [...prev, e.detail]);
  };

  window.addEventListener('add-to-cart', handler);
  return () => window.removeEventListener('add-to-cart', handler);
}, []);
```

Other communication options:

- **Custom Events** - Simple, works everywhere
- **Shared State (Redux)** - Put store in shared
- **URL params** - For navigation
- **Pub/Sub** - For complex scenarios

---

### PART 5: Running the Demo (25:00 - 30:00)

#### Start All Apps

```bash
cd module-federation-17

# Install dependencies
pnpm install

# Start all apps in parallel
pnpm dev

# Or start individually
pnpm dev:shell     # http://localhost:3000
pnpm dev:products  # http://localhost:3001
pnpm dev:cart      # http://localhost:3002
```

#### Demo Flow

1. Open http://localhost:3000 (Shell)
2. Navigate to /products - **Loaded from port 3001!**
3. Click "Add to Cart" - **Event sent to Cart app**
4. Navigate to /cart - **Loaded from port 3002!**
5. See the item we added

#### What's Actually Happening

```
Browser loads Shell (port 3000)
          ↓
User clicks "Products"
          ↓
Shell fetches http://localhost:3001/mf-manifest.json
          ↓
Downloads ProductList chunk from port 3001
          ↓
Renders ProductList inside Shell
          ↓
User clicks "Add to Cart"
          ↓
CustomEvent dispatched
          ↓
Cart component (from port 3002) receives event
```

---

### PART 6: Production Considerations (30:00 - 35:00)

#### Deployment Strategies

```
Option 1: Same domain, different paths
https://myapp.com/            → Shell
https://myapp.com/remotes/products/  → Products
https://myapp.com/remotes/cart/      → Cart

Option 2: Different subdomains
https://shell.myapp.com/
https://products.myapp.com/
https://cart.myapp.com/

Option 3: CDN
https://cdn.myapp.com/shell/
https://cdn.myapp.com/products/
https://cdn.myapp.com/cart/
```

#### Dynamic Remote URLs

```tsx
// Don't hardcode URLs!
const getRemoteUrl = (name: string) => {
  const urls = {
    products: process.env.PRODUCTS_URL || 'http://localhost:3001',
    cart: process.env.CART_URL || 'http://localhost:3002',
  };
  return `${urls[name]}/mf-manifest.json`;
};
```

#### Versioning Strategy

```typescript
// In remote's package.json
{
  "name": "products",
  "version": "1.2.0"
}

// Expose version
exposes: {
  './ProductList': './src/ProductList.tsx',
  './version': './src/version.ts',  // export const version = '1.2.0'
}

// Shell can check version compatibility
const { version } = await import('products/version');
if (!isCompatible(version)) {
  showUpgradeWarning();
}
```

---

### HANDS-ON: Let's Run It! (35:00 - 40:00)

```bash
# Navigate to the module
cd module-federation-17

# Install all dependencies
pnpm install

# Start the development servers
pnpm dev

# Open in browser
# Shell:    http://localhost:3000
# Products: http://localhost:3001
# Cart:     http://localhost:3002
```

Try this:

1. Stop the Products app (`Ctrl+C` in that terminal)
2. Refresh the Shell - see the error boundary!
3. Start Products again - it recovers!

---

### OUTRO (40:00 - 41:00)

And that's Module Federation! You now know how to:

✅ **Split your frontend** into independently deployable pieces
✅ **Share dependencies** like React across apps
✅ **Communicate between** micro-frontends
✅ **Handle errors** gracefully when remotes are down

This is how companies like **Amazon**, **Spotify**, and **IKEA** build their massive frontends.

In the next module, we'll explore **Bun Workspaces** - the fastest JavaScript runtime with native monorepo support.

See you there!

---

## 📁 Files in This Module

```
module-federation-17/
├── apps/
│   ├── shell/                    # Host application
│   │   ├── src/
│   │   │   ├── App.tsx          # Main app with routing
│   │   │   └── index.tsx        # Entry point
│   │   ├── rsbuild.config.ts    # Module Federation config
│   │   └── package.json
│   ├── products/                 # Products remote
│   │   ├── src/
│   │   │   ├── ProductList.tsx  # Exposed component
│   │   │   └── ProductCard.tsx  # Exposed component
│   │   ├── rsbuild.config.ts
│   │   └── package.json
│   └── cart/                     # Cart remote
│       ├── src/
│       │   └── Cart.tsx         # Exposed component
│       ├── rsbuild.config.ts
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start all apps
pnpm dev

# Or individually
pnpm dev:shell     # http://localhost:3000
pnpm dev:products  # http://localhost:3001
pnpm dev:cart      # http://localhost:3002
```

## 📚 Resources

- [Module Federation Documentation](https://module-federation.io/)
- [Rsbuild](https://rsbuild.dev/)
- [Micro-Frontends](https://micro-frontends.org/)
