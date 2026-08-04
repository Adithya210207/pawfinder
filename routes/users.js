const express = require('express');
const { getDb } = require('../database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, name, email, phone, city, avatar_initials, paw_points, is_admin, created_at FROM users WHERE id = ?').get(req.session.userId);
  const appCount = db.prepare('SELECT COUNT(*) as c FROM applications WHERE user_id = ?').get(req.session.userId).c;
  const favCount = db.prepare('SELECT COUNT(*) as c FROM favourites WHERE user_id = ?').get(req.session.userId).c;
  res.json({ user, stats: { applications: appCount, favourites: favCount } });
});

router.put('/profile', requireAuth, (req, res) => {
  const db = getDb();
  const { name, phone, city } = req.body;
  const initials = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : undefined;

  if (name) {
    db.prepare('UPDATE users SET name = ?, avatar_initials = ?, phone = ?, city = ? WHERE id = ?')
      .run(name, initials, phone || '', city || '', req.session.userId);
  }

  const user = db.prepare('SELECT id, name, email, phone, city, avatar_initials, paw_points FROM users WHERE id = ?').get(req.session.userId);
  res.json({ user });
});

router.get('/favourites', requireAuth, (req, res) => {
  const db = getDb();
  const dogs = db.prepare(`
    SELECT d.id, d.name, d.emoji, d.breed, d.age_text, d.location
    FROM favourites f JOIN dogs d ON f.dog_id = d.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.session.userId);
  res.json({ dogs });
});

router.get('/notifications', requireAuth, (req, res) => {
  const db = getDb();
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(req.session.userId);
  const unread = db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND read = 0').get(req.session.userId).c;
  res.json({ notifications, unread });
});

router.post('/notifications/read', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(req.session.userId);
  res.json({ ok: true });
});

module.exports = router;
