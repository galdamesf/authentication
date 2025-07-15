import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import "../Private.css"; // Agrega una clase CSS personalizada si es necesario

const Private = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("El usuario ha cerrado sesión.");
    setIsAuthenticated(false);
    navigate("/login");
  };

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
            <div className="container-fluid">
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-outline-danger"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}

      {/* Modal de confirmación */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Quieres cerrar sesión?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tu sesión se cerrará y volverás a la pantalla de inicio de sesión.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Salir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Definir validación para las props
Private.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
export default Private;
