import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "../services/products";
import { categoriesApi } from "../services/categories";

export default function CategoryDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.listProducts(),
          categoriesApi.listCategories()
        ]);

        const categories = Array.isArray(categoriesResponse) ? categoriesResponse : (categoriesResponse.items || categoriesResponse.data || []);
        const category = categories.find(cat => cat.slug === id);
        
        if (!category) {
          setError('Categoría no encontrada');
          return;
        }

        setCategoryName(category.name);

        const products = productsResponse.items || [];
        const filtered = products.filter((p) => p.category && p.category.id === category.id);
        setProducts(filtered);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text max-w-6xl mx-auto px-6 py-10">
        <div className="text-center">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-text max-w-6xl mx-auto px-6 py-10">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">{categoryName || id}</h1>

      {products.length === 0 ? (
        <p className="text-muted">
          No hay productos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card flex flex-col justify-between text-center p-6 rounded-lg bg-dark border border-border shadow"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
                />
              </Link>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-primary font-bold mt-2">${product.price}</p>
              </div>
              <Link
                to={`/product/${product.id}`}
                className="btn-primary w-full mt-4 text-center block"
              >
                Ver Detalle
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
