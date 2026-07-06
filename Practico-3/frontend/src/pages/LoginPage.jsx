import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Alert from "../components/Alert";
import FormField from "../components/FormField";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role === "CREATOR") navigate("/creator/dashboard");
      else navigate("/follower/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Iniciar Sesion</h1>
        <Alert type="error" message={error} />
        <form onSubmit={handleSubmit}>
          <FormField label="Email" id="login-email">
            <input
              id="login-email"
              name="email"
              type="email"
              className="input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Contrasena" id="login-password">
            <input
              id="login-password"
              name="password"
              type="password"
              className="input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </FormField>
          <button id="login-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
        <p className="auth-link">
          No tenes cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
