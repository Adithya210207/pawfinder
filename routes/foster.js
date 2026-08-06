const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const dogs = db.prepare(`
    SELECT f.*, s.name as shelter_name
    FROM foster_dogs f
    LEFT JOIN shelters s ON f.shelter_id = s.id
    ORDER BY CASE f.urgency WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
  `).all();
  res.json({ dogs });
});

router.get('/stats', (req, res) => {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM foster_dogs').get().c;
  res.json({ active_fosters: 47, dogs_fostered: 214, become_adopters: 78, available: count });
});

module.exports = router;
