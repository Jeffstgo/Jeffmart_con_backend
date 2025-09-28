import { http } from "./http";

async function listProducts(params = {}) {
  const { q, category, limit = 12, offset = 0 } = params;
  const { data } = await http.get("/products", {
    params: { q, category, limit, offset },
  });
  return data;
}

async function getProductById(id) {
  const { data } = await http.get(`/products/${id}`);
  return data;
}

async function createProduct(payload) {
  const { data } = await http.post("/products", payload);
  return data;
}

async function getMyProducts() {
  const { data } = await http.get("/products/my");
  return data;
}

async function deleteProduct(id) {
  const { data } = await http.delete(`/products/${id}`);
  return data;
}

async function updateProduct(id, payload) {
  const { data } = await http.put(`/products/${id}`, payload);
  return data;
}

export const productsApi = {
  listProducts,
  getProductById,
  createProduct,
  getMyProducts,
  deleteProduct,
  updateProduct
};

export { listProducts, getProductById, createProduct, getMyProducts, deleteProduct, updateProduct };
