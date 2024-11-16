///////////////////////////////////////////////////////////////////////////////////

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }
      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCartItems(data.items || []);
      const count = (data.items || []).reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      setCartItemsCount(count);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchCartItemsCount = async () => {
    await fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }
      const response = await fetch(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }

      const response = await fetch("http://localhost:5000/api/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear cart");
      }

      setCartItems([]);
      setCartItemsCount(0);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }
      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        fetchCartItemsCount,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
