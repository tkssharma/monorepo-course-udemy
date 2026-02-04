import React from 'react';
import ProductCard from './ProductCard';

const products = [
  { id: 1, name: 'Laptop', price: 999, image: '💻' },
  { id: 2, name: 'Headphones', price: 199, image: '🎧' },
  { id: 3, name: 'Keyboard', price: 149, image: '⌨️' },
  { id: 4, name: 'Mouse', price: 79, image: '🖱️' },
];

const ProductList: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Products (Remote Module from port 3001)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
