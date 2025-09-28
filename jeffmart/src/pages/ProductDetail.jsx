import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productsApi } from "../services/products";
import { favoritesApi } from "../services/favorites";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgType, setMsgType] = useState('success');
  const [msgText, setMsgText] = useState('');

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getProductById(id);
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkIfFavorite = useCallback(async () => {
    try {
      const favorites = await favoritesApi.getFavorites();
      setIsFavorite(favorites.some(fav => fav.productId === parseInt(id)));
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
    if (user) {
      checkIfFavorite();
    }
  }, [loadProduct, checkIfFavorite, user]);

  const handleAddToCart = async () => {
    if (!user) {
      setMsgType('error');
      setMsgText('Redirigiendo al login...');
      setShowMsg(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      await addToCart(parseInt(id));
      setMsgType('success');
      setMsgText('Producto agregado al carrito');
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.message === 'LOGIN_REQUIRED') {
        setMsgType('error');
        setMsgText('Redirigiendo al login...');
        setShowMsg(true);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMsgType('error');
        setMsgText('Error al agregar al carrito: ' + (err.response?.data?.error || err.message));
        setShowMsg(true);
        setTimeout(() => setShowMsg(false), 3000);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      setMsgType('error');
      setMsgText('Redirigiendo al login...');
      setShowMsg(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      if (isFavorite) {
        await favoritesApi.removeFromFavorites(parseInt(id));
        setIsFavorite(false);
        setMsgType('success');
        setMsgText('Eliminado de favoritos');
      } else {
        await favoritesApi.addToFavorites(parseInt(id));
        setIsFavorite(true);
        setMsgType('success');
        setMsgText('Agregado a favoritos');
      }
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 2000);
    } catch (err) {
      console.error('Error managing favorites:', err);
      setMsgType('error');
      setMsgText('Error al gestionar favoritos: ' + (err.response?.data?.error || err.message));
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Producto no encontrado'}</p>
          <Link to="/categories" className="btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link 
          to="/categories" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <FaArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>


        {showMsg && (
          <div className={`mb-6 p-4 rounded-lg text-center animate-fadeIn ${
            msgType === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {msgText}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="flex justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
            />
          </div>


          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>


            <div>
              <p className="text-4xl font-bold text-primary mb-6">
                ${product.price}
              </p>
            </div>


            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-3 text-lg flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="w-5 h-5" />
                Añadir al Carrito
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className={`px-4 py-3 rounded-lg border transition flex items-center justify-center ${
                  isFavorite
                    ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                    : 'border-gray-600 text-gray-400 hover:border-red-600 hover:text-red-400'
                }`}
              >
                <FaHeart className="w-5 h-5" />
              </button>
            </div>


            <div className="bg-dark border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información del Producto</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Categoría:</span>
                  <span className="text-white">{product.categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Disponibilidad:</span>
                  <span className="text-green-400">En stock</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío:</span>
                  <span className="text-white">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Garantía:</span>
                  <span className="text-white">12 meses</span>
                </div>
              </div>
            </div>


            <div className="bg-dark border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Vendido por Jeffmart
              </h3>
              <p className="text-gray-400 text-sm">
                Vendedor verificado con más de 1000 ventas exitosas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
