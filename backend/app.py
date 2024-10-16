import os
import bcrypt
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import select
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import Baul

app = Flask(__name__)
CORS(app)

load_dotenv()


TURSO_DATABASE_URL = os.getenv("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN")

dbUrl = f"sqlite+{TURSO_DATABASE_URL}/?authToken={TURSO_AUTH_TOKEN}&secure=true" 
engine = create_engine(dbUrl, connect_args={'check_same_thread': False}, echo=True)

@app.route('/', methods=['GET'])
def get_bauls():
    seccion = Session(engine)
    stmt = select(Baul)
    data = []
    for baul in seccion.scalars(stmt):
        data.append({
            'id': baul.id,
            'plataforma': baul.plataforma,
            'usuario': baul.usuario,
            'clave': baul.clave
        })
    try:
        return jsonify(data), 200
    except Exception as e:
        seccion.rollback()
        return jsonify({'message': 'Error en la solicitud'}), 400
    finally:
        seccion.close()
        
@app.route('/baul/<int:baul_id>', methods=['GET'])
def get_baul(baul_id):
    session = Session(engine)
    stmt = select(Baul).where(Baul.id == baul_id)
    baul = session.execute(stmt).scalar_one_or_none()
    if not baul:
        return jsonify({'message': 'Baul no encontrado'}), 404

    data = {
        'id': baul.id,
        'plataforma': baul.plataforma,
        'usuario': baul.usuario
    }
    try:
        return jsonify(data), 200
    except Exception as e:
        session.rollback()
        return jsonify({'message': 'Error en la solicitud'}), 400
    finally:
        session.close()
        
@app.route('/baul', methods=['POST'])
def create_baul():
    session = Session(engine)
    data = request.json
    plataforma = data.get('plataforma','').strip()
    usuario = data.get('usuario', '').strip()
    contrasena = data.get('clave', '').strip()
    
    if not (plataforma):
        return jsonify({'message': 'plataforma es requerida'}), 400
    if not (usuario):
        return jsonify({'message': 'usuario es requerido'}), 400
    if not (contrasena):
        return jsonify({'message': 'contrasena es requerida'}), 400
        
    
    contrasena_encriptada = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
    contrasena_encriptada_str = contrasena_encriptada.decode('utf-8')
    
    nuevo_baul = Baul(plataforma=plataforma, usuario=usuario, clave=contrasena_encriptada_str)
    
    session.add(nuevo_baul)
    
    try:
        session.commit()
        return jsonify({'message': 'Baul creado exitosamente'}), 201
    except Exception as e:
        session.rollback()
        return jsonify({'message':'error en la solicitud' }), 400
    finally:
        session.close()
    
@app.route('/baul/<int:id>', methods=['PUT'])
def update_baul(id):
    session = Session(engine)
    data = request.json
    plataforma = data.get('plataforma', '').strip()
    usuario = data.get('usuario', '').strip()
    contrasena = data.get('clave', '').strip()
    
    if not id:
        return jsonify({'message': 'id es requerido'}), 400
    if not plataforma:
        return jsonify({'message': 'plataforma es requerida'}), 400
    if not usuario:
        return jsonify({'message': 'usuario es requerido'}), 400
   
    stmt = select(Baul).where(Baul.id == id)
    baul = session.execute(stmt).scalar_one_or_none()
    
    if not baul:
        return jsonify({'message': 'Baul no encontrado'}), 404
    
    baul.plataforma = plataforma
    baul.usuario = usuario
    
    if contrasena:
        contrasena_encriptada = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt())
        contrasena_encriptada_str = contrasena_encriptada.decode('utf-8')
        baul.clave = contrasena_encriptada_str

    try:
        session.commit()
        return jsonify({'message': 'Baul actualizado exitosamente'}), 200
    except Exception as e:
        session.rollback()
        return jsonify({'message': 'Error en la solicitud'}), 400
    finally:
        session.close()


@app.route('/baul/<int:id>', methods=['DELETE'])
def delete_baul(id):
    session = Session(engine)
    
    # Buscar el registro a eliminar
    stmt = select(Baul).where(Baul.id == id)
    try:
        baul = session.execute(stmt).scalar_one_or_none()
        
        if not baul:
            return jsonify({'message': 'Baul no encontrado'}), 404

        # Eliminar el registro
        session.delete(baul)
        session.commit()
        return jsonify({'message': f'El baul con id {id} ha sido eliminado'}), 200
    except Exception as e:
        session.rollback()
        return jsonify({'message': f'Error al eliminar el baul: {str(e)}'}), 400
    finally:
        session.close()


if __name__ == '__main__':
    app.run(debug=True)