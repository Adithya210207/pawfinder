const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const AI_RESPONSES = {
  'schedule': 'You can schedule a visit by calling us at our shelter number during working hours (9AM-5PM), or I can help you book a slot right here! We have openings this Saturday from 10AM-2PM. Would you like to book?',
  'vaccin': 'Yes! All our dogs receive a complete vaccination course including DHPP and Rabies. We also deworm every 3 months. You will receive the full medical records at the time of adoption.',
  'fee': 'Our adoption fee is Rs 2,000-3,500 which covers vaccinations, sterilization, microchipping, and a starter kit. This is significantly less than the lifetime cost of these procedures separately.',
  'foster': 'Absolutely! We encourage foster-before-adopt. You can take the dog home for 2 weeks to see if it is a good match. We provide food, medical support, and 24/7 guidance via WhatsApp.',
  'food': 'We feed our dogs a balanced diet of quality dry kibble supplemented with boiled rice and chicken. Each dog has a diet card. We will share the exact diet plan when you visit.',
  'train': 'Many of our dogs know basic commands like sit, stay, and come. We also partner with certified trainers who offer discounted sessions for adopters.',
  'time': 'The adoption process typically takes 5-7 days: application review (48 hrs), home visit (by appointment), paperwork, and then you can bring your new companion home!',
  'default': 'Thank you for your interest! I would be happy to help. You can ask me about visiting hours, adoption fees, vaccination records, fostering, or anything about our dogs. How can I help you?'
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(AI_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! Welcome to our shelter. How can I help you today? You can ask about our available dogs, adoption process, visiting hours, or anything else!';
  }
  if (lower.includes('thank')) {
    return 'You are welcome! We are always here to help. Feel free to reach out anytime. We look forward to helping you find your perfect companion! 🐾';
  }
  return AI_RESPONSES.default;
}

router.get('/:shelterId', requireAuth, (req, res) => {
  const db = getDb();
  const messages = db.prepare('SELECT * FROM messages WHERE shelter_id = ? AND user_id = ? ORDER BY created_at ASC')
    .all(req.params.shelterId, req.session.userId);
  res.json({ messages });
});

router.post('/:shelterId', requireAuth, (req, res) => {
  const db = getDb();
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Message is required' });

  const userMsgId = uuidv4();
  db.prepare('INSERT INTO messages (id, shelter_id, user_id, sender, content) VALUES (?, ?, ?, ?, ?)')
    .run(userMsgId, req.params.shelterId, req.session.userId, 'user', content);

  const aiResponse = getAIResponse(content);
  const aiMsgId = uuidv4();
  db.prepare('INSERT INTO messages (id, shelter_id, user_id, sender, content) VALUES (?, ?, ?, ?, ?)')
    .run(aiMsgId, req.params.shelterId, req.session.userId, 'shelter', aiResponse);

  res.json({
    userMessage: { id: userMsgId, sender: 'user', content, created_at: new Date().toISOString() },
    aiMessage: { id: aiMsgId, sender: 'shelter', content: aiResponse, created_at: new Date().toISOString() }
  });
});

module.exports = router;
