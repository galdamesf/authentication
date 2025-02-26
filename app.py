import jwt
import datetime
import mysql.connector
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", methods=["GET", "POST", "OPTIONS"])

SECRET_KEY = "tu_clave_secreta"

# Configuración de MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Cambia esto según tu usuario de MySQL
    password="password",  # Cambia esto según tu contraseña de MySQL
    database="auth_db"
)
cursor = db.cursor()

# Crear la tabla si no existe
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT NOT NULL
);
""")
db.commit()

# Decorador para verificar token
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token de autenticación es necesario'}), 403

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            cursor.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
            user = cursor.fetchone()

            if user is None:
                return jsonify({'message': 'Usuario no encontrado'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401

        return f(user, *args, **kwargs)
    return decorator

# 🔹 **Registro de Usuario**
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name, phone, email, password, address = data.get("name"), data.get("phone"), data.get("email"), data.get("password"), data.get("address")

    if not all([name, phone, email, password, address]):
        return jsonify({'message': 'Todos los campos son obligatorios'}), 400

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'message': 'El correo ya está registrado'}), 400

    cursor.execute("INSERT INTO users (name, phone, email, password, address) VALUES (%s, %s, %s, %s, %s)",
                   (name, phone, email, password, address))
    db.commit()

    return jsonify({'message': 'Usuario registrado'}), 201

# 🔹 **Inicio de Sesión**
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")

    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, password))
    user = cursor.fetchone()

    if user:
        token = jwt.encode({
            'email': user[3],  # Email está en la columna 3
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
        }, SECRET_KEY, algorithm='HS256')

        print(f"Token generado para {email}: {token}")  # 🔹 Imprime el token en la terminal

        return jsonify({'message': 'Inicio de sesión exitoso', 'token': token}), 200

    return jsonify({'message': 'Correo o contraseña incorrectos'}), 401

# 🔹 **Ruta Privada**
@app.route('/private', methods=['GET'])
@token_required
def private_route(current_user):
    return jsonify({
        'message': f'Bienvenido {current_user[1]} a la ruta privada',  # Nombre está en la columna 1
        'user': {
            'name': current_user[1],
            'email': current_user[3],
            'phone': current_user[2],
            'address': current_user[5]
        }
    }), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
