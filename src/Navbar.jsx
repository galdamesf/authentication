import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importa PropTypes
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Navbar = ({ setIsAuthenticated }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("El usuario ha cerrado sesión.");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-outline-danger"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

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
    </>
  );
};

// Definir validación para las props
Navbar.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Navbar;
