import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { profileApi } from "../services/profile";

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    lastName: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        lastName: user.lastName || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Debes iniciar sesión para editar tu perfil");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await profileApi.updateProfile({
        name: form.name,
        lastName: form.lastName
      });

      const updatedUser = await profileApi.getProfile();
      setUser(updatedUser);
      localStorage.setItem("jm_user", JSON.stringify(updatedUser));
      setSuccess("Perfil actualizado correctamente ✅");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error al actualizar el perfil. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso requerido</h1>
          <p className="text-gray-400 mb-6">Debes iniciar sesión para editar tu perfil</p>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary w-full"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Editar Perfil
        </h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <img
              src={form.avatar || user.avatar || "https://i.pravatar.cc/100"}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-primary mx-auto mb-2"
              onError={(e) => {
                e.target.src = "https://i.pravatar.cc/100";
              }}
            />

          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nombre *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Juan"
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Ej: Pérez"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="avatar">
              Avatar (URL de imagen)
            </label>
            <input
              id="avatar"
              name="avatar"
              type="url"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://ejemplo.com/mi-avatar.jpg"
              className="input w-full"
            />

          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary py-2 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
