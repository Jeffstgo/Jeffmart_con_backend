import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    cart, 
    loading, 
    error, 
    total, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    fetchCart 
  } = useCart();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate, fetchCart]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-text">Cargando carrito...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
            <p>Error: {error}</p>
            <button 
              onClick={fetchCart}
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Mi Carrito</h1>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaTrash className="w-4 h-4" />
              Vaciar Carrito
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <FaShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-400 mb-6">
                Agrega algunos productos para comenzar tu compra
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-dark border border-border rounded-lg p-6 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-primary font-bold text-lg">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <FaMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-white font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-primary/80 text-white transition"
                      >
                        <FaPlus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <p className="text-white font-semibold">
                      ${item.subtotal}
                    </p>
                    

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 p-2 transition"
                      title="Eliminar del carrito"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>


            <div className="lg:col-span-1">
              <div className="bg-dark border border-border rounded-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Resumen del Pedido
                </h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Envío:</span>
                    <span>Gratis</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full btn-primary py-3 font-semibold">
                  Proceder al Pago
                </button>
                
                <Link
                  to="/categories"
                  className="block w-full text-center text-gray-400 hover:text-white mt-4 transition"
                >
                  ← Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
