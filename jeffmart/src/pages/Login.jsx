import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.ok) {
      setMessage("✅ Login exitoso");
      setEmail("");
      setPassword("");
    } else {
      setMessage("❌ " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-6">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        {user ? (
          <div className="text-center">
            <p>
              Hola, {user.name} ({user.email})
            </p>
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded text-white mt-4"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
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
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
              />
            </div>
            <button type="submit" className="btn-primary w-full py-2 text-lg">
              Iniciar sesión
            </button>
          </form>
        )}
        {message && <div className="mt-4 text-center">{message}</div>}
      </div>
    </div>
  );
}
