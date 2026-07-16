# ☁️ Cloud Drive Clone

## Deskripsi

Cloud Drive Clone adalah aplikasi penyimpanan file berbasis web (cloud storage) yang dikembangkan sebagai tugas akhir mata kuliah **Teknologi Cloud**.

Aplikasi ini memungkinkan pengguna untuk:
- Registrasi akun
- Login
- Upload file
- Menyimpan metadata file ke MySQL
- Menyimpan file ke Object Storage menggunakan MinIO

Project ini menerapkan konsep **Containerization** menggunakan Docker sehingga seluruh service dapat dijalankan dengan environment yang konsisten.

---

# Teknologi yang Digunakan

- Docker
- Docker Compose
- Express.js
- MySQL
- MinIO
- HTML
- CSS
- JavaScript

---

# Struktur Project

```
cloud-drive-clone/
│
├── backend/
│   ├── src/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│
├── docs/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Cara Menjalankan

## 1. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd cloud-drive-clone
```

## 2. Buat file `.env`

Salin file:

```
.env.example
```

menjadi

```
.env
```

kemudian sesuaikan konfigurasi jika diperlukan.

## 3. Jalankan Docker

```bash
docker compose up --build -d
```

## 4. Jalankan Frontend

Masuk ke folder frontend kemudian jalankan:

```bash
python -m http.server 5500
```

Frontend dapat diakses melalui:

```
http://localhost:5500
```

---

# Service

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5500 |
| Backend API | http://localhost:3000 |
| MinIO API | http://localhost:9000 |
| MinIO Console | http://localhost:9001 |
| MySQL | localhost:3306 |

---

# Deployment

**Status Deployment**

Belum dilakukan deployment ke cloud provider (AWS, Azure, GCP, Vercel, Netlify, dan lainnya).

Project saat ini dijalankan pada environment lokal menggunakan Docker Compose.

---

# Anggota Tim

| Akhdan Farand Namara | 2415323038 | Docker, Docker Compose, MinIO, Deployment Environment |
| Alif Amrullah Hakiem | 2415323062 | Backend API & Database |
| Gede Komang Tjhandra Wirawan | 2415323066 | Frontend Development |
| Fajar Febrian Pamungkas | 2415323044 | Testing, Dokumentasi & Presentasi |

---

# Konsep Cloud yang Digunakan

- Containerization menggunakan Docker
- Multi Container menggunakan Docker Compose
- Object Storage menggunakan MinIO
- Database Service menggunakan MySQL
- REST API menggunakan Express.js

---

# Lisensi

Project ini dibuat untuk memenuhi tugas akhir mata kuliah **Teknologi Cloud** di Politeknik Negeri Bali.