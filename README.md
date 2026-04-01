# 📝 TaskFlow — Görev Yönetim Uygulaması

Bulut Bilişim Dersi Proje 1 — Çift Katmanlı Web Uygulaması

## 🌐 Canlı Demo
- **Frontend:** http://taskflow-frontend-seymakula.s3-website.eu-central-1.amazonaws.com
- **Backend API:** http://3.120.139.109:5000/api

---

## 🏗️ Mimari
```
React (AWS S3) → Flask API (AWS EC2) → PostgreSQL (AWS RDS)
```

## 🛠️ Kullanılan Teknolojiler

### Backend
- Python 3.9
- Flask 3.1
- Flask-SQLAlchemy
- Flask-CORS
- Gunicorn
- PostgreSQL

### Frontend
- React 18
- JavaScript (ES6+)
- CSS3

### AWS Servisleri
- **EC2** (t3.micro) — Flask API sunucusu
- **RDS** (t3.micro) — PostgreSQL veritabanı
- **S3** — React frontend hosting

---

## 📡 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/tasks | Tüm görevleri listele |
| POST | /api/tasks | Yeni görev ekle |
| PUT | /api/tasks/:id | Görevi güncelle |
| DELETE | /api/tasks/:id | Görevi sil |

### Örnek İstek (POST /api/tasks)
```json
{
  "title": "Yeni görev",
  "description": "Açıklama"
}
```

### Örnek Cevap
```json
{
  "id": 1,
  "title": "Yeni görev",
  "description": "Açıklama",
  "status": "pending",
  "created_at": "2026-04-01T12:00:00"
}
```

---

## 🚀 Kurulum

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 👤 Geliştirici
- **Ad:** Seyma Kula
- **Ders:** 3522 Bulut Bilişim