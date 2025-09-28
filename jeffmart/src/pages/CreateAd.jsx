import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { productsApi } from "../services/products";
import { categoriesApi } from "../services/categories";

export default function CreateAd() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesApi.listCategories();
        const cats = Array.isArray(response) ? response : (response.items || response.data || []);
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Debes iniciar sesión para crear un producto");
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
        stock: 10
      };

      await productsApi.createProduct(productData);
      alert("Producto creado correctamente 🚀");
      navigate("/");
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Error al crear el producto. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso requerido</h1>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para crear un producto</p>
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

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Crear un anuncio
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

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="price">
              Precio
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Ej: 499"
              className="input w-full"
              required
            />
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

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-2 text-lg disabled:opacity-50"
          >
            {loading ? "Creando..." : "Publicar anuncio"}
          </button>
        </form>
      </div>
    </div>
  );
}
