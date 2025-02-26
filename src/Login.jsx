import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        console.log(`Token recibido: ${token}`); // Muestra el token en la consola del navegador
        navigate("/private");
      }
    } catch (error) {
      console.error("Error iniciando sesión:", error);
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleSignUpClick = () => {
    console.log("Usuario ha hecho clic en 'Regístrate aquí'");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
          <p className="mt-3">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" onClick={handleSignUpClick}>
              Regístrate aquí
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
