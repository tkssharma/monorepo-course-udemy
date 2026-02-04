import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Lazy load remote modules
const ProductList = React.lazy(() => import('products/ProductList'));
const Cart = React.lazy(() => import('cart/Cart'));

const Navigation: React.FC = () => (
  <nav style={{ padding: '1rem', backgroundColor: '#333', color: 'white' }}>
    <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
    <Link to="/products" style={{ color: 'white', marginRight: '1rem' }}>Products</Link>
    <Link to="/cart" style={{ color: 'white' }}>Cart</Link>
  </nav>
);

const Home: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Welcome to Module Federation Demo</h1>
    <p>This shell app loads micro-frontends from different ports:</p>
    <ul>
      <li>Products app (port 3001)</li>
      <li>Cart app (port 3002)</li>
    </ul>
  </div>
);

const Loading: React.FC = () => (
  <div style={{ padding: '2rem' }}>Loading remote module...</div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
