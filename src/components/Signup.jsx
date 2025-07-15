import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth.css"; // Importa el archivo CSS

const Signup = () => {
  const [name, setName] = useState(""); // Nuevo estado para el nombre
  const [phone, setPhone] = useState(""); // Nuevo estado para el teléfono
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); // Nuevo estado para la dirección
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !phone || !email || !password || !address) {
      // Validar también la dirección
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/signup", {
        name,
        phone,
        email,
        password,
        address, // Enviar la dirección al backend
      });

      if (response.status === 201) {
        setSuccess("Usuario registrado con éxito");
        console.log(`Usuario ${name} (${email}) se ha registrado con éxito.`);
        console.log(`Datos del usuario: Nombre: ${name}, Teléfono: ${phone}`);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
        setAddress(""); // Limpiar el campo de dirección
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
      setError("Error registrando usuario");
    }
  };

  const handleGoBack = () => {
    console.log("Volviste al Login"); // Mensaje en consola al hacer clic en el botón "Volver"
    navigate("/login"); // Redirige al login
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Teléfono
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              placeholder="Número de teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {/* Mover Dirección después del teléfono */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Correo electrónico"
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

          <button type="submit" className="btn btn-success">
            Registrarse
          </button>
          {error && <p className="text-danger mt-3">{error}</p>}
          {success && <p className="text-success mt-3">{success}</p>}
        </form>

        {/* Botón Volver */}
        <button onClick={handleGoBack} className="btn btn-secondary mt-3">
          Volver
        </button>
      </div>
    </div>
  );
};

export default Signup;
