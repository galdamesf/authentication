import axios from "axios";

// Configurar Axios para enviar el token en las cabeceras
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Obtén el token desde el localStorage
    if (token) {
      // Si el token existe, lo agregamos a las cabeceras de la petición
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(`Token enviado: ${token}`); // Verifica que el token esté en las cabeceras
    }
    return config;
  },
  (error) => {
    // Si ocurre un error en la solicitud, lo rechazamos
    return Promise.reject(error);
  }
);
