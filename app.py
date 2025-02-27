import jwt
import datetime
import mysql.connector
import bcrypt
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", methods=["GET", "POST", "OPTIONS"])

SECRET_KEY = "tu_clave_secreta"

# Configuración de MySQL
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="auth_db",
        connection_timeout=60,
        pool_name="mypool",
        pool_size=10,
        pool_reset_session=True
    )

def get_cursor():
    db = get_db_connection()
    return db, db.cursor(buffered=True)

# Crear tabla si no existe
db, cursor = get_cursor()
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
cursor.close()
db.close()

# Decorador para verificar token
def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({'message': 'Token de autenticación es necesario'}), 403
        
        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            db, cursor = get_cursor()
            cursor.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
            user = cursor.fetchone()
            cursor.close()
            db.close()

            if user is None:
                return jsonify({'message': 'Usuario no encontrado'}), 401
        
        except IndexError:
            return jsonify({'message': 'Formato de token incorrecto'}), 400
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        except Exception as e:
            return jsonify({'message': f'Error al procesar el token: {str(e)}'}), 500

        return f(user, *args, **kwargs)
    return decorator

# **Registro de Usuario**
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name, phone, email, password, address = data.get("name"), data.get("phone"), data.get("email"), data.get("password"), data.get("address")

    if not all([name, phone, email, password, address]):
        return jsonify({'message': 'Todos los campos son obligatorios'}), 400
    
    # Cifrar la contraseña antes de almacenarla
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        db, cursor = get_cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            db.close()
            return jsonify({'message': 'El correo ya está registrado'}), 400

        cursor.execute("INSERT INTO users (name, phone, email, password, address) VALUES (%s, %s, %s, %s, %s)",
                       (name, phone, email, hashed_password, address))
        db.commit()
        cursor.close()
        db.close()

    except mysql.connector.Error as err:
        return jsonify({'message': f'Error en la base de datos: {err}'}), 500

    return jsonify({'message': 'Usuario registrado'}), 201

# **Inicio de Sesión**
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")

    db, cursor = get_cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    db.close()

    # Verificar la contraseña utilizando bcrypt.checkpw
    if user and bcrypt.checkpw(password.encode('utf-8'), user[4].encode('utf-8')): # user[4] es la contraseña en la BD
        # Crear el token JWT
        token = jwt.encode({
            'email': user[3],  # Email en la columna 3
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        print(f"Token generado para {email}: {token}")

        return jsonify({'message': 'Inicio de sesión exitoso', 'token': token}), 200

    return jsonify({'message': 'Correo o contraseña incorrectos'}), 401

# **Ruta Privada**
@app.route('/private', methods=['GET'])
@token_required
def private_route(current_user):
    return jsonify({
        'message': f'Bienvenido {current_user[1]} a la ruta privada',
        'user': {
            'name': current_user[1],
            'email': current_user[3],
            'phone': current_user[2],
            'address': current_user[5]
        }
    }), 200

# **Prueba de conexión a la BD**
@app.route('/test-db', methods=['GET'])
def test_db_connection():
    try:
        db, cursor = get_cursor()
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({'users': users}), 200
    except mysql.connector.Error as err:
        return jsonify({'message': f'Error en la base de datos: {err}'}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=False)
