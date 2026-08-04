const express = require('express');
const session = require('express-session');
const path = require('path');
const { initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

initializeDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'pawfinder-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dogs', require('./routes/dogs'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/foster', require('./routes/foster'));
app.use('/api/volunteer', require('./routes/volunteer'));
app.use('/api/chat', require('./routes/chat'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

function start() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`\n  🐾 PawFinder is running at http://localhost:${PORT}\n`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

// Run the server directly only when launched via `node server.js`.
// When required by the Electron shell, electron-main.js calls start().
if (require.main === module) {
  start();
}

module.exports = { app, start, PORT };
