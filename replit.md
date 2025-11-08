# Website Portfolio Ahmad Edo Prayoga

## Overview
Website portfolio dinamis dengan sistem authentication (login & register) untuk tugas pemrograman web. Dibangun menggunakan Node.js, Express, dan SQLite database.

## Teknologi yang Digunakan
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Authentication**: bcrypt + express-session
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Fitur
1. **Sistem Login & Register**
   - Registrasi user baru dengan validasi
   - Login dengan username & password
   - Session management dengan SQLite store
   - Password hashing menggunakan bcrypt
   
2. **Halaman Website**
   - Login Page (index.html)
   - Register Page (register.html)
   - Home Page (home.html) - Protected
   - About Page (about.html) - Protected
   - Contact Page (contact.html) - Protected

3. **Keamanan**
   - Password di-hash dengan bcrypt (10 salt rounds)
   - Session-based authentication
   - Protected routes - redirect ke login jika belum authenticated
   - Input validation di frontend & backend
   - Cookie security dengan httpOnly, sameSite, dan secure flags

## Struktur File
```
├── server.js           # Main server & API endpoints
├── database.js         # Database handler & operations
├── auth-check.js       # Client-side authentication check
├── index.html          # Login page
├── register.html       # Registration page
├── home.html           # Protected home page
├── about.html          # Protected about page
├── contact.html        # Protected contact page
├── style.css           # Styling untuk semua halaman
├── .env.example        # Template untuk environment variables
└── users.db            # SQLite database (auto-generated)
```

## API Endpoints
- `POST /api/register` - Register user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/check-auth` - Check authentication status

## Setup & Installation
1. Dependencies sudah terinstall otomatis
2. Database akan dibuat otomatis saat first run
3. Server berjalan di port 5000

## Environment Variables
Buat file `.env` untuk production:
```
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
```

## Default Test Credentials
Tidak ada user default - harus register terlebih dahulu melalui halaman register.

## Catatan Keamanan
- Session secret menggunakan environment variable
- Cookie security sudah dikonfigurasi dengan sameSite:'lax' dan httpOnly
- Database files (.db) tidak di-commit ke repository
- Password tidak pernah disimpan dalam plain text

## Recent Changes (2025-11-08)
- Implementasi sistem login & register dengan database
- Menambahkan session management
- Menambahkan proteksi halaman dengan auth-check
- Security improvements (session secret, cookie flags, input validation)
- Email validation untuk registrasi
- Input trimming untuk username dan email

## Cara Menggunakan
1. Buka website
2. Klik "Daftar di sini" untuk membuat akun baru
3. Isi username (min 3 karakter), email (opsional), dan password (min 5 karakter)
4. Setelah register berhasil, kembali ke halaman login
5. Login dengan username dan password yang sudah dibuat
6. Setelah login, bisa mengakses halaman Home, About, dan Contact
7. Klik "Log out" untuk keluar
