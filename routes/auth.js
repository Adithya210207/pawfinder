const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, phone, city, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const id = uuidv4();
  const hash = bcrypt.hashSync(password, 10);
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  db.prepare(`INSERT INTO users (id, name, email, phone, city, password_hash, avatar_initials)
    VALUES (?, ?, ?, ?, ?, ?, ?)`).run(id, name, email, phone || '', city || '', hash, initials);

  db.prepare(`INSERT INTO notifications (id, user_id, title, body) VALUES (?, ?, ?, ?)`)
    .run(uuidv4(), id, 'Welcome to PawFinder! 🐾', 'Start by browsing dogs available for adoption near you.');

  req.session.userId = id;
  const user = db.prepare('SELECT id, name, email, phone, city, avatar_initials, paw_points, is_admin FROM users WHERE id = ?').get(id);
  res.json({ user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  req.session.userId = user.id;
  res.json({
    user: {
      id: user.id, name: user.name, email: user.email,
      phone: user.phone, city: user.city,
      avatar_initials: user.avatar_initials, paw_points: user.paw_points,
      is_admin: user.is_admin
    }
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, phone, city, avatar_initials, paw_points, is_admin FROM users WHERE id = ?').get(req.session.userId);
  res.json({ user: user || null });
});

module.exports = router;
