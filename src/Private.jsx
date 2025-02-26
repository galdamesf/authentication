import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Private.css"; // Agrega una clase CSS personalizada si es necesario

const Private = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("No hay token de autenticación. Redirigiendo...");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/private", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("No se pudo obtener la información del usuario.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="private-container">
      {userData ? (
        <div className="card-container">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{userData.name}</h5>
              <p className="card-text">Email: {userData.email}</p>
              <p className="card-text">Teléfono: {userData.phone}</p>
              <p className="card-text">Dirección: {userData.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
};

export default Private;
