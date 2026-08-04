const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, data } = JSON.parse(body);
        const base64 = data.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path.join(dir, name), Buffer.from(base64, 'base64'));
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
  }
});
server.listen(3999, () => console.log('Screenshot server on :3999'));
