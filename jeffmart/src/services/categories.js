import { http } from "./http";

async function listCategories() {
  const { data } = await http.get("/categories");
  return data;
}

export const categoriesApi = {
  listCategories
};

export { listCategories };
