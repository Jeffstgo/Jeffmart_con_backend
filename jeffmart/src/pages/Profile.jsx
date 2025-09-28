import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../services/profile";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const profile = await profileApi.getProfile();
          setProfileData(profile);
          setUser(profile);
          localStorage.setItem("jm_user", JSON.stringify(profile));
        } catch (error) {
          console.error("Error loading profile:", error);
          setProfileData(user);
        } finally {
          setLoading(false);
        }
      } else if (user) {
        setProfileData(user);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, setUser]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Debes iniciar sesión para ver tu perfil</p>
          <button 
            onClick={() => navigate("/login")}
            className="btn-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Cargando perfil...</p>
          <p className="text-xs text-gray-500 mt-2">Usuario ID: {user?.id}</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Mi Perfil</h1>
        
        <div className="bg-dark border border-border rounded-lg p-6">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={profileData?.avatar || "https://i.pravatar.cc/100"}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-primary"
            />
            <div>
              <h2 className="text-2xl font-semibold text-white">{profileData?.name} {profileData?.lastName}</h2>
              <p className="text-gray-400">{profileData?.email}</p>
              <p className="text-sm text-gray-500">
                Miembro desde {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Fecha no disponible'}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nombre
                </label>
                <div className="bg-background border border-border rounded px-3 py-2 text-white">
                  {profileData?.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Apellido
                </label>
                <div className="bg-background border border-border rounded px-3 py-2 text-white">
                  {profileData?.lastName || 'No especificado'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Correo Electrónico
                </label>
                <div className="bg-background border border-border rounded px-3 py-2 text-white">
                  {profileData?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/profile/edit")}
                className="btn-primary px-6 py-2"
              >
                Editar Perfil
              </button>
              <button
                onClick={() => navigate("/my-products")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
              >
                Mis Productos
              </button>
              <button
                onClick={() => navigate("/favorites")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Ver Favoritos
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition"
              >
                Ver Carrito
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
