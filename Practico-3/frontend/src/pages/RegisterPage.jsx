import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Alert from "../components/Alert";
import FormField from "../components/FormField";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "FOLLOWER" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === "CREATOR") navigate("/creator/dashboard");
      else navigate("/follower/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear Cuenta</h1>
        <Alert type="error" message={error} />
        <form onSubmit={handleSubmit}>
          <FormField label="Email" id="register-email">
            <input
              id="register-email"
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Contrasena (minimo 6 caracteres)" id="register-password">
            <input
              id="register-password"
              name="password"
              type="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </FormField>
          <FormField label="Tipo de cuenta" id="register-role">
            <select id="register-role" name="role" className="input" value={form.role} onChange={handleChange}>
              <option value="FOLLOWER">Seguidor / Donador</option>
              <option value="CREATOR">Creador</option>
            </select>
          </FormField>
          <button id="register-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="auth-link">
          Ya tenes cuenta? <Link to="/login">Iniciar sesion</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
