import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { productsApi } from "../services/products";
import { categoriesApi } from "../services/categories";

export default function EditProduct() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          productsApi.getProductById(id),
          categoriesApi.listCategories()
        ]);

        const product = productResponse;
        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price || "",
          category: product.category?.id || "",
          image: product.image || "",
          stock: product.stock || ""
        });

        const cats = Array.isArray(categoriesResponse) ? categoriesResponse : (categoriesResponse.items || categoriesResponse.data || []);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('No se pudo cargar el producto');
      } finally {
        setLoadingProduct(false);
      }
    };

    if (user && id) {
      loadData();
    }
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Debes iniciar sesión para editar productos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: parseInt(form.category),
        image: form.image,
        stock: parseInt(form.stock)
      };

      await productsApi.updateProduct(id, productData);
      alert("Producto actualizado correctamente 🚀");
      navigate("/my-products");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Error al actualizar el producto. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso requerido</h1>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para editar productos</p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="text-center">Cargando producto...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Editar Producto
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Título del producto
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: iPhone 14 Pro Max"
              className="input w-full"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe tu producto..."
              className="input w-full h-28 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="input w-full"
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="category"
            >
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image">
              Imagen (URL)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="input w-full"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/my-products")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary py-2 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
