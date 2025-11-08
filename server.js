const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 5000;

app.set('trust proxy', 1);

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET is not set. Using a temporary secret for development.');
  console.warn('For production, please set SESSION_SECRET environment variable.');
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: SESSION_SECRET must be set in production!');
    process.exit(1);
  }
}

const sessionSecret = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db' }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static(path.join(__dirname)));

app.post('/api/register', (req, res) => {
  let { username, password, email } = req.body;
  
  username = username?.trim();
  email = email?.trim();
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }
  
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username minimal 3 karakter' });
  }
  
  if (password.length < 5) {
    return res.status(400).json({ error: 'Password minimal 5 karakter' });
  }
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Format email tidak valid' });
  }
  
  try {
    const user = db.createUser(username, password, email || null);
    res.json({ success: true, message: 'Registrasi berhasil!', user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  
  username = username?.trim();
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }
  
  const user = db.getUserByUsername(username);
  
  if (!user || !db.verifyPassword(password, user.password)) {
    return res.status(401).json({ error: 'Username atau password salah' });
  }
  
  req.session.userId = user.id;
  res.json({ success: true, message: 'Login berhasil!', user: { id: user.id, username: user.username } });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal logout' });
    }
    res.json({ success: true, message: 'Logout berhasil' });
  });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.userId) {
    const user = db.getUserById(req.session.userId);
    if (user) {
      return res.json({ authenticated: true, user: { id: user.id, username: user.username } });
    }
  }
  res.json({ authenticated: false });
});

app.get('/api/comments', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Anda harus login untuk melihat comment' });
  }
  
  try {
    const comments = db.listComments(50);
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil comment' });
  }
});

app.post('/api/comments', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Anda harus login untuk membuat comment' });
  }
  
  let { content } = req.body;
  content = content?.trim();
  
  if (!content) {
    return res.status(400).json({ error: 'Comment tidak boleh kosong' });
  }
  
  if (content.length > 500) {
    return res.status(400).json({ error: 'Comment maksimal 500 karakter' });
  }
  
  try {
    const user = db.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }
    
    const comment = db.createComment(user.id, user.username, content);
    res.json({ success: true, message: 'Comment berhasil dibuat', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/comments/:id', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Anda harus login untuk menghapus comment' });
  }
  
  const commentId = parseInt(req.params.id);
  
  if (isNaN(commentId)) {
    return res.status(400).json({ error: 'ID comment tidak valid' });
  }
  
  try {
    db.deleteCommentByOwner(commentId, req.session.userId);
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('tidak memiliki izin')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(404).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
