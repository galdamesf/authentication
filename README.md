# Sistema de Autenticación con Python, Flask y React.js

En el siguiente proyecto se implementa un sistema de autenticación usando Flask para el Backend y React Vite para el Frontend. Con este sistema de autenticación el usuario puede registrarse con sus datos e iniciar sesión con mail y password, para luego ser dirigido a una pagina privada. El usuario, al ser registrado, queda guardado en la base de datos, ya que se integró MySQL.
Todos los datos de registro, inicio de sesión y cierre de sesión serán impresos en la consola, incluido el token.  

# Tecnologías Utilizadas:

- React
- Vite
- Bootstrap
- Flask
- Axios
- React Router DOM
- MySQL

# Configuración del Proyecto:

1. Crear carpeta para el proyecto
- git clone https://github.com/galdamesf/authentication.git
- cd Ultimo Trabajo
- ls Autentication
- cd Autentication

2. Configuración del Frontend
- Instalación de Dependencias
- bash
- cd frontend
- npm install
- Ejecutar el Proyecto
- bash
- npm run dev
- El frontend debería estar corriendo en http://localhost:5173.

3. Configuración del Backend
- Instalación de Dependencias
- bash
- cd backend
- pip install flask flask-cors
- Ejecutar el Servidor
- bash
- python app.py
- El backend debería estar corriendo en http://localhost:5001.

4. Configuración de MySQL
- Instalación de las dependencias
- pipenv install flask-mysql-connector
- configurar MySQL en app.py
- Crear la base de datos en MySQL:
- CREATE DATABASE auth_db;
- seleccionar la base de datos: USE auth_db;
- Asegurate de que MySQL esté corriendo y luego ejecuta: python app.py
- verificar si MySQL está instalado: mysql --version
- iniciar MySQL (si no está corriendo): brew services start mysql
- abrir MySQL en la terminal: mysql -u root -p
- verificar la base de datos: SHOW DATABASES
- verificar los datos de la tabla: SELECT * FROM users;
- ver detalles de la tabla: DESCRIBE users;
- Salir de MySQL: EXIT;
- reiniciar el servidor MySQL: sudo systemctl restart mysql
- revisar el uso de la base de datos: SHOW PROCESSLIST;


5. Guardar Proyecto
- git init
- git add .
- git commit -m "Proyecto terminado"
- git push -u origin main

