const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const DOG_FIELDS = [
  'name', 'breed', 'age_text', 'age_months', 'gender', 'weight_kg', 'size',
  'emoji', 'image_url', 'location', 'shelter_id', 'about', 'vaccinated',
  'neutered', 'dewormed', 'microchipped', 'good_with', 'energy_level',
  'exercise', 'grooming', 'space', 'diet', 'traits', 'urgent', 'featured', 'adopted'
];
const BOOL_FIELDS = ['vaccinated', 'neutered', 'dewormed', 'microchipped', 'urgent', 'featured', 'adopted'];

function normalizeDog(body) {
  const out = {};
  for (const f of DOG_FIELDS) {
    let v = body[f];
    if (BOOL_FIELDS.includes(f)) v = v ? 1 : 0;
    else if (f === 'age_months' || f === 'weight_kg') v = v === '' || v == null ? null : Number(v);
    else if (f === 'shelter_id') v = v === '' || v == null ? null : String(v);
    else v = v == null ? '' : String(v);
    out[f] = v;
  }
  return out;
}

function validateShelter(db, shelterId) {
  if (!shelterId) return true;
  return !!db.prepare('SELECT 1 FROM shelters WHERE id = ?').get(shelterId);
}

router.get('/', (req, res) => {
  const db = getDb();
  const { search, filter, limit = 50 } = req.query;

  let query = 'SELECT d.*, s.name as shelter_name FROM dogs d LEFT JOIN shelters s ON d.shelter_id = s.id WHERE d.adopted = 0';
  const params = [];

  if (search) {
    query += ' AND (d.name LIKE ? OR d.breed LIKE ? OR d.location LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (filter && filter !== 'all') {
    switch (filter) {
      case 'puppy': query += ' AND d.age_months < 12'; break;
      case 'adult': query += ' AND d.age_months >= 12 AND d.age_months < 84'; break;
      case 'senior': query += ' AND d.age_months >= 84'; break;
      case 'female': query += ' AND d.gender = ?'; params.push('Female'); break;
      case 'male': query += ' AND d.gender = ?'; params.push('Male'); break;
      case 'vaccinated': query += ' AND d.vaccinated = 1'; break;
      case 'small': query += ' AND d.size = ?'; params.push('Small'); break;
      case 'large': query += ' AND d.size = ?'; params.push('Large'); break;
      case 'trained': query += ' AND d.neutered = 1 AND d.vaccinated = 1'; break;
    }
  }

  query += ' ORDER BY d.featured DESC, d.urgent DESC, d.created_at DESC LIMIT ?';
  params.push(Number(limit));

  const dogs = db.prepare(query).all(...params);
  res.json({ dogs });
});

router.get('/featured', (req, res) => {
  const db = getDb();
  const dog = db.prepare('SELECT d.*, s.name as shelter_name FROM dogs d LEFT JOIN shelters s ON d.shelter_id = s.id WHERE d.featured = 1 AND d.adopted = 0 LIMIT 1').get();
  res.json({ dog });
});

router.get('/urgent', (req, res) => {
  const db = getDb();
  const dogs = db.prepare('SELECT id, name, emoji, age_text FROM dogs WHERE urgent = 1 AND adopted = 0').all();
  res.json({ dogs });
});

router.get('/recent', (req, res) => {
  const db = getDb();
  const dogs = db.prepare('SELECT id, name, emoji, breed, age_text FROM dogs WHERE adopted = 0 ORDER BY created_at DESC LIMIT 6').all();
  res.json({ dogs });
});

router.get('/admin/all', requireAdmin, (req, res) => {
  const db = getDb();
  const dogs = db.prepare('SELECT d.*, s.name as shelter_name FROM dogs d LEFT JOIN shelters s ON d.shelter_id = s.id ORDER BY d.created_at DESC').all();
  res.json({ dogs });
});

router.post('/', requireAdmin, (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Dog name is required' });
  const db = getDb();
  const d = normalizeDog(req.body);
  if (!validateShelter(db, d.shelter_id)) return res.status(400).json({ error: 'Selected shelter does not exist' });
  const id = uuidv4();
  const cols = ['id', ...DOG_FIELDS];
  db.prepare(`INSERT INTO dogs (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`)
    .run(id, ...DOG_FIELDS.map(f => d[f]));
  const dog = db.prepare('SELECT * FROM dogs WHERE id = ?').get(id);
  res.json({ dog });
});

router.put('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM dogs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Dog not found' });
  if (!req.body.name) return res.status(400).json({ error: 'Dog name is required' });
  const d = normalizeDog(req.body);
  if (!validateShelter(db, d.shelter_id)) return res.status(400).json({ error: 'Selected shelter does not exist' });
  db.prepare(`UPDATE dogs SET ${DOG_FIELDS.map(f => `${f} = ?`).join(', ')} WHERE id = ?`)
    .run(...DOG_FIELDS.map(f => d[f]), req.params.id);
  const dog = db.prepare('SELECT * FROM dogs WHERE id = ?').get(req.params.id);
  res.json({ dog });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM dogs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Dog not found' });
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM favourites WHERE dog_id = ?').run(req.params.id);
    db.prepare('DELETE FROM applications WHERE dog_id = ?').run(req.params.id);
    db.prepare('DELETE FROM dogs WHERE id = ?').run(req.params.id);
  });
  tx();
  res.json({ ok: true });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const dog = db.prepare('SELECT d.*, s.name as shelter_name, s.hours as shelter_hours, s.distance_km as shelter_distance FROM dogs d LEFT JOIN shelters s ON d.shelter_id = s.id WHERE d.id = ?').get(req.params.id);
  if (!dog) return res.status(404).json({ error: 'Dog not found' });

  const similar = db.prepare('SELECT id, name, emoji, breed, age_text FROM dogs WHERE id != ? AND adopted = 0 AND size = ? LIMIT 4').all(dog.id, dog.size);
  res.json({ dog, similar });
});

router.post('/:id/favourite', requireAuth, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT 1 FROM favourites WHERE user_id = ? AND dog_id = ?').get(req.session.userId, req.params.id);
  if (existing) {
    db.prepare('DELETE FROM favourites WHERE user_id = ? AND dog_id = ?').run(req.session.userId, req.params.id);
    res.json({ favourited: false });
  } else {
    db.prepare('INSERT INTO favourites (user_id, dog_id) VALUES (?, ?)').run(req.session.userId, req.params.id);
    res.json({ favourited: true });
  }
});

router.get('/:id/favourite', requireAuth, (req, res) => {
  const db = getDb();
  const fav = db.prepare('SELECT 1 FROM favourites WHERE user_id = ? AND dog_id = ?').get(req.session.userId, req.params.id);
  res.json({ favourited: !!fav });
});

module.exports = router;
