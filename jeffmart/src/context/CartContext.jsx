import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import * as cartApi from "../services/cart";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { 
      setItems([]); 
      setCartId(null); 
      return; 
    }
    setLoading(true);
    try {
      const snap = await cartApi.getCart();
      setCartId(snap.cartId || null);
      setItems(snap.items || []);
    } catch {
      setItems([]);
      setCartId(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const add = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) throw new Error("LOGIN_REQUIRED");
    try {
      const snap = await cartApi.addToCart(productId, quantity);
      setCartId(snap.cartId || null);
      setItems(snap.items || []);
      return snap;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const remove = useCallback(async (productId) => {
    if (!isAuthenticated) throw new Error("LOGIN_REQUIRED");
    try {
      const snap = await cartApi.removeFromCart(productId);
      setCartId(snap.cartId || null);
      setItems(snap.items || []);
      return snap;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const cart = items;
  const addToCart = useCallback((productOrId) => {
    const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
    return add(productId, 1);
  }, [add]);
  const removeFromCart = useCallback((productId) => remove(productId), [remove]);

  useEffect(() => { refresh(); }, [refresh]);

  const total = useMemo(() => items.reduce((acc, it) => acc + Number(it.subtotal || 0), 0), [items]);
  const count = useMemo(() => items.reduce((acc, it) => acc + Number(it.quantity || 0), 0), [items]);

  const fetchCart = refresh;
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!isAuthenticated) throw new Error("LOGIN_REQUIRED");
    try {
      const snap = await cartApi.updateQuantity(productId, quantity);
      setCartId(snap.cartId || null);
      setItems(snap.items || []);
      return snap;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) throw new Error("LOGIN_REQUIRED");
    try {
      await cartApi.clearCart();
      setItems([]);
      setCartId(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const clearItem = removeFromCart;
  const error = null;

  const value = { 
    cartId, items, cart, total, count, loading, error,
    refresh, fetchCart, add, remove, updateQuantity, clearCart, clearItem,
    addToCart, removeFromCart 
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
