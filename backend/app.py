from flask import Flask
from flask_cors import CORS
from models import db
from routes import tasks_bp

app = Flask(__name__)

# Veritabanı ayarı (şimdilik SQLite, sonra RDS'e geçeceğiz)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://taskflow_user:Taskflow123!@taskflow-db.cdewe2imkv9k.eu-central-1.rds.amazonaws.com:5432/taskflowdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS ayarı (React'ın API'ye erişmesine izin ver)
CORS(app)

# Veritabanını ve route'ları bağla
db.init_app(app)
app.register_blueprint(tasks_bp, url_prefix='/api')

# Uygulama ilk çalışınca tabloları oluştur
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)