const express = require('express');
const { getDb } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { category } = req.query;

  let query = 'SELECT id, title, category, emoji, read_time, author, summary, likes, bg_color FROM articles';
  const params = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY likes DESC';
  const articles = db.prepare(query).all(...params);
  res.json({ articles });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const related = db.prepare('SELECT id, title, emoji, category, read_time FROM articles WHERE category = ? AND id != ? LIMIT 3')
    .all(article.category, article.id);
  res.json({ article, related });
});

module.exports = router;
