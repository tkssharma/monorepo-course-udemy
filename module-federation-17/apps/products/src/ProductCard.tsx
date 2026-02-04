import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = () => {
    // Dispatch custom event for cross-app communication
    window.dispatchEvent(
      new CustomEvent('add-to-cart', { detail: product })
    );
    alert(`${product.name} added to cart!`);
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem' }}>{product.image}</div>
      <h3>{product.name}</h3>
      <p style={{ color: '#666' }}>${product.price}</p>
      <button
        onClick={addToCart}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
