import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-dark border-b border-border text-text px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-white">
          Jeffmart
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-primary transition">
            Inicio
          </Link>
          <Link to="/categories" className="hover:text-primary transition">
            Categorías
          </Link>
          <Link to="/offers" className="hover:text-primary transition">
            Ofertas
          </Link>
          <Link to="/ads/create" className="hover:text-primary transition">
            Vender
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Link
          to="/favorites"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#29382E] text-text hover:bg-primary/30 transition"
        >
          <FaHeart />
        </Link>
        <Link
          to="/cart"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#29382E] text-text hover:bg-primary/30 transition"
        >
          <FaShoppingCart />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full px-2 text-xs font-bold">
              {count}
            </span>
          )}
        </Link>
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 hover:bg-card rounded-lg transition"
            >
              <img
                src={user.avatar || "https://i.pravatar.cc/40"}
                alt="avatar"
                className="w-8 h-8 rounded-full border border-border"
              />
              <span className="hidden md:block text-sm font-medium">
                {user.name}
              </span>
              <FaChevronDown className="text-xs" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-border transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Mi Perfil
                </Link>
                <Link
                  to="/my-products"
                  className="block px-4 py-2 text-sm hover:bg-border transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Mis Productos
                </Link>
                <Link
                  to="/ads/create"
                  className="block px-4 py-2 text-sm hover:bg-border transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Crear Anuncio
                </Link>
                <hr className="border-border my-2" />
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm hover:bg-border transition"
                  onClick={() => setShowDropdown(false)}
                >
                  Configuración
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-border transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login" className="btn-primary text-sm px-3 py-1 rounded">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm px-3 py-1 rounded"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
