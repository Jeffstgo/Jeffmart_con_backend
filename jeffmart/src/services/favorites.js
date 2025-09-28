import { http } from "./http";

async function getFavorites() {
  const { data } = await http.get("/favorites");
  return data;
}

async function addToFavorites(productId) {
  const { data } = await http.post("/favorites/add", { productId });
  return data;
}

async function removeFromFavorites(productId) {
  const { data } = await http.delete(`/favorites/remove/${productId}`);
  return data;
}

export const favoritesApi = {
  getFavorites,
  addToFavorites,
  removeFromFavorites
};

export { getFavorites, addToFavorites, removeFromFavorites };
