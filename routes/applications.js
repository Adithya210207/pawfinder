const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ── Document upload setup ──
const UPLOAD_DIR = process.env.PAWFINDER_UPLOADS || path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const DOC_SLOTS = [
  { field: 'doc_gov_id', type: 'gov_id', label: 'Government ID', max: 1 },
  { field: 'doc_address', type: 'address', label: 'Address proof', max: 1 },
  { field: 'doc_income', type: 'income', label: 'Income proof', max: 1 },
  { field: 'doc_photos', type: 'photos', label: 'Home photos', max: 8 }
];
const SLOT_BY_FIELD = Object.fromEntries(DOC_SLOTS.map(s => [s.field, s]));
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'application/pdf'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 12).replace(/[^.\w]/g, '');
    cb(null, `${uuidv4()}${ext || ''}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error('Only images (JPG, PNG, WEBP) and PDF files are accepted'));
  }
}).fields(DOC_SLOTS.map(s => ({ name: s.field, maxCount: s.max })));

function handleUpload(req, res, next) {
  upload(req, res, err => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Each file must be under 8 MB' });
      if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ error: 'Too many files uploaded' });
      return res.status(400).json({ error: 'Upload failed: ' + err.message });
    }
    return res.status(400).json({ error: err.message || 'Upload failed' });
  });
}

function attachDocuments(db, applications) {
  if (!applications.length) return applications;
  const ids = applications.map(a => a.id);
  const rows = db.prepare(
    `SELECT id, application_id, doc_type, label, original_name, mime_type, size, created_at
     FROM application_documents
     WHERE application_id IN (${ids.map(() => '?').join(',')})
     ORDER BY created_at ASC`
  ).all(...ids);
  const byApp = {};
  for (const r of rows) (byApp[r.application_id] = byApp[r.application_id] || []).push(r);
  for (const a of applications) a.documents = byApp[a.id] || [];
  return applications;
}

const APP_SELECT = `
  SELECT a.*, d.name as dog_name, d.emoji as dog_emoji, d.breed as dog_breed,
         u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone,
         u.city as applicant_city, s.name as shelter_name
  FROM applications a
  JOIN dogs d ON a.dog_id = d.id
  JOIN users u ON a.user_id = u.id
  LEFT JOIN shelters s ON d.shelter_id = s.id`;

// ── My applications ──
router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const apps = db.prepare(`
    SELECT a.*, d.name as dog_name, d.emoji as dog_emoji, d.breed as dog_breed,
           s.name as shelter_name
    FROM applications a
    JOIN dogs d ON a.dog_id = d.id
    LEFT JOIN shelters s ON d.shelter_id = s.id
    WHERE a.user_id = ?
    ORDER BY a.created_at DESC
  `).all(req.session.userId);
  attachDocuments(db, apps);
  res.json({ applications: apps });
});

// ── Submit a new application (with documents) ──
router.post('/', requireAuth, handleUpload, (req, res) => {
  const db = getDb();
  const { dog_id, residence_type, outdoor_space, experience, other_pets, children, alone_hours, reason } = req.body;

  if (!dog_id) return res.status(400).json({ error: 'Dog ID is required' });

  const dog = db.prepare('SELECT name FROM dogs WHERE id = ?').get(dog_id);
  if (!dog) return res.status(404).json({ error: 'Dog not found' });

  const existing = db.prepare('SELECT id FROM applications WHERE user_id = ? AND dog_id = ? AND status != ?')
    .get(req.session.userId, dog_id, 'rejected');
  if (existing) return res.status(409).json({ error: 'You already have an application for this dog' });

  const id = uuidv4();
  const insertAll = db.transaction(() => {
    db.prepare(`INSERT INTO applications (id, user_id, dog_id, residence_type, outdoor_space, experience, other_pets, children, alone_hours, reason, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 25)`).run(
      id, req.session.userId, dog_id,
      residence_type || '', outdoor_space || '', experience || '',
      other_pets || '', children || '', alone_hours || '', reason || ''
    );

    const docStmt = db.prepare(`INSERT INTO application_documents
      (id, application_id, doc_type, label, file_name, original_name, mime_type, size)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    for (const slot of DOC_SLOTS) {
      const files = (req.files && req.files[slot.field]) || [];
      for (const f of files) {
        docStmt.run(uuidv4(), id, slot.type, slot.label, f.filename, f.originalname || slot.label, f.mimetype, f.size);
      }
    }

    db.prepare('INSERT INTO notifications (id, user_id, title, body) VALUES (?, ?, ?, ?)').run(
      uuidv4(), req.session.userId,
      `Application submitted for ${dog.name}! 📋`,
      'The shelter will review your application and documents within 48 hours. You can track progress in the Adopt tab.'
    );
  });

  try {
    insertAll();
  } catch (e) {
    return res.status(500).json({ error: 'Could not save application. Please try again.' });
  }

  const application = db.prepare(`
    SELECT a.*, d.name as dog_name, d.emoji as dog_emoji, d.breed as dog_breed, s.name as shelter_name
    FROM applications a
    JOIN dogs d ON a.dog_id = d.id
    LEFT JOIN shelters s ON d.shelter_id = s.id
    WHERE a.id = ?
  `).get(id);
  attachDocuments(db, [application]);
  res.json({ application });
});

router.get('/count', requireAuth, (req, res) => {
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as c FROM applications WHERE user_id = ?').get(req.session.userId);
  res.json({ count: count.c });
});

// ── Secure document access — owner or admin only ──
router.get('/documents/:id', requireAuth, (req, res) => {
  const db = getDb();
  const doc = db.prepare(`
    SELECT ad.*, a.user_id as owner_id
    FROM application_documents ad
    JOIN applications a ON ad.application_id = a.id
    WHERE ad.id = ?
  `).get(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const me = db.prepare('SELECT is_admin FROM users WHERE id = ?').get(req.session.userId);
  const isOwner = doc.owner_id === req.session.userId;
  if (!isOwner && !(me && me.is_admin)) {
    return res.status(403).json({ error: 'Not allowed to view this document' });
  }

  const filePath = path.join(UPLOAD_DIR, doc.file_name);
  if (!filePath.startsWith(UPLOAD_DIR) || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File is no longer available' });
  }
  if (doc.mime_type) res.type(doc.mime_type);
  const safeName = (doc.original_name || 'document').replace(/[^\w.\- ]/g, '_');
  res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
  res.sendFile(filePath);
});

// ── Admin: review & decide on adoption applications ──
router.get('/admin/all', requireAdmin, (req, res) => {
  const db = getDb();
  const { status } = req.query;
  let query = APP_SELECT;
  const params = [];
  if (status && status !== 'all') {
    query += ' WHERE a.status = ?';
    params.push(status);
  }
  query += " ORDER BY CASE a.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END, a.updated_at DESC, a.created_at DESC";
  const applications = db.prepare(query).all(...params);
  attachDocuments(db, applications);
  const counts = db.prepare(`
    SELECT
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
      COUNT(*) as total
    FROM applications`).get();
  res.json({ applications, counts });
});

router.post('/:id/decision', requireAdmin, (req, res) => {
  const db = getDb();
  const { decision } = req.body;
  if (!['approve', 'reject'].includes(decision)) {
    return res.status(400).json({ error: 'Decision must be "approve" or "reject"' });
  }

  const application = db.prepare(`
    SELECT a.*, d.name as dog_name FROM applications a
    JOIN dogs d ON a.dog_id = d.id WHERE a.id = ?
  `).get(req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });
  if (application.status !== 'pending') {
    return res.status(409).json({ error: `This application is already ${application.status}` });
  }

  const apply = db.transaction(() => {
    if (decision === 'approve') {
      db.prepare("UPDATE applications SET status = 'approved', progress = 100, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(application.id);
      db.prepare('UPDATE dogs SET adopted = 1 WHERE id = ?').run(application.dog_id);
      db.prepare('INSERT INTO notifications (id, user_id, title, body) VALUES (?, ?, ?, ?)').run(
        uuidv4(), application.user_id,
        `Your adoption of ${application.dog_name} is approved! 🎉`,
        `Congratulations! The shelter has approved your application. They will contact you shortly to arrange the home visit and paperwork.`
      );
      const others = db.prepare("SELECT id, user_id FROM applications WHERE dog_id = ? AND id != ? AND status = 'pending'")
        .all(application.dog_id, application.id);
      for (const o of others) {
        db.prepare("UPDATE applications SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(o.id);
        db.prepare('INSERT INTO notifications (id, user_id, title, body) VALUES (?, ?, ?, ?)').run(
          uuidv4(), o.user_id,
          `Update on your application for ${application.dog_name}`,
          `${application.dog_name} has found a forever home with another family. Don't give up — many wonderful dogs are still waiting for you! 🐾`
        );
      }
    } else {
      db.prepare("UPDATE applications SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(application.id);
      db.prepare('INSERT INTO notifications (id, user_id, title, body) VALUES (?, ?, ?, ?)').run(
        uuidv4(), application.user_id,
        `Update on your application for ${application.dog_name}`,
        `After review, the shelter is unable to proceed with this application at this time. Please reach out to the shelter for feedback, and consider other dogs waiting for a home. 🐾`
      );
    }
  });
  apply();

  const updated = db.prepare(`${APP_SELECT} WHERE a.id = ?`).get(application.id);
  attachDocuments(db, [updated]);
  res.json({ application: updated });
});

module.exports = router;
