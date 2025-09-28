import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { productsApi } from "../services/products";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await productsApi.listProducts({ limit: 12 });
      const offersData = (data.items || []).map((p) => ({
        ...p,
        oldPrice: (parseFloat(p.price) + 200).toFixed(2),
        newPrice: p.price,
      }));
      setOffers(offersData);
    } catch (err) {
      console.error('Error loading offers:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-text px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Ofertas Especiales</h1>
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando ofertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-text px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Ofertas Especiales</h1>
      <p className="text-muted mb-8">
        Aprovecha los descuentos disponibles solo por tiempo limitado.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((product) => (
          <div
            key={product.id}
            className="card flex flex-col justify-between text-center"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-semibold">{product.title}</h2>

            <div className="mt-2">
              <span className="text-muted line-through mr-2">
                ${product.oldPrice}
              </span>
              <span className="text-primary font-bold">
                ${product.newPrice}
              </span>
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
    </div>
  );
}
