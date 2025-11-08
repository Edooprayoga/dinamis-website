const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const db = new Database(path.join(__dirname, 'users.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

function createUser(username, password, email = null) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)');
  try {
    const result = stmt.run(username, hashedPassword, email);
    return { id: result.lastInsertRowid, username, email };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username sudah digunakan');
    }
    throw error;
  }
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
  return stmt.get(id);
}

function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function createComment(userId, username, content) {
  const stmt = db.prepare('INSERT INTO comments (user_id, username, content) VALUES (?, ?, ?)');
  try {
    const result = stmt.run(userId, username, content);
    return {
      id: result.lastInsertRowid,
      user_id: userId,
      username,
      content,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('Gagal membuat comment');
  }
}

function listComments(limit = 50) {
  const stmt = db.prepare('SELECT * FROM comments ORDER BY created_at DESC LIMIT ?');
  return stmt.all(limit);
}

function getCommentById(commentId) {
  const stmt = db.prepare('SELECT * FROM comments WHERE id = ?');
  return stmt.get(commentId);
}

function deleteCommentByOwner(commentId, userId) {
  const comment = getCommentById(commentId);
  if (!comment) {
    throw new Error('Comment tidak ditemukan');
  }
  if (comment.user_id !== userId) {
    throw new Error('Anda tidak memiliki izin untuk menghapus comment ini');
  }
  const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
  stmt.run(commentId);
  return true;
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  verifyPassword,
  createComment,
  listComments,
  getCommentById,
  deleteCommentByOwner,
  db
};
