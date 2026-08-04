const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

const SHELTER_FIELDS = [
  'name', 'emoji', 'address', 'city', 'phone', 'email', 'hours',
  'distance_km', 'dogs_available', 'dogs_rehomed', 'volunteers', 'rating', 'verified', 'tags'
];

function normalizeShelter(body) {
  const out = {};
  for (const f of SHELTER_FIELDS) {
    let v = body[f];
    if (f === 'verified') v = v ? 1 : 0;
    else if (['distance_km', 'dogs_available', 'dogs_rehomed', 'volunteers', 'rating'].includes(f)) {
      v = v === '' || v == null ? 0 : Number(v);
    } else v = v == null ? '' : String(v);
    out[f] = v;
  }
  return out;
}

router.get('/', (req, res) => {
  const db = getDb();
  const { search, filter } = req.query;

  let query = 'SELECT * FROM shelters WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR address LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (filter && filter !== 'all') {
    switch (filter) {
      case 'verified': query += ' AND verified = 1'; break;
      case 'near': query += ' ORDER BY distance_km ASC'; break;
      case 'most_dogs': query += ' ORDER BY dogs_available DESC'; break;
    }
  }

  if (!filter || (filter !== 'near' && filter !== 'most_dogs')) {
    query += ' ORDER BY rating DESC';
  }

  const shelters = db.prepare(query).all(...params);
  res.json({ shelters });
});

router.get('/stats', (req, res) => {
  const db = getDb();
  const stats = db.prepare(`SELECT
    COUNT(*) as total_shelters,
    SUM(dogs_available) as total_dogs,
    SUM(dogs_rehomed) as total_rehomed,
    SUM(volunteers) as total_volunteers
  FROM shelters`).get();
  res.json({ stats });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
  if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

  const dogs = db.prepare('SELECT id, name, emoji, breed, age_text, urgent FROM dogs WHERE shelter_id = ? AND adopted = 0').all(req.params.id);
  res.json({ shelter, dogs });
});

router.post('/', requireAdmin, (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Shelter name is required' });
  const db = getDb();
  const s = normalizeShelter(req.body);
  if (!s.emoji) s.emoji = '🏥';
  const id = uuidv4();
  const cols = ['id', ...SHELTER_FIELDS];
  db.prepare(`INSERT INTO shelters (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`)
    .run(id, ...SHELTER_FIELDS.map(f => s[f]));
  const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(id);
  res.json({ shelter });
});

router.put('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM shelters WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Shelter not found' });
  if (!req.body.name) return res.status(400).json({ error: 'Shelter name is required' });
  const s = normalizeShelter(req.body);
  if (!s.emoji) s.emoji = '🏥';
  db.prepare(`UPDATE shelters SET ${SHELTER_FIELDS.map(f => `${f} = ?`).join(', ')} WHERE id = ?`)
    .run(...SHELTER_FIELDS.map(f => s[f]), req.params.id);
  const shelter = db.prepare('SELECT * FROM shelters WHERE id = ?').get(req.params.id);
  res.json({ shelter });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM shelters WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Shelter not found' });
  const tx = db.transaction(() => {
    db.prepare('UPDATE dogs SET shelter_id = NULL WHERE shelter_id = ?').run(req.params.id);
    db.prepare('UPDATE foster_dogs SET shelter_id = NULL WHERE shelter_id = ?').run(req.params.id);
    db.prepare('DELETE FROM messages WHERE shelter_id = ?').run(req.params.id);
    db.prepare('DELETE FROM shelters WHERE id = ?').run(req.params.id);
  });
  tx();
  res.json({ ok: true });
});

module.exports = router;
