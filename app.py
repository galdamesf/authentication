import jwt
import datetime
from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", methods=["GET", "POST", "OPTIONS"])

SECRET_KEY = "tu_clave_secreta"

users = [{'name': 'Test User', 'phone': '123456789', 'email': 'test@example.com', 'password': 'password123', 'address': 'Santiago, Chile'}]

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
            current_user = next((user for user in users if user["email"] == data["email"]), None)

            if current_user is None:
                return jsonify({'message': 'Usuario no encontrado'}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401

        return f(current_user, *args, **kwargs)
    return decorator

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name, phone, email, password, address = data.get("name"), data.get("phone"), data.get("email"), data.get("password"), data.get("address")

    if not all([name, phone, email, password, address]):
        return jsonify({'message': 'Todos los campos son obligatorios'}), 400

    if any(user['email'] == email for user in users):
        return jsonify({'message': 'El correo ya está registrado'}), 400

    users.append({'name': name, 'phone': phone, 'email': email, 'password': password, 'address': address})
    return jsonify({'message': 'Usuario registrado'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")

    user = next((user for user in users if user["email"] == email and user["password"] == password), None)

    if user:
        token = jwt.encode({
            'email': user["email"],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        print(f"Token generado para {email}: {token}") # Imprime el token en la terminal

        return jsonify({'message': 'Inicio de sesión exitoso', 'token': token}), 200

    return jsonify({'message': 'Correo o contraseña incorrectos'}), 401

@app.route('/private', methods=['GET'])
@token_required
def private_route(current_user):
    return jsonify({
        'message': f'Bienvenido {current_user["name"]} a la ruta privada',
        'user': current_user
    }), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
