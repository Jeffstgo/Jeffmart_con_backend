
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoriesApi } from "../services/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryImages = {
    "electronica": "/images/categorias/Electronica.png",
    "moda": "/images/categorias/Moda.png", 
    "hogar": "/images/categorias/Hogar.png",
    "deportes": "/images/categorias/Deportes.png",
    "juguetes": "/images/categorias/Juguetes.png",
    "automoviles": "/images/categorias/Automoviles.png",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoriesApi.listCategories();
        const categories = Array.isArray(response) ? response : (response.items || response.data || []);
        const categoriesWithImages = categories.map(cat => ({
          ...cat,
          image: categoryImages[cat.slug] || "/images/categorias/Electronica.png"
        }));
        setCategories(categoriesWithImages);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('No se pudieron cargar las categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text px-6 py-10">
        <div className="text-center">Cargando categorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-text px-6 py-10">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Categorías</h1>
      <p className="text-muted mb-8">
        Explora productos organizados por categoría.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.slug}`}
            className="bg-dark-2 border border-dark-4 rounded-xl cursor-pointer hover:shadow-2xl transition flex flex-col items-center p-8 min-h-[340px]"
            style={{ minWidth: '320px' }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-56 object-cover rounded-xl mb-6"
              onError={e => { e.target.src = '/images/categorias/Electronica.png'; }}
            />
            <h2 className="text-2xl font-bold mt-auto mb-2 text-center">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
