import React, { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Listen for add-to-cart events from other micro-frontends
    const handleAddToCart = (event: CustomEvent) => {
      const product = event.detail;
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    };

    window.addEventListener('add-to-cart', handleAddToCart as EventListener);
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart as EventListener);
    };
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Shopping Cart (Remote Module from port 3002)</h2>
      {items.length === 0 ? (
        <p>Your cart is empty. Go to Products to add items!</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ${item.price * item.quantity}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ marginLeft: '1rem', color: 'red', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Total: ${total}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
