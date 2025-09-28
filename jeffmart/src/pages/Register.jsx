import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.ok) {
      setMessage("✅ Cuenta creada exitosamente");
      setFormData({
        name: "",
        lastName: "",
        email: "",
        password: ""
      });
    } else {
      setMessage("❌ " + res.error);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Ya estás registrado</h1>
          <div className="text-center">
            <p className="mb-4">Hola, {user.name} ({user.email})</p>
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded text-white mr-2"
            >
              Cerrar sesión
            </button>
            <Link to="/" className="btn-primary px-4 py-2 rounded">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Crear una cuenta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
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
              placeholder="Tu apellido"
              value={formData.lastName}
              onChange={handleChange}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              className="input w-full"
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2 text-lg">
            Crear cuenta
          </button>
        </form>

        {message && <div className="mt-4 text-center">{message}</div>}

        <div className="text-center text-sm text-gray-400 mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
