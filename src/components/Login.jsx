import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Lock } from "lucide-react";
import "../Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga para el login
  const [loadingRegister, setLoadingRegister] = useState(false); // Estado de carga para el registro
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activa el estado de carga para el login
    setError(""); // Resetea errores anteriores

    try {
      const response = await axios.post("http://localhost:5001/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        console.log(`Usuario ${email} ha iniciado sesión correctamente.`);
        console.log(`Token recibido: ${token}`);

        setTimeout(() => {
          setLoading(false); // Desactiva el estado de carga antes de redirigir
          navigate("/private");
        }, 1500); // Simula un retraso de 1.5 segundos
      }
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setError("Correo o contraseña incorrectos");
      setLoading(false); // Desactiva el estado de carga en caso de error
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault(); // Prevenir la navegación inmediata
    setLoadingRegister(true); // Activa el estado de carga para el registro

    console.log("Redirigiendo al registro...");
    setTimeout(() => {
      setLoadingRegister(false); // Desactiva el estado de carga después de 3 segundos
      navigate("/signup"); // Navegar a la página de registro
    }, 3000); // Retraso de 3 segundos
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || loadingRegister} // Deshabilita si está cargando
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="input-with-icon">
              <Lock size={18} color="gray" className="icon" />
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || loadingRegister} // Deshabilita si está cargando
              />
            </div>
          </div>

          {/* Botón con spinner de carga */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Cargando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          {error && <p className="text-danger mt-3">{error}</p>}

          <p className="mt-3">
            ¿No tienes una cuenta?
            <Link to="/signup" onClick={handleRegisterClick}>
              {loadingRegister ? (
                <>
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Cargando...
                </>
              ) : (
                "Crear una cuenta"
              )}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;
