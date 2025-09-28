import { http } from "./http";

async function getCart() {
  const { data } = await http.get("/cart");
  return data;
}

async function addToCart(productId, quantity = 1) {
  const { data } = await http.post("/cart/add", { productId, quantity });
  return data;
}

async function updateQuantity(productId, quantity) {
  const { data } = await http.put("/cart/update", { productId, quantity });
  return data;
}

async function removeFromCart(productId) {
  const { data } = await http.delete(`/cart/remove/${productId}`);
  return data;
}

async function clearCart() {
  const { data } = await http.delete("/cart/clear");
  return data;
}

export const cartApi = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
};

export { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
