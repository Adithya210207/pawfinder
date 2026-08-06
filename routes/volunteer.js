const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

router.get('/roles', (req, res) => {
  const db = getDb();
  const roles = db.prepare('SELECT * FROM volunteer_roles').all();
  res.json({ roles });
});

router.get('/events', (req, res) => {
  const db = getDb();
  const events = db.prepare('SELECT * FROM volunteer_events ORDER BY event_date ASC').all();
  res.json({ events });
});

router.get('/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, name: 'Priya Sharma', initials: 'PS', color: '#5a3a8a', points: 2840, sub: '142 hrs this month' },
      { rank: 2, name: 'Rajesh Kumar', initials: 'RK', color: '#3a5a8a', points: 2210, sub: '118 hrs' },
      { rank: 3, name: 'Meera Nair', initials: 'MN', color: '#8a3a5a', points: 1980, sub: '96 hrs' },
      { rank: 4, name: 'Suresh P.', initials: 'SP', color: '#3a8a5a', points: 1650, sub: '82 hrs' },
      { rank: 5, name: 'Kavitha L.', initials: 'KL', color: '#8a5a3a', points: 1420, sub: '71 hrs' }
    ]
  });
});

router.get('/stats', (req, res) => {
  res.json({ total_volunteers: 4290, open_roles: 38, return_rate: 92 });
});

module.exports = router;
