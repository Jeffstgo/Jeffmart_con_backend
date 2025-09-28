import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { favoritesApi } from "../services/favorites";

export default function Favorites() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await favoritesApi.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await favoritesApi.removeFromFavorites(productId);
      setFavorites(favorites.filter(fav => fav.productId !== productId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      alert('Error al eliminar de favoritos');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.productId);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error al agregar al carrito');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
            <p>Error: {error}</p>
            <button 
              onClick={loadFavorites}
              className="mt-2 btn-primary text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <FaHeart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">
                No tienes favoritos aún
              </h2>
              <p className="text-gray-400 mb-6">
                Agrega productos a tus favoritos para verlos aquí
              </p>
              <Link
                to="/categories"
                className="btn-primary inline-block"
              >
                Explorar Productos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.productId}
                className="bg-dark border border-border rounded-lg overflow-hidden hover:border-primary/50 transition group"
              >
                <div className="relative">
                  <Link to={`/product/${favorite.productId}`}>
                    <img
                      src={favorite.image}
                      alt={favorite.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  

                  <button
                    onClick={() => handleRemoveFromFavorites(favorite.productId)}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition opacity-90"
                    title="Eliminar de favoritos"
                  >
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <Link 
                    to={`/product/${favorite.productId}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-white mb-2 hover:text-primary transition line-clamp-2">
                      {favorite.title}
                    </h3>
                  </Link>
                  
                  <p className="text-primary font-bold text-lg mb-3">
                    ${favorite.price}
                  </p>

                  <button
                    onClick={() => handleAddToCart(favorite)}
                    className="w-full btn-primary py-2 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
