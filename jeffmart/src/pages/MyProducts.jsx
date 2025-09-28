import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { productsApi } from "../services/products";

export default function MyProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    
    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.getMyProducts();
        const productList = response.items || response.data || [];
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching my products:', err);
        setError('No se pudieron cargar tus productos');
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [user]);

  const handleDelete = async (productId, productTitle) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${productTitle}"?`)) {
      return;
    }

    try {
      await productsApi.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      alert('Producto eliminado correctamente');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar el producto');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso requerido</h1>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para ver tus productos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Cargando tus productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text">Mis Publicaciones</h1>
          <Link
            to="/ads/create"
            className="btn-primary px-6 py-2"
          >
            + Crear Producto
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl mb-6">Aún no has publicado ningún producto</p>
            <Link
              to="/ads/create"
              className="btn-primary px-8 py-3 text-lg"
            >
              Crear tu primer producto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-lg"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary text-xl font-bold">
                      ${product.price}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/ads/edit/${product.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-center text-sm transition"
                    >
                      Editar
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
