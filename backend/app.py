from flask import Flask
from flask_cors import CORS
from models import db
from routes import tasks_bp
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

app = Flask(__name__)

# Güvenli ayarlar
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# CORS ayarı
CORS(app)

# Veritabanını ve route'ları bağla
db.init_app(app)
app.register_blueprint(tasks_bp, url_prefix='/api')

# Tabloları oluştur
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=False)