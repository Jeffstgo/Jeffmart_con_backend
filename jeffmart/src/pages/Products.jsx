import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "../services/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsApi.listProducts();
        let productList = response.items || [];
        
        if (searchTerm) {
          productList = productList.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        setProducts(productList);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {searchTerm ? `Resultados para "${searchTerm}"` : 'Productos'}
      </h1>
      {searchTerm && (
        <p className="text-gray-600 mb-4">
          {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{product.title}</h2>
            <p className="text-gray-600 mt-2">Precio: ${product.price}</p>
            <Link
              to={`/product/${product.id}`}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
