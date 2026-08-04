// ═══════════════════════════════════════════════════════════════
// PawFinder — Frontend Application
// ═══════════════════════════════════════════════════════════════

const API = {
  async get(url) {
    const res = await fetch(url);
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async put(url, data) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  async del(url) {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
    return res.json();
  }
};

// ── State ──
let currentUser = null;
let currentDog = null;
let currentShelterId = null;
let currentFilter = 'all';
let pageHistory = [];
let fosterCache = {};
let adminTab = 'applications';
let adminAppStatus = 'all';
let shelterCache = {};

// ── Utility ──
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function showLoading(msg = 'Loading...') {
  $('#loading-text').textContent = msg;
  $('#loading').style.display = 'flex';
}
function hideLoading() { $('#loading').style.display = 'none'; }

function showPage(id) {
  const current = document.querySelector('.page.active');
  if (current && current.id !== id) {
    pageHistory.push(current.id);
  }
  $$('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
}

function goBack() {
  const prev = pageHistory.pop();
  if (prev) {
    $$('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(prev).classList.add('active');
  }
}

// ── Auth ──
async function checkAuth() {
  try {
    const { user } = await API.get('/api/auth/me');
    if (user) {
      currentUser = user;
      enterApp();
    }
  } catch (e) { /* not logged in */ }
}

async function login(email, password) {
  try {
    const { user } = await API.post('/api/auth/login', { email, password });
    currentUser = user;
    enterApp();
  } catch (e) {
    const err = $('#login-error');
    err.textContent = e.error || 'Login failed';
    err.classList.add('show');
  }
}

async function register() {
  const data = {
    name: $('#reg-name').value,
    email: $('#reg-email').value,
    phone: $('#reg-phone').value,
    city: $('#reg-city').value,
    password: $('#reg-password').value
  };
  try {
    const { user } = await API.post('/api/auth/register', data);
    currentUser = user;
    enterApp();
  } catch (e) {
    const err = $('#register-error');
    err.textContent = e.error || 'Registration failed';
    err.classList.add('show');
  }
}

async function logout() {
  await API.post('/api/auth/logout');
  currentUser = null;
  $('#bottom-nav').style.display = 'none';
  pageHistory = [];
  showPage('page-login');
}

function enterApp() {
  $('#greeting-text').textContent = `Hello, ${currentUser.name.split(' ')[0]} 👋`;
  $('#user-avatar').textContent = currentUser.avatar_initials || 'U';
  $('#bottom-nav').style.display = 'flex';
  showPage('page-home');
  loadHomePage();
  checkNotifications();
}

// ── Home Page ──
async function loadHomePage() {
  loadFeaturedDog();
  loadDogs();
  loadUrgentDogs();
  loadRecentDogs();
  loadTips();
  renderQuiz();
  loadMapLabel();
}

async function loadMapLabel() {
  try {
    const { stats } = await API.get('/api/shelters/stats');
    const el = $('#map-label');
    if (el && stats) el.textContent = `${stats.total_shelters} shelters across Coimbatore`;
  } catch (e) { /* keep default */ }
}

async function loadFeaturedDog() {
  try {
    const { dog } = await API.get('/api/dogs/featured');
    if (!dog) return;
    $('#featured-dog').innerHTML = `
      <div class="featured-card" data-dog="${dog.id}">
        <div class="featured-img">${dog.emoji}</div>
        <div class="featured-info">
          <div class="featured-name">${dog.name}</div>
          <div class="featured-sub">${dog.breed} · ${dog.age_text} · ${dog.location}</div>
          <div class="verified-badge">🏥 ${dog.shelter_name} · Verified</div>
        </div>
        <button class="featured-adopt-btn" data-dog="${dog.id}">Adopt</button>
      </div>`;
  } catch (e) { console.error(e); }
}

async function loadDogs(filter = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (search) params.set('search', search);
    const { dogs } = await API.get(`/api/dogs?${params}`);
    renderDogGrid(dogs);
    if (filter === 'all' && !search) {
      const hc = $('#hero-dog-count');
      if (hc) hc.textContent = dogs.length;
    }
  } catch (e) { console.error(e); }
}

function renderDogGrid(dogs) {
  const grid = $('#dog-grid');
  grid.innerHTML = dogs.map(d => `
    <div class="dog-card" data-dog="${d.id}">
      <div class="dog-card-img">
        ${d.urgent ? '<div class="dog-card-urgency">URGENT</div>' : ''}
        ${d.emoji}
      </div>
      <div class="dog-card-body">
        <div class="dog-card-name">${d.name}</div>
        <div class="dog-card-sub">${d.breed} · ${d.age_text} · ${d.gender}</div>
        <div class="dog-card-tags">
          ${d.vaccinated ? '<span class="tag tag-green">Vaccinated</span>' : ''}
          ${d.neutered ? '<span class="tag tag-blue">Neutered</span>' : ''}
          ${d.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}
        </div>
        <div class="dog-card-cta">Meet ${d.name} <span>→</span></div>
      </div>
    </div>`).join('');
}

async function loadUrgentDogs() {
  try {
    const { dogs } = await API.get('/api/dogs/urgent');
    if (!dogs.length) return;
    const banner = $('#urgent-banner');
    banner.style.display = 'block';
    banner.innerHTML = `
      <div class="urgent-title">🚨 Urgent — needs immediate home</div>
      <div class="urgent-sub">These dogs are running out of shelter space</div>
      <div class="urgent-dogs">
        ${dogs.map(d => `<div class="urgent-chip" data-dog="${d.id}">${d.emoji} ${d.name} · ${d.age_text}</div>`).join('')}
      </div>`;
  } catch (e) { console.error(e); }
}

async function loadRecentDogs() {
  try {
    const { dogs } = await API.get('/api/dogs/recent');
    $('#recent-dogs').innerHTML = dogs.map(d => `
      <div class="h-dog-card" data-dog="${d.id}">
        <div class="h-dog-img">${d.emoji}</div>
        <div class="h-dog-body">
          <div class="h-dog-name">${d.name}</div>
          <div class="h-dog-sub">${d.breed} · ${d.age_text}</div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

function loadTips() {
  const tips = [
    { emoji: '🏠', title: 'Prep your home', sub: 'Before your dog arrives', article: 'a1' },
    { emoji: '💉', title: 'Vaccines', sub: 'Full schedule guide', article: 'a3' },
    { emoji: '🐾', title: 'Body language', sub: 'Read your dog', article: 'a5' },
    { emoji: '🍚', title: 'Nutrition', sub: 'Feeding basics', article: 'a7' },
    { emoji: '🧠', title: 'Training 101', sub: 'Positive reinforcement', article: 'a9' }
  ];
  $('#tips-row').innerHTML = tips.map(t => `
    <div class="tip-card" data-article="${t.article}">
      <div class="tip-emoji">${t.emoji}</div>
      <div class="tip-title">${t.title}</div>
      <div class="tip-sub">${t.sub}</div>
    </div>`).join('');
}

// ── Quiz (rotating question bank) ──
const QUIZ_BANK = [
  { q: 'How long is the average gestation period of a dog?', o: ['45 days', '63 days', '90 days', '30 days'], a: 1, e: 'Dogs are pregnant for roughly 63 days (about 9 weeks).' },
  { q: 'At what age should a puppy get its first rabies vaccine?', o: ['2 weeks', '3 months', '8 months', '1 year'], a: 1, e: 'The first rabies shot is given around 3 months of age, with annual boosters after.' },
  { q: 'Which of these foods is toxic to dogs?', o: ['Carrot', 'Boiled rice', 'Grapes', 'Pumpkin'], a: 2, e: 'Grapes and raisins can cause kidney failure in dogs. Onions and chocolate are also toxic.' },
  { q: 'A wagging tail always means a dog is happy.', o: ['True', 'False'], a: 1, e: 'False — a stiff, high wag can signal alertness or agitation. Read the whole body.' },
  { q: 'How often should an adult dog typically be fed?', o: ['Once a day', 'Twice a day', 'Every 2 hours', 'Only at night'], a: 1, e: 'Most adult dogs do well on two meals a day; puppies need 3-4 smaller meals.' },
  { q: 'What is the main benefit of spaying or neutering?', o: ['Faster running', 'Reduces strays & some cancers', 'Changes coat colour', 'Makes dogs aggressive'], a: 1, e: 'Sterilisation humanely reduces the stray population and lowers some cancer risks.' },
  { q: 'Roughly how many stray dogs does India have?', o: ['1 million', '10 million', '62 million', '500,000'], a: 2, e: 'India has an estimated 62 million stray dogs — the largest such population in the world.' },
  { q: 'Best time to walk a dog during a hot Coimbatore summer?', o: ['12-2 PM', 'Before 7 AM or after 6:30 PM', 'Anytime', '3-4 PM'], a: 1, e: 'Walk in the cool early morning or evening; hot pavement can burn paw pads.' },
  { q: 'What does a "play bow" (front down, rear up) mean?', o: ['Aggression', 'An invitation to play', 'Fear', 'Hunger'], a: 1, e: 'The play bow is a friendly invitation to play.' },
  { q: 'The "3-3-3 rule" for a new rescue refers to…', o: ['3 walks, 3 meals, 3 toys', '3 days, 3 weeks, 3 months to settle', '3 vets in 3 days', '3 baths a week'], a: 1, e: '3 days to decompress, 3 weeks to learn the routine, 3 months to truly settle in.' },
  { q: 'Which vaccine is required by law in India?', o: ['Rabies', 'Bordetella', 'Canine Influenza', 'None'], a: 0, e: 'Rabies vaccination is legally required and renewed annually.' },
  { q: 'Indian indie (street) dogs are generally…', o: ['Fragile and sickly', 'Resilient and well-adapted', 'Unable to bond', 'Always aggressive'], a: 1, e: 'Indies are hardy, intelligent, and naturally suited to the Indian climate.' }
];
let quizIndex = Math.floor(Math.random() * QUIZ_BANK.length);
let quizAnswered = false;

function renderQuiz() {
  const card = $('#quiz-card');
  if (!card) return;
  const total = QUIZ_BANK.length;
  const idx = ((quizIndex % total) + total) % total;
  const item = QUIZ_BANK[idx];
  quizAnswered = false;

  const prog = $('#quiz-progress');
  if (prog) prog.textContent = `Q${idx + 1} / ${total}`;
  $('#quiz-question').textContent = item.q;
  $('#quiz-options').innerHTML = item.o.map((opt, i) =>
    `<div class="quiz-option" data-i="${i}">${opt}</div>`).join('');
  const explain = $('#quiz-explain');
  explain.textContent = '';
  explain.classList.remove('show');
  $('#quiz-next').style.display = 'none';
}

function answerQuiz(optEl) {
  if (quizAnswered) return;
  const total = QUIZ_BANK.length;
  const idx = ((quizIndex % total) + total) % total;
  const item = QUIZ_BANK[idx];
  const chosen = Number(optEl.dataset.i);
  quizAnswered = true;

  $$('#quiz-options .quiz-option').forEach(el => {
    const i = Number(el.dataset.i);
    if (i === item.a) el.classList.add('correct');
    else if (i === chosen) el.classList.add('wrong');
    el.style.pointerEvents = 'none';
  });

  const correct = chosen === item.a;
  const explain = $('#quiz-explain');
  explain.innerHTML = `<b>${correct ? '✅ Correct!' : '❌ Not quite.'}</b> ${item.e}`;
  explain.classList.add('show');
  $('#quiz-next').style.display = 'block';
  showToast(correct ? 'Correct! 🎉' : 'Good try — check the explanation');
}

// ── Dog Profile ──
async function openDogProfile(dogId) {
  showLoading('Loading profile...');
  try {
    const { dog, similar } = await API.get(`/api/dogs/${dogId}`);
    currentDog = dog;
    currentShelterId = dog.shelter_id;

    const traits = (dog.traits || '').split(',').filter(Boolean);
    const goodWith = (dog.good_with || '').split(',').filter(Boolean);

    let favHtml = '🤍';
    try {
      const { favourited } = await API.get(`/api/dogs/${dogId}/favourite`);
      if (favourited) {
        favHtml = '❤️';
        $('#heart-btn').classList.add('liked');
      } else {
        $('#heart-btn').classList.remove('liked');
      }
    } catch (e) { /* ok */ }
    $('#heart-btn').innerHTML = favHtml;

    $('#profile-content').innerHTML = `
      <div class="profile-hero">${dog.emoji}</div>
      <div class="profile-body">
        <div class="profile-name-row">
          <div class="profile-name">${dog.name}</div>
          <div class="verified-pill">✓ Verified rescue</div>
        </div>
        <div class="profile-location">📍 ${dog.location || 'Coimbatore'}</div>
        <div class="tags-row">
          ${dog.vaccinated ? '<span class="tag tag-green">Vaccinated</span>' : ''}
          ${dog.neutered ? '<span class="tag tag-blue">Neutered</span>' : ''}
          ${dog.dewormed ? '<span class="tag tag-green">Dewormed</span>' : ''}
          ${dog.microchipped ? '<span class="tag tag-purple">Microchipped</span>' : ''}
          ${dog.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}
        </div>
        <div class="stats-row">
          <div class="stat-box"><div class="stat-val">${dog.age_text}</div><div class="stat-label">Age</div></div>
          <div class="stat-box"><div class="stat-val">${dog.gender}</div><div class="stat-label">Gender</div></div>
          <div class="stat-box"><div class="stat-val">${dog.weight_kg} kg</div><div class="stat-label">Weight</div></div>
          <div class="stat-box"><div class="stat-val">${dog.size}</div><div class="stat-label">Size</div></div>
        </div>
        <div class="stats-row">
          <div class="stat-box" style="text-align:left;padding:14px 16px">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Good with</div>
            <div style="font-size:13px;color:var(--text-secondary)">${goodWith.join(' · ') || 'Ask shelter'}</div>
          </div>
          <div class="stat-box" style="text-align:left;padding:14px 16px">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">Energy level</div>
            <div style="font-size:13px;color:var(--accent-light)">${dog.energy_level || 'Medium'}</div>
          </div>
        </div>

        <div class="about-title">About ${dog.name}</div>
        <div class="about-text">${dog.about || 'No description available.'}</div>

        <div class="about-title">Health & Medical</div>
        <div class="info-card">
          <div class="health-row">
            <div class="health-label">Vaccination</div>
            <div class="health-status ${dog.vaccinated ? 'hs-good' : 'hs-pending'}">${dog.vaccinated ? 'Complete ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Neutering</div>
            <div class="health-status ${dog.neutered ? 'hs-good' : 'hs-pending'}">${dog.neutered ? 'Done ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Deworming</div>
            <div class="health-status ${dog.dewormed ? 'hs-good' : 'hs-pending'}">${dog.dewormed ? 'Up to date ✓' : 'Pending'}</div>
          </div>
          <div class="health-row">
            <div class="health-label">Microchip</div>
            <div class="health-status ${dog.microchipped ? 'hs-good' : 'hs-pending'}">${dog.microchipped ? 'Yes ✓' : 'No'}</div>
          </div>
        </div>

        <div class="about-title">Care needs</div>
        <div class="info-card">
          <div class="info-row"><div class="info-icon">🚶</div><div class="info-text">${dog.exercise || '2 walks per day'}</div></div>
          <div class="info-row"><div class="info-icon">✂️</div><div class="info-text">${dog.grooming || 'Low maintenance'}</div></div>
          <div class="info-row"><div class="info-icon">🏠</div><div class="info-text">${dog.space || 'Apartment-friendly'}</div></div>
          <div class="info-row"><div class="info-icon">🍚</div><div class="info-text">${dog.diet || 'Dry kibble · 2x daily'}</div></div>
        </div>

        <div class="about-title">Personality</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
          ${traits.map(t => `<span class="trait-chip">${t.trim()}</span>`).join('')}
        </div>

        <div class="about-title">Rescue shelter</div>
        <div class="shelter-card" ${dog.shelter_id ? `data-shelter="${dog.shelter_id}"` : ''} style="cursor:pointer">
          <div class="shelter-icon">🏥</div>
          <div>
            <div class="shelter-name">${dog.shelter_name || 'Unknown'}</div>
            <div class="shelter-sub">Open · ${dog.shelter_hours || '9AM-5PM'} · ${dog.shelter_distance || '?'}km</div>
          </div>
          <div style="margin-left:auto;color:var(--text-muted)">›</div>
        </div>

        ${similar.length ? `
          <div class="about-title">You might also like</div>
          <div class="h-scroll" style="padding:0 0 16px">
            ${similar.map(s => `
              <div class="h-dog-card" data-dog="${s.id}">
                <div class="h-dog-img">${s.emoji}</div>
                <div class="h-dog-body">
                  <div class="h-dog-name">${s.name}</div>
                  <div class="h-dog-sub">${s.breed} · ${s.age_text}</div>
                </div>
              </div>`).join('')}
          </div>` : ''}
      </div>`;

    showPage('page-profile');
  } catch (e) {
    showToast('Failed to load profile');
    console.error(e);
  } finally {
    hideLoading();
  }
}

async function toggleFavourite() {
  if (!currentDog) return;
  try {
    const { favourited } = await API.post(`/api/dogs/${currentDog.id}/favourite`);
    $('#heart-btn').innerHTML = favourited ? '❤️' : '🤍';
    $('#heart-btn').classList.toggle('liked', favourited);
    showToast(favourited ? 'Added to saved dogs ❤️' : 'Removed from saved dogs');
  } catch (e) { showToast('Please sign in first'); }
}

// ── Chat ──
async function openChat(shelterId, shelterName) {
  currentShelterId = shelterId;
  $('#chat-shelter-name').textContent = shelterName || 'Shelter';
  $('#chat-messages').innerHTML = '';
  showPage('page-chat');

  try {
    const { messages } = await API.get(`/api/chat/${shelterId}`);
    messages.forEach(m => appendMessage(m.sender, m.content));
    if (!messages.length) {
      appendMessage('shelter', 'Welcome! How can I help you with your adoption journey? Feel free to ask about our dogs, visiting hours, fees, or anything else. 🐾');
    }
  } catch (e) { console.error(e); }
}

function appendMessage(sender, content) {
  const div = document.createElement('div');
  div.className = `msg-bubble from-${sender === 'user' ? 'user' : 'shelter'}`;
  div.innerHTML = `${content}<div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
  $('#chat-messages').appendChild(div);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
}

async function sendChatMessage(content) {
  if (!content.trim() || !currentShelterId) return;
  appendMessage('user', content);
  $('#chat-input').value = '';

  const typing = document.createElement('div');
  typing.className = 'typing-indicator';
  typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  $('#chat-messages').appendChild(typing);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;

  try {
    const { aiMessage } = await API.post(`/api/chat/${currentShelterId}`, { content });
    typing.remove();
    appendMessage('shelter', aiMessage.content);
  } catch (e) {
    typing.remove();
    appendMessage('shelter', 'Sorry, I could not process that. Please try again.');
  }
}

// ── Adoption ──
function openAdoptionForm() {
  if (!currentDog) return;
  $('#adopt-dog-card').innerHTML = `
    <div style="font-size:36px">${currentDog.emoji}</div>
    <div>
      <div class="adopt-dog-name">Adopting ${currentDog.name}</div>
      <div class="adopt-dog-sub">${currentDog.shelter_name || 'Shelter'} · ${currentDog.location || 'Coimbatore'}</div>
    </div>
    <div class="step-badge">Step 2/4</div>`;
  showPage('page-adoption');
}

function resetAdoptionForm() {
  ['doc-gov', 'doc-address', 'doc-income', 'doc-photos'].forEach(id => {
    const input = $('#' + id);
    if (input) input.value = '';
    const status = $('#' + id + '-status');
    if (status) {
      status.textContent = id === 'doc-photos' ? 'Choose files' : 'Choose file';
      status.className = 'doc-status pending';
    }
  });
  const reason = $('#adopt-reason');
  if (reason) reason.value = '';
}

async function submitAdoption() {
  if (!currentDog) return;

  const gov = $('#doc-gov').files[0];
  const addr = $('#doc-address').files[0];
  const inc = $('#doc-income').files[0];
  const photos = $('#doc-photos').files;

  if (!gov) { showToast('Government ID is required'); return; }
  if (!addr) { showToast('Address proof is required'); return; }
  if (!photos.length) { showToast('Please add at least one home photo'); return; }

  const btn = $('#submit-adoption-btn');
  btn.disabled = true;
  showLoading('Submitting application & documents...');
  try {
    const getSelected = (group) => {
      const el = document.querySelector(`[data-group="${group}"] .choice-chip.selected`);
      return el ? el.textContent : '';
    };
    const fd = new FormData();
    fd.append('dog_id', currentDog.id);
    fd.append('residence_type', getSelected('residence'));
    fd.append('outdoor_space', getSelected('outdoor'));
    fd.append('experience', getSelected('experience'));
    fd.append('other_pets', $('#adopt-pets').value);
    fd.append('children', $('#adopt-children').value);
    fd.append('alone_hours', $('#adopt-alone').value);
    fd.append('reason', $('#adopt-reason').value);
    fd.append('doc_gov_id', gov);
    fd.append('doc_address', addr);
    if (inc) fd.append('doc_income', inc);
    for (let i = 0; i < photos.length && i < 8; i++) fd.append('doc_photos', photos[i]);

    const res = await fetch('/api/applications', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;

    hideLoading();
    btn.disabled = false;
    showToast('Application & documents submitted! 🎉');
    resetAdoptionForm();
    switchNav(2);
  } catch (e) {
    hideLoading();
    btn.disabled = false;
    showToast(e.error || 'Submission failed');
  }
}

// ── Applications ──
async function loadApplications() {
  try {
    const { applications } = await API.get('/api/applications');
    const countText = applications.length ? `${applications.length} application${applications.length > 1 ? 's' : ''}` : 'No applications yet';
    $('#app-count-text').textContent = countText;

    if (!applications.length) {
      $('#applications-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">📋</div>
          <div class="empty-title">No applications yet</div>
          <div class="empty-sub">Browse dogs and start your first adoption application!</div>
        </div>`;
      return;
    }

    $('#applications-list').innerHTML = applications.map(a => `
      <div class="app-card">
        <div class="app-card-top">
          <div style="font-size:28px">${a.dog_emoji}</div>
          <div>
            <div class="app-card-name">${a.dog_name}</div>
            <div class="app-card-sub">${a.shelter_name || 'Shelter'}</div>
          </div>
          <div class="app-status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</div>
        </div>
        <div class="app-progress"><div class="app-progress-fill" style="width:${a.progress}%"></div></div>
        <div class="app-timeline">
          <div class="timeline-step"><div class="timeline-dot done"></div><div class="timeline-label done">Application submitted</div></div>
          <div class="timeline-step"><div class="timeline-dot ${a.progress >= 50 ? 'done' : 'pending'}"></div><div class="timeline-label ${a.progress >= 50 ? 'done' : ''}">Shelter review</div></div>
          <div class="timeline-step"><div class="timeline-dot ${a.progress >= 75 ? 'done' : 'pending'}"></div><div class="timeline-label">Home visit</div></div>
          <div class="timeline-step"><div class="timeline-dot pending"></div><div class="timeline-label">Approval</div></div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

// ── Shelters ──
async function loadShelters(filter = 'all', search = '') {
  try {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (search) params.set('search', search);

    const [sheltersRes, statsRes] = await Promise.all([
      API.get(`/api/shelters?${params}`),
      API.get('/api/shelters/stats')
    ]);

    const { stats } = statsRes;
    $('#shelter-stats').innerHTML = `
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_shelters}</div><div class="shelter-stat-label">Shelters</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_dogs}</div><div class="shelter-stat-label">Dogs waiting</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_rehomed}</div><div class="shelter-stat-label">Rehomed 2024</div></div>
      <div class="shelter-stat-box"><div class="shelter-stat-val">${stats.total_volunteers}</div><div class="shelter-stat-label">Volunteers</div></div>`;

    const { shelters } = sheltersRes;
    $('#shelter-list').innerHTML = shelters.map(s => {
      const tags = (s.tags || '').split(',').filter(Boolean);
      return `
        <div class="shelter-list-card" data-shelter="${s.id}">
          <div class="shelter-card-top">
            <div class="shelter-list-icon">${s.emoji}</div>
            <div>
              <div class="shelter-list-name">${s.name}</div>
              <div class="shelter-list-sub">${s.address} · ${s.hours}</div>
            </div>
          </div>
          <div class="shelter-stats-row">
            <div class="shelter-stat">🐕 <span>${s.dogs_available}</span> dogs</div>
            <div class="shelter-stat">📍 <span>${s.distance_km}</span> km</div>
            <div class="shelter-stat">⭐ <span>${s.rating}</span></div>
            <div class="shelter-stat">🏠 <span>${s.dogs_rehomed}</span> rehomed</div>
          </div>
          <div class="shelter-tags">
            ${tags.map(t => `<span class="tag tag-green">${t}</span>`).join('')}
          </div>
        </div>`;
    }).join('');
  } catch (e) { console.error(e); }
}

async function openShelterDetail(shelterId) {
  if (!shelterId) { showToast('Shelter info unavailable'); return; }
  showLoading('Loading shelter...');
  try {
    const { shelter, dogs } = await API.get(`/api/shelters/${shelterId}`);
    currentShelterId = shelter.id;
    const tags = (shelter.tags || '').split(',').filter(Boolean);
    $('#shelter-detail-content').innerHTML = `
      <div class="shelter-detail-hero">
        <div class="shelter-detail-emoji">${shelter.emoji || '🏥'}</div>
        <div class="shelter-detail-name">${shelter.name}</div>
        <div class="shelter-detail-addr">📍 ${shelter.address || 'Coimbatore'}</div>
        ${shelter.verified ? '<div class="verified-pill" style="margin:10px auto 0">✓ Verified shelter</div>' : ''}
      </div>
      <div class="stats-row" style="padding:18px 20px 0">
        <div class="stat-box"><div class="stat-val">${shelter.dogs_available}</div><div class="stat-label">Dogs</div></div>
        <div class="stat-box"><div class="stat-val">${shelter.dogs_rehomed}</div><div class="stat-label">Rehomed</div></div>
        <div class="stat-box"><div class="stat-val">⭐ ${shelter.rating}</div><div class="stat-label">Rating</div></div>
        <div class="stat-box"><div class="stat-val">${shelter.distance_km}km</div><div class="stat-label">Away</div></div>
      </div>
      <div style="padding:18px 20px 0">
        <div class="info-card">
          <div class="info-row"><div class="info-icon">🕒</div><div class="info-text">Open · ${shelter.hours || '9AM-5PM'}</div></div>
          <div class="info-row"><div class="info-icon">📞</div><div class="info-text">${shelter.phone || 'Contact via chat'}</div></div>
          <div class="info-row"><div class="info-icon">✉️</div><div class="info-text">${shelter.email || '—'}</div></div>
          <div class="info-row"><div class="info-icon">🙋</div><div class="info-text">${shelter.volunteers} active volunteers</div></div>
        </div>
        ${tags.length ? `<div class="shelter-tags" style="margin-bottom:6px">${tags.map(t => `<span class="tag tag-green">${t}</span>`).join('')}</div>` : ''}
      </div>
      <div class="section-header"><div class="section-title">Dogs at this shelter (${dogs.length})</div></div>
      ${dogs.length ? `<div class="h-scroll" style="padding:0 20px 12px">${dogs.map(d => `
        <div class="h-dog-card" data-dog="${d.id}">
          <div class="h-dog-img">${d.emoji}${d.urgent ? '<div class="dog-card-urgency" style="font-size:8px">URGENT</div>' : ''}</div>
          <div class="h-dog-body"><div class="h-dog-name">${d.name}</div><div class="h-dog-sub">${d.breed} · ${d.age_text}</div></div>
        </div>`).join('')}</div>` : '<div style="padding:0 20px 16px;color:var(--text-secondary);font-size:14px">No dogs currently listed here.</div>'}
      <div style="padding:8px 20px 28px">
        <button class="btn-primary" id="shelter-detail-chat-btn">💬 Chat with ${shelter.name}</button>
      </div>`;
    $('#shelter-detail-chat-btn').addEventListener('click', () => openChat(shelter.id, shelter.name));
    showPage('page-shelter-detail');
  } catch (e) {
    showToast('Failed to load shelter');
    console.error(e);
  } finally {
    hideLoading();
  }
}

// ── Foster ──
async function loadFoster() {
  try {
    const [dogsRes, statsRes] = await Promise.all([
      API.get('/api/foster'),
      API.get('/api/foster/stats')
    ]);

    const { active_fosters, dogs_fostered, become_adopters } = statsRes;
    $('#foster-hero').innerHTML = `
      <div class="foster-hero-emoji">🏠</div>
      <div class="foster-hero-title">Become a foster parent</div>
      <div class="foster-hero-sub">No commitment to adopt. Just love, space, and time.</div>
      <div class="foster-stats">
        <div><div class="foster-stat-num">${active_fosters}</div><div class="foster-stat-label">Active fosters</div></div>
        <div><div class="foster-stat-num">${dogs_fostered}</div><div class="foster-stat-label">Dogs fostered</div></div>
        <div><div class="foster-stat-num">${become_adopters}%</div><div class="foster-stat-label">Become adopters</div></div>
      </div>`;

    const { dogs } = dogsRes;
    fosterCache = {};
    $('#foster-list').innerHTML = dogs.map(d => {
      fosterCache[d.id] = d;
      return `
      <div class="foster-card" data-foster="${d.id}">
        <div class="foster-card-top">
          <div class="foster-emoji">${d.emoji}</div>
          <div>
            <div class="foster-name">${d.name}</div>
            <div class="foster-sub">${d.breed} · ${d.age_text}</div>
            <span class="foster-urgency urgency-${d.urgency}">${d.urgency}</span>
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">${d.reason}</div>
        <div class="foster-details">
          <div class="foster-detail">⏱ <span>${d.duration}</span></div>
          <div class="foster-detail">🏥 <span>${d.shelter_name || 'Shelter'}</span></div>
        </div>
      </div>`;
    }).join('');

    const faqs = [
      { q: 'Do I need to pay for food and medical?', a: 'No! The shelter covers all food, medical expenses, and basic supplies. You just provide the love and space.' },
      { q: 'What if I want to adopt the foster dog?', a: 'Foster-to-adopt is encouraged! About 78% of our foster parents end up adopting. You get first priority.' },
      { q: 'How long is the foster period?', a: 'Typically 2-8 weeks depending on the dog\'s needs. You can discuss the timeline with the shelter.' },
      { q: 'What if there\'s a medical emergency?', a: 'Call our 24/7 helpline immediately. We have partner vets across the city for emergencies.' }
    ];
    $('#foster-faq').innerHTML = faqs.map(f => `
      <div class="faq-item"><div class="faq-q">${f.q}</div><div class="faq-a">${f.a}</div></div>`).join('');
  } catch (e) { console.error(e); }
}

function openFosterModal(id) {
  const d = fosterCache[id];
  if (!d) return;
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:52px;margin-bottom:8px">${d.emoji}</div>
    <div class="modal-title" style="text-align:center">${d.name}</div>
    <div class="modal-sub" style="text-align:center">${d.breed} · ${d.age_text} · <span class="foster-urgency urgency-${d.urgency}">${d.urgency} priority</span></div>
    <div class="info-card" style="margin-bottom:14px">
      <div class="info-row"><div class="info-icon">📝</div><div class="info-text">${d.reason}</div></div>
      <div class="info-row"><div class="info-icon">⏱</div><div class="info-text">Foster duration: ${d.duration}</div></div>
      <div class="info-row"><div class="info-icon">🏥</div><div class="info-text">${d.shelter_name || 'Partner shelter'}</div></div>
      <div class="info-row"><div class="info-icon">💊</div><div class="info-text">Food & all medical costs covered by the shelter</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="btn-primary" id="foster-interest-btn">Express interest to foster ${d.name}</button>
      <button class="btn-secondary" id="close-modal-btn">Maybe later</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#foster-interest-btn').addEventListener('click', () => {
    $('#modal').classList.remove('show');
    showToast(`Interest noted! The shelter will contact you about ${d.name} 🐾`);
  });
  $('#close-modal-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Learn / Articles ──
async function loadArticles(category = 'all') {
  try {
    const params = category !== 'all' ? `?category=${category}` : '';
    const { articles } = await API.get(`/api/articles${params}`);

    const pinned = articles.find(a => a.id === 'a6') || articles[0];
    if (pinned) {
      $('#pinned-article').innerHTML = `
        <div class="pinned-label">📌 Must read</div>
        <div class="pinned-title">${pinned.title}</div>
        <div class="pinned-meta">${pinned.read_time} · ${pinned.likes} ♥</div>
        <div class="pinned-summary">${pinned.summary}</div>`;
      $('#pinned-article').dataset.article = pinned.id;
    }

    const filtered = articles.filter(a => a.id !== 'a6');
    $('#articles-list').innerHTML = filtered.map(a => `
      <div class="article-card" data-article="${a.id}">
        <div class="article-card-img" style="background:${a.bg_color || 'var(--surface2)'}">${a.emoji}</div>
        <div class="article-card-body">
          <span class="tag tag-blue" style="margin-bottom:8px">${a.category}</span>
          <div class="article-card-title">${a.title}</div>
          <div class="article-card-summary">${a.summary}</div>
          <div class="article-card-meta">
            <span>${a.author}</span>
            <span>· ${a.read_time}</span>
            <span class="article-card-likes">${a.likes} ♥</span>
          </div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

async function openArticle(articleId) {
  showLoading('Loading article...');
  try {
    const { article, related } = await API.get(`/api/articles/${articleId}`);
    $('#article-page-title').textContent = article.category;
    $('#article-content-wrapper').innerHTML = `
      <div class="article-hero-img" style="background:${article.bg_color || 'var(--surface2)'}">${article.emoji}</div>
      <div class="article-meta">
        <span class="tag tag-blue">${article.category}</span>
        <span style="font-size:12px;color:var(--text-muted)">${article.read_time}</span>
      </div>
      <div class="article-full-title">${article.title}</div>
      <div class="article-byline">By ${article.author} · ${article.likes} ♥</div>
      <div class="article-content">${article.content}</div>
      ${related.length ? `
        <div style="padding:0 20px 24px">
          <div class="about-title">Related articles</div>
          ${related.map(r => `
            <div class="shelter-card" data-article="${r.id}" style="cursor:pointer">
              <div class="shelter-icon" style="font-size:24px">${r.emoji}</div>
              <div>
                <div class="shelter-name">${r.title}</div>
                <div class="shelter-sub">${r.category} · ${r.read_time}</div>
              </div>
              <div style="margin-left:auto;color:var(--text-muted)">›</div>
            </div>`).join('')}
        </div>` : ''}`;
    showPage('page-article');
  } catch (e) {
    showToast('Failed to load article');
  } finally {
    hideLoading();
  }
}

// ── Volunteer ──
async function loadVolunteer() {
  try {
    const [rolesRes, eventsRes, lbRes, statsRes] = await Promise.all([
      API.get('/api/volunteer/roles'),
      API.get('/api/volunteer/events'),
      API.get('/api/volunteer/leaderboard'),
      API.get('/api/volunteer/stats')
    ]);

    const s = statsRes;
    $('#vol-hero').innerHTML = `
      <div class="vol-hero-emoji">🙋‍♀️</div>
      <div class="vol-hero-title">Make a difference every weekend</div>
      <div class="vol-hero-sub">No experience needed. Just show up with heart.</div>
      <div class="vol-stats">
        <div><div class="vol-stat-num">${s.total_volunteers.toLocaleString()}</div><div class="vol-stat-label">Volunteers 2024</div></div>
        <div><div class="vol-stat-num">${s.open_roles}</div><div class="vol-stat-label">Open roles</div></div>
        <div><div class="vol-stat-num">${s.return_rate}%</div><div class="vol-stat-label">Return rate</div></div>
      </div>`;

    const { roles } = rolesRes;
    $('#vol-roles').innerHTML = roles.map(r => `
      <div class="vol-role-card">
        <div class="vol-role-icon" style="background:${r.bg_color}">${r.emoji}</div>
        <div>
          <div class="vol-role-name">${r.title}</div>
          <div class="vol-role-sub">${r.description}</div>
        </div>
        <div class="vol-role-spots spots-${r.spots_status}">${r.spots_text}</div>
      </div>`).join('');

    const { events } = eventsRes;
    $('#vol-events').innerHTML = events.map(e => `
      <div class="vol-event-card">
        <div class="vol-event-date">${e.event_date}</div>
        <div class="vol-event-title">${e.title}</div>
        <div class="vol-event-sub">${e.description}</div>
        <div class="vol-event-footer">
          <button class="vol-attend-btn" onclick="showToast('Registered! See you there 🎉')">Attend</button>
          <div class="vol-attendees">${e.attendees}/${e.max_attendees} attending</div>
        </div>
      </div>`).join('');

    const { leaderboard } = lbRes;
    $('#vol-leaderboard').innerHTML = leaderboard.map(l => `
      <div class="lb-row">
        <div class="lb-rank ${l.rank <= 3 ? 'top' : ''}">${l.rank}</div>
        <div class="lb-avatar" style="background:${l.color}">${l.initials}</div>
        <div>
          <div class="lb-name">${l.name}</div>
          <div class="lb-sub">${l.sub}</div>
        </div>
        <div class="lb-points">${l.points.toLocaleString()}</div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

// ── User Profile ──
async function loadUserProfile() {
  try {
    const { user, stats } = await API.get('/api/users/profile');
    if (!user) return;

    const pp = user.paw_points || 0;
    const ppPct = Math.min(100, (pp / 500) * 100);

    $('#user-profile-content').innerHTML = `
      <div class="user-avatar-large">${user.avatar_initials || 'U'}</div>
      <div class="user-name-large">${user.name}</div>
      <div class="user-email">${user.email}</div>
      <div class="user-location">📍 ${user.city || 'Unknown'}, Tamil Nadu</div>

      <div class="user-stats-row">
        <div class="stat-box"><div class="stat-val">${stats.applications}</div><div class="stat-label">Applications</div></div>
        <div class="stat-box"><div class="stat-val">${stats.favourites}</div><div class="stat-label">Saved dogs</div></div>
        <div class="stat-box"><div class="stat-val">2</div><div class="stat-label">Articles read</div></div>
        <div class="stat-box"><div class="stat-val">0</div><div class="stat-label">Vol. hrs</div></div>
      </div>

      <div style="font-family:'Syne',sans-serif;font-size:15px;font-weight:600;margin-bottom:12px">Your badges</div>
      <div class="badge-row">
        <div class="badge-pill earned">🐾 Paw Pioneer</div>
        <div class="badge-pill earned">❤️ Animal Lover</div>
        <div class="badge-pill">🏅 Super Adopter</div>
        <div class="badge-pill">🌟 Top Volunteer</div>
        <div class="badge-pill earned">📰 Reader</div>
      </div>

      <div class="pawpoints-card">
        <div class="pawpoints-header">
          <div class="pawpoints-label">🌟 PawPoints</div>
          <div class="pawpoints-val">${pp} pts</div>
        </div>
        <div class="pawpoints-bar"><div class="pawpoints-fill" style="width:${ppPct}%"></div></div>
        <div class="pawpoints-text">${500 - pp} more points to unlock 🏅 Super Adopter badge</div>
      </div>

      <div class="menu-item" data-action="applications"><div class="menu-icon" style="background:#1a2040">📋</div><div><div class="menu-text">My Applications</div><div class="menu-sub">${stats.applications} active</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="favourites"><div class="menu-icon" style="background:#2a0a0a">❤️</div><div><div class="menu-text">Saved Dogs</div><div class="menu-sub">${stats.favourites} saved</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="volunteer"><div class="menu-icon" style="background:#0a1a2a">🙋</div><div><div class="menu-text">Volunteer</div><div class="menu-sub">Upcoming sessions</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="foster"><div class="menu-icon" style="background:#1a0a2a">🐕</div><div><div class="menu-text">Foster Dogs</div><div class="menu-sub">No active fosters</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="notifications"><div class="menu-icon" style="background:#2a2a0a">🔔</div><div><div class="menu-text">Notifications</div><div class="menu-sub">Check updates</div></div><div class="menu-arrow">›</div></div>
      ${user.is_admin ? `<div class="menu-item admin-menu-item" data-action="admin"><div class="menu-icon" style="background:#0a2a1a">🛡️</div><div><div class="menu-text">Manage Dogs &amp; Shelters</div><div class="menu-sub">Admin · add, edit, delete</div></div><div class="menu-arrow">›</div></div>` : ''}
      <div class="menu-item" data-action="edit-profile"><div class="menu-icon" style="background:#0a1a2a">✏️</div><div><div class="menu-text">Edit Profile</div><div class="menu-sub">Name, phone, city</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="refer"><div class="menu-icon" style="background:#0a1a1a">🔗</div><div><div class="menu-text">Refer a friend</div><div class="menu-sub">Invite friends to adopt</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="help"><div class="menu-icon" style="background:#1a1a1a">❓</div><div><div class="menu-text">Help & FAQs</div><div class="menu-sub">How adoption works</div></div><div class="menu-arrow">›</div></div>
      <div class="menu-item" data-action="logout" style="margin-top:12px"><div class="menu-icon" style="background:#2a0a0a">🚪</div><div><div class="menu-text" style="color:var(--red)">Sign Out</div></div></div>`;
  } catch (e) { console.error(e); }
}

// ── Notifications ──
async function checkNotifications() {
  try {
    const { unread } = await API.get('/api/users/notifications');
    const dot = $('#notif-dot');
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
  } catch (e) { /* ok */ }
}

async function loadNotifications() {
  try {
    const { notifications } = await API.get('/api/users/notifications');
    if (!notifications.length) {
      $('#notifications-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">🔔</div>
          <div class="empty-title">No notifications</div>
          <div class="empty-sub">You are all caught up!</div>
        </div>`;
      return;
    }
    $('#notifications-list').innerHTML = notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div class="notif-dot-sm ${n.read ? 'read' : ''}"></div>
        <div class="notif-body">
          <div class="notif-title">${n.title}</div>
          <div class="notif-sub">${n.body || ''}</div>
        </div>
      </div>`).join('');
  } catch (e) { console.error(e); }
}

async function markAllRead() {
  try {
    await API.post('/api/users/notifications/read');
    showToast('All marked as read ✓');
    loadNotifications();
    checkNotifications();
  } catch (e) { showToast('Failed'); }
}

// ── Favourites ──
async function loadFavourites() {
  try {
    const { dogs } = await API.get('/api/users/favourites');
    if (!dogs.length) {
      $('#favourites-list').innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">❤️</div>
          <div class="empty-title">No saved dogs</div>
          <div class="empty-sub">Tap the heart icon on any dog profile to save them here!</div>
        </div>`;
      return;
    }
    $('#favourites-list').innerHTML = `<div class="dog-grid" style="padding:20px">${dogs.map(d => `
      <div class="dog-card" data-dog="${d.id}">
        <div class="dog-card-img">${d.emoji}</div>
        <div class="dog-card-body">
          <div class="dog-card-name">${d.name}</div>
          <div class="dog-card-sub">${d.breed} · ${d.age_text}</div>
        </div>
      </div>`).join('')}</div>`;
  } catch (e) { console.error(e); }
}

// ── Navigation ──
const NAV_PAGES = ['page-home', 'page-shelters', 'page-applications', 'page-foster', 'page-learn', 'page-user-profile'];

function switchNav(index) {
  $$('.nav-item').forEach((n, i) => n.classList.toggle('active', i === index));
  pageHistory = [];
  showPage(NAV_PAGES[index]);

  switch (index) {
    case 1: loadShelters(); break;
    case 2: loadApplications(); break;
    case 3: loadFoster(); break;
    case 4: loadArticles(); break;
    case 5: loadUserProfile(); break;
  }
}

// ── Event Listeners ──
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Auth
  $('#login-btn').addEventListener('click', () => login($('#login-email').value, $('#login-password').value));
  $('#login-password').addEventListener('keydown', e => { if (e.key === 'Enter') $('#login-btn').click(); });
  $('#demo-login-btn').addEventListener('click', () => {
    $('#login-email').value = 'demo@pawfinder.in';
    $('#login-password').value = 'demo123';
    login('demo@pawfinder.in', 'demo123');
  });
  $('#goto-register-btn').addEventListener('click', () => showPage('page-register'));
  $('#register-btn').addEventListener('click', register);

  // Navigation
  $$('[data-nav]').forEach(el => {
    el.addEventListener('click', () => switchNav(Number(el.dataset.nav)));
  });

  // Back buttons
  $$('.btn-back').forEach(btn => {
    btn.addEventListener('click', goBack);
  });

  // Dog clicks (delegated)
  document.addEventListener('click', e => {
    const dogEl = e.target.closest('[data-dog]');
    if (dogEl) {
      e.preventDefault();
      openDogProfile(dogEl.dataset.dog);
      return;
    }
    const fosterEl = e.target.closest('[data-foster]');
    if (fosterEl) {
      e.preventDefault();
      openFosterModal(fosterEl.dataset.foster);
      return;
    }
    const articleEl = e.target.closest('[data-article]');
    if (articleEl) {
      e.preventDefault();
      openArticle(articleEl.dataset.article);
      return;
    }
    const shelterEl = e.target.closest('[data-shelter]');
    if (shelterEl) {
      e.preventDefault();
      openShelterDetail(shelterEl.dataset.shelter);
      return;
    }
  });

  // Profile actions
  $('#heart-btn').addEventListener('click', toggleFavourite);
  $('#profile-chat-btn').addEventListener('click', () => {
    if (currentDog) openChat(currentDog.shelter_id, currentDog.shelter_name);
  });
  $('#profile-adopt-btn').addEventListener('click', openAdoptionForm);

  // Chat
  $('#chat-send-btn').addEventListener('click', () => sendChatMessage($('#chat-input').value));
  $('#chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage($('#chat-input').value); });
  $$('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => sendChatMessage(btn.dataset.msg));
  });

  // Adoption
  $('#submit-adoption-btn').addEventListener('click', submitAdoption);
  $('#save-draft-btn').addEventListener('click', () => showToast('Draft saved 💾'));

  // Choice chips
  document.addEventListener('click', e => {
    if (e.target.classList.contains('choice-chip')) {
      const group = e.target.closest('.chip-group');
      if (group) {
        group.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('selected'));
        e.target.classList.add('selected');
      }
    }
  });

  // Document file inputs — show selected file names
  $$('.doc-input').forEach(input => {
    input.addEventListener('change', () => {
      const status = $('#' + input.id + '-status');
      if (!status) return;
      const files = input.files;
      if (!files || !files.length) {
        status.textContent = input.multiple ? 'Choose files' : 'Choose file';
        status.className = 'doc-status pending';
        return;
      }
      status.textContent = files.length === 1
        ? files[0].name.length > 22 ? files[0].name.slice(0, 20) + '… ✓' : files[0].name + ' ✓'
        : files.length + ' files ✓';
      status.className = 'doc-status uploaded';
    });
  });

  // Search
  let searchTimeout;
  $('#search-input').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadDogs(currentFilter, e.target.value), 300);
  });

  // Filters
  $('#filter-row').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    currentFilter = chip.dataset.filter;
    $('#filter-row').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadDogs(currentFilter, $('#search-input').value);
  });

  // Shelter search/filters
  let shelterSearchTimeout;
  $('#shelter-search')?.addEventListener('input', e => {
    clearTimeout(shelterSearchTimeout);
    shelterSearchTimeout = setTimeout(() => {
      const activeFilter = $('#shelter-filters .chip.active')?.dataset.filter || 'all';
      loadShelters(activeFilter, e.target.value);
    }, 300);
  });
  $('#shelter-filters')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $('#shelter-filters').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadShelters(chip.dataset.filter, $('#shelter-search').value);
  });

  // Article filters
  $('#article-filters')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $('#article-filters').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    loadArticles(chip.dataset.filter);
  });

  // Notifications
  $('#notif-btn').addEventListener('click', () => { loadNotifications(); showPage('page-notifications'); });
  $('#mark-all-read').addEventListener('click', markAllRead);

  // User profile actions
  document.addEventListener('click', e => {
    const menuItem = e.target.closest('.menu-item[data-action]');
    if (!menuItem) return;
    const action = menuItem.dataset.action;
    switch (action) {
      case 'applications': switchNav(2); break;
      case 'favourites': loadFavourites(); showPage('page-favourites'); break;
      case 'volunteer': loadVolunteer(); showPage('page-volunteer'); break;
      case 'foster': switchNav(3); break;
      case 'notifications': loadNotifications(); showPage('page-notifications'); break;
      case 'edit-profile': showEditProfileModal(); break;
      case 'admin': loadAdmin(); break;
      case 'refer': showToast('Referral link copied! 🐾'); break;
      case 'help': showHelpModal(); break;
      case 'logout': logout(); break;
    }
  });

  // Volunteer link
  $('#vol-link')?.addEventListener('click', () => { loadVolunteer(); showPage('page-volunteer'); });
  $('#volunteer-back')?.addEventListener('click', goBack);

  // See all dogs
  $('#see-all-dogs')?.addEventListener('click', () => switchNav(0));

  // Adoption hero CTA — scroll to the available dogs
  $('#hero-browse-btn')?.addEventListener('click', () => {
    const grid = $('#dog-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // SOS
  $('#sos-banner')?.addEventListener('click', () => showToast('Calling emergency rescue line... 📞'));

  // Map
  $('#map-preview')?.addEventListener('click', () => switchNav(1));

  // Quiz — rotating question bank
  renderQuiz();
  document.addEventListener('click', e => {
    const opt = e.target.closest('#quiz-options .quiz-option');
    if (opt) { answerQuiz(opt); return; }
  });
  $('#quiz-next')?.addEventListener('click', () => { quizIndex++; renderQuiz(); });

  // Poll voting
  document.addEventListener('click', e => {
    const opt = e.target.closest('.poll-option');
    if (!opt) return;
    const poll = opt.closest('.poll-card');
    if (poll.classList.contains('voted')) return;
    poll.classList.add('voted');
    opt.classList.add('chosen');
    showToast('Thanks for voting! 🗳️');
  });

  // FAQ toggle
  document.addEventListener('click', e => {
    const faq = e.target.closest('.faq-item');
    if (faq) faq.classList.toggle('open');
  });

  // Foster register
  $('#foster-register-btn')?.addEventListener('click', () => showToast('Opening foster registration form... 📋'));

  // Bookmark
  $('#bookmark-btn')?.addEventListener('click', () => showToast('Article saved 🔖'));

  // Modal
  $('#modal').addEventListener('click', e => {
    if (e.target === $('#modal')) $('#modal').classList.remove('show');
  });

  // Avatar click
  $('#user-avatar').addEventListener('click', () => switchNav(5));
});

// ── Help & FAQs Modal ──
const HELP_FAQS = [
  { q: 'How does the adoption process work?', a: 'Browse dogs and open a profile, submit the adoption application with your home details and required documents, the shelter reviews within 48 hours, a short home visit or video call is scheduled, and on approval you complete the paperwork and meet your new companion. 🎉' },
  { q: 'What documents do I need to adopt?', a: 'A government ID (Aadhaar / Voter ID / Passport), address proof (utility bill or rental agreement), income proof (salary slip or bank statement), and 3-5 photos of your living space. You upload these securely in the application — JPG, PNG or PDF, up to 8 MB each.' },
  { q: 'Are my uploaded documents safe?', a: 'Yes. Documents are stored securely and are only visible to the reviewing shelter and PawFinder admin — never to other adopters. They stay on file after approval for follow-up support and re-homing safety.' },
  { q: 'How long does approval take?', a: 'Most shelters review applications within 48 hours. You can always track the live status of every application in the Adopt tab.' },
  { q: 'Is there an adoption fee?', a: 'PawFinder itself is free. Some shelters charge a small adoption fee that covers vaccination, sterilisation and deworming already done for the dog. The exact amount is confirmed by the shelter during review.' },
  { q: 'Can I foster a dog instead of adopting?', a: 'Absolutely. Fostering gives a dog a temporary home while it waits for adoption. The shelter covers food and all medical costs. Around 78% of foster parents end up adopting — see the Foster tab.' },
  { q: 'What if my application is declined?', a: 'You will get a notification with next steps. Declines are usually about finding the best match for a specific dog, not about you. Many other wonderful dogs are still waiting — please do apply again. 🐾' },
  { q: 'How do I report an injured street dog?', a: 'Tap the red "Found an injured stray?" banner on the Discover page to connect with a nearby rescue team, or call your local Coimbatore shelter directly from its profile.' },
  { q: 'How do I contact a shelter?', a: 'Open any dog or shelter profile and tap "Chat" to message the shelter directly. Each shelter profile also lists its phone number, email and visiting hours.' },
  { q: 'Still need help?', a: 'Email support@pawfinder.in or message any shelter in-app. Our volunteers are happy to guide you through every step of your adoption journey.' }
];

function showHelpModal() {
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">Help &amp; FAQs ❓</div>
    <div class="modal-sub">Answers to the most common questions about adopting with PawFinder</div>
    <div class="help-faq-list">
      ${HELP_FAQS.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>`).join('')}
    </div>
    <button class="btn-secondary" id="close-help-btn" style="margin-top:18px">Close</button>`;
  $('#modal').classList.add('show');
  $('#close-help-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Edit Profile Modal ──
function showEditProfileModal() {
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">Edit Profile</div>
    <div class="modal-sub">Update your information</div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div><div class="field-label">Name</div><input class="input-field" id="edit-name" value="${currentUser?.name || ''}"></div>
      <div><div class="field-label">Phone</div><input class="input-field" id="edit-phone" value="${currentUser?.phone || ''}"></div>
      <div><div class="field-label">City</div><input class="input-field" id="edit-city" value="${currentUser?.city || ''}"></div>
      <button class="btn-primary" id="save-profile-btn">Save Changes</button>
      <button class="btn-secondary" id="close-modal-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');

  $('#save-profile-btn').addEventListener('click', async () => {
    try {
      const { user } = await API.put('/api/users/profile', {
        name: $('#edit-name').value,
        phone: $('#edit-phone').value,
        city: $('#edit-city').value
      });
      currentUser = user;
      $('#modal').classList.remove('show');
      showToast('Profile updated ✓');
      loadUserProfile();
    } catch (e) { showToast('Failed to update'); }
  });
  $('#close-modal-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
}

// ── Admin Panel ──
function escAttr(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function docIcon(type) {
  return { gov_id: '🪪', address: '🏠', income: '💼', photos: '📷' }[type] || '📄';
}
function fmtSize(bytes) {
  const n = Number(bytes) || 0;
  if (n >= 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  if (n >= 1024) return Math.round(n / 1024) + ' KB';
  return n + ' B';
}

async function loadAdmin() {
  if (!currentUser || !currentUser.is_admin) {
    showToast('Admin access only');
    switchNav(5);
    return;
  }
  showPage('page-admin');
  $$('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === adminTab));
  await renderAdminList();
}

function updateAdminAddBtn() {
  const btn = $('#admin-add-btn');
  if (btn) btn.style.display = adminTab === 'applications' ? 'none' : '';
}

async function renderAdminList() {
  const list = $('#admin-list');
  list.innerHTML = '<div class="empty-state"><div class="spinner"></div></div>';
  updateAdminAddBtn();
  try {
    if (adminTab === 'applications') {
      const qs = adminAppStatus === 'all' ? '' : `?status=${adminAppStatus}`;
      const { applications, counts } = await API.get(`/api/applications/admin/all${qs}`);
      const tabs = [
        ['all', 'All', (counts.total || 0)],
        ['pending', 'Pending', (counts.pending || 0)],
        ['approved', 'Approved', (counts.approved || 0)],
        ['rejected', 'Declined', (counts.rejected || 0)]
      ];
      const summary = `
        <div class="admin-app-summary">
          <div class="admin-app-stat pending ${adminAppStatus === 'pending' ? 'sel' : ''}" data-app-status="pending"><div class="admin-app-stat-num">${counts.pending || 0}</div><div class="admin-app-stat-label">Pending</div></div>
          <div class="admin-app-stat approved ${adminAppStatus === 'approved' ? 'sel' : ''}" data-app-status="approved"><div class="admin-app-stat-num">${counts.approved || 0}</div><div class="admin-app-stat-label">Approved</div></div>
          <div class="admin-app-stat rejected ${adminAppStatus === 'rejected' ? 'sel' : ''}" data-app-status="rejected"><div class="admin-app-stat-num">${counts.rejected || 0}</div><div class="admin-app-stat-label">Declined</div></div>
        </div>
        <div class="filter-row admin-app-filters">
          ${tabs.map(([k, lbl, n]) => `<div class="chip ${adminAppStatus === k ? 'active' : ''}" data-app-status="${k}">${lbl} (${n})</div>`).join('')}
        </div>`;
      if (!applications.length) {
        const msg = adminAppStatus === 'approved' ? 'No approved adoptions yet'
          : adminAppStatus === 'pending' ? 'No pending applications'
          : adminAppStatus === 'rejected' ? 'No declined applications'
          : 'No applications yet';
        list.innerHTML = summary + emptyAdmin('📋', msg, 'Adoption requests will appear here for review');
        return;
      }
      list.innerHTML = summary + applications.map(a => {
        const pending = a.status === 'pending';
        const docs = a.documents || [];
        const docsHtml = docs.length ? `
          <div class="admin-app-docs">
            <div class="admin-app-docs-title">📎 Submitted documents (${docs.length})</div>
            <div class="admin-app-doc-list">
              ${docs.map(d => `
                <a class="admin-doc-chip" href="/api/applications/documents/${d.id}" target="_blank" rel="noopener" title="${escAttr(d.original_name || d.label)}">
                  <span class="admin-doc-ic">${docIcon(d.doc_type)}</span>
                  <span class="admin-doc-name">${escAttr(d.label || d.doc_type)}</span>
                  <span class="admin-doc-size">${fmtSize(d.size)}</span>
                </a>`).join('')}
            </div>
          </div>` : `<div class="admin-app-docs admin-app-docs-empty">No documents were attached to this application.</div>`;
        const decidedNote = a.status === 'approved'
          ? '✓ Adoption approved — documents remain on file for follow-up'
          : 'Declined · documents retained for records';
        return `
        <div class="admin-app-card">
          <div class="admin-app-head">
            <div class="admin-app-emoji">${a.dog_emoji || '🐕'}</div>
            <div class="admin-app-info">
              <div class="admin-app-dog">${escAttr(a.dog_name)} <span class="admin-app-breed">· ${escAttr(a.dog_breed || '')}</span></div>
              <div class="admin-app-applicant">👤 ${escAttr(a.applicant_name)} · ${escAttr(a.shelter_name || 'Shelter')}</div>
            </div>
            <div class="app-status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</div>
          </div>
          <div class="admin-app-meta">
            <div>📧 <b>${escAttr(a.applicant_email || '—')}</b></div>
            <div>📱 <b>${escAttr(a.applicant_phone || '—')}</b></div>
            <div>🏠 <b>${escAttr(a.residence_type || '—')}</b></div>
            <div>🌳 Outdoor: <b>${escAttr(a.outdoor_space || '—')}</b></div>
            <div>🎓 <b>${escAttr(a.experience || '—')}</b></div>
            <div>🐾 Pets: <b>${escAttr(a.other_pets || '—')}</b></div>
            <div>👶 Kids: <b>${escAttr(a.children || '—')}</b></div>
            <div>⏰ Alone: <b>${escAttr(a.alone_hours || '—')}</b></div>
          </div>
          ${a.reason ? `<div class="admin-app-reason">"${escAttr(a.reason)}"</div>` : ''}
          ${docsHtml}
          ${pending ? `
          <div class="admin-app-actions">
            <button class="btn-approve" data-approve="${a.id}" data-name="${escAttr(a.dog_name)}">✓ Approve adoption</button>
            <button class="btn-reject" data-reject="${a.id}" data-name="${escAttr(a.dog_name)}">Decline</button>
          </div>` : `<div class="admin-app-decided">${decidedNote}</div>`}
        </div>`;
      }).join('');
    } else if (adminTab === 'dogs') {
      const { dogs } = await API.get('/api/dogs/admin/all');
      if (!dogs.length) { list.innerHTML = emptyAdmin('🐕', 'No dogs yet', 'Tap + Add to create one'); return; }
      list.innerHTML = dogs.map(d => `
        <div class="admin-row">
          <div class="admin-row-emoji">${d.emoji || '🐕'}</div>
          <div class="admin-row-info">
            <div class="admin-row-name">${d.name} ${d.adopted ? '<span class="tag tag-blue">Adopted</span>' : ''}${d.urgent ? '<span class="tag tag-red">Urgent</span>' : ''}</div>
            <div class="admin-row-sub">${d.breed || '—'} · ${d.age_text || '—'} · ${d.shelter_name || 'No shelter'}</div>
          </div>
          <button class="admin-act edit" data-edit-dog="${d.id}">Edit</button>
          <button class="admin-act del" data-del-dog="${d.id}" data-name="${escAttr(d.name)}">Delete</button>
        </div>`).join('');
    } else {
      const { shelters } = await API.get('/api/shelters');
      if (!shelters.length) { list.innerHTML = emptyAdmin('🏥', 'No shelters yet', 'Tap + Add to create one'); return; }
      list.innerHTML = shelters.map(s => `
        <div class="admin-row">
          <div class="admin-row-emoji">${s.emoji || '🏥'}</div>
          <div class="admin-row-info">
            <div class="admin-row-name">${s.name} ${s.verified ? '<span class="tag tag-green">Verified</span>' : ''}</div>
            <div class="admin-row-sub">${s.address || '—'} · ${s.dogs_available} dogs</div>
          </div>
          <button class="admin-act edit" data-edit-shelter="${s.id}">Edit</button>
          <button class="admin-act del" data-del-shelter="${s.id}" data-name="${escAttr(s.name)}">Delete</button>
        </div>`).join('');
    }
  } catch (e) {
    list.innerHTML = emptyAdmin('⚠️', 'Could not load', e.error || 'Please try again');
  }
}

function emptyAdmin(emoji, title, sub) {
  return `<div class="empty-state"><div class="empty-emoji">${emoji}</div><div class="empty-title">${title}</div><div class="empty-sub">${sub}</div></div>`;
}

function adminField(label, name, value, type = 'text') {
  return `<div><div class="field-label">${label}</div><input class="input-field" data-f="${name}" type="${type}" value="${escAttr(value)}"></div>`;
}
function adminArea(label, name, value) {
  return `<div><div class="field-label">${label}</div><textarea class="input-field" data-f="${name}" rows="3">${escAttr(value)}</textarea></div>`;
}
function adminSelect(label, name, value, opts) {
  return `<div><div class="field-label">${label}</div><select class="input-field" data-f="${name}">${opts.map(o => `<option ${String(o) === String(value) ? 'selected' : ''}>${o}</option>`).join('')}</select></div>`;
}
function adminCheck(label, name, value) {
  return `<label class="admin-check"><input type="checkbox" data-f="${name}" ${value ? 'checked' : ''}><span>${label}</span></label>`;
}

async function showDogForm(dog) {
  const d = dog || {};
  let shelters = [];
  try { shelters = (await API.get('/api/shelters')).shelters; } catch (e) {}
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">${dog ? 'Edit dog' : 'Add a dog'}</div>
    <div class="modal-sub">${dog ? escAttr(d.name) : 'Create a new adoptable dog'}</div>
    <div class="admin-form">
      ${adminField('Name *', 'name', d.name)}
      <div class="two-col">${adminField('Emoji', 'emoji', d.emoji || '🐕')}${adminField('Breed', 'breed', d.breed)}</div>
      <div class="two-col">${adminField('Age text (e.g. 2 yrs)', 'age_text', d.age_text)}${adminField('Age (months)', 'age_months', d.age_months, 'number')}</div>
      <div class="two-col">${adminSelect('Gender', 'gender', d.gender || 'Male', ['Male', 'Female'])}${adminSelect('Size', 'size', d.size || 'Medium', ['Small', 'Medium', 'Large'])}</div>
      <div class="two-col">${adminField('Weight (kg)', 'weight_kg', d.weight_kg, 'number')}${adminField('Location', 'location', d.location)}</div>
      <div><div class="field-label">Shelter</div><select class="input-field" data-f="shelter_id">${shelters.map(s => `<option value="${s.id}" ${s.id === d.shelter_id ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
      ${adminArea('About', 'about', d.about)}
      <div class="two-col">${adminField('Good with', 'good_with', d.good_with)}${adminField('Energy level', 'energy_level', d.energy_level)}</div>
      <div class="two-col">${adminField('Exercise', 'exercise', d.exercise)}${adminField('Grooming', 'grooming', d.grooming)}</div>
      <div class="two-col">${adminField('Space', 'space', d.space)}${adminField('Diet', 'diet', d.diet)}</div>
      ${adminField('Traits (comma separated)', 'traits', d.traits)}
      <div class="admin-checks">
        ${adminCheck('Vaccinated', 'vaccinated', d.vaccinated)}
        ${adminCheck('Neutered', 'neutered', d.neutered)}
        ${adminCheck('Dewormed', 'dewormed', d.dewormed)}
        ${adminCheck('Microchipped', 'microchipped', d.microchipped)}
        ${adminCheck('Urgent', 'urgent', d.urgent)}
        ${adminCheck('Featured', 'featured', d.featured)}
        ${adminCheck('Adopted', 'adopted', d.adopted)}
      </div>
      <button class="btn-primary" id="admin-save-btn">${dog ? 'Save changes' : 'Create dog'}</button>
      <button class="btn-secondary" id="admin-cancel-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#admin-cancel-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#admin-save-btn').addEventListener('click', () => saveEntity('dog', dog && dog.id));
}

async function showShelterForm(shelter) {
  const s = shelter || {};
  const m = $('#modal-content');
  m.innerHTML = `
    <div class="modal-title">${shelter ? 'Edit shelter' : 'Add a shelter'}</div>
    <div class="modal-sub">${shelter ? escAttr(s.name) : 'Create a new rescue shelter'}</div>
    <div class="admin-form">
      ${adminField('Name *', 'name', s.name)}
      <div class="two-col">${adminField('Emoji', 'emoji', s.emoji || '🏥')}${adminField('City', 'city', s.city)}</div>
      ${adminField('Address', 'address', s.address)}
      <div class="two-col">${adminField('Phone', 'phone', s.phone)}${adminField('Hours', 'hours', s.hours || '9AM-5PM')}</div>
      ${adminField('Email', 'email', s.email)}
      <div class="two-col">${adminField('Distance (km)', 'distance_km', s.distance_km, 'number')}${adminField('Rating', 'rating', s.rating, 'number')}</div>
      <div class="two-col">${adminField('Dogs available', 'dogs_available', s.dogs_available, 'number')}${adminField('Dogs rehomed', 'dogs_rehomed', s.dogs_rehomed, 'number')}</div>
      ${adminField('Volunteers', 'volunteers', s.volunteers, 'number')}
      ${adminField('Tags (comma separated)', 'tags', s.tags)}
      <div class="admin-checks">${adminCheck('Verified shelter', 'verified', s.verified)}</div>
      <button class="btn-primary" id="admin-save-btn">${shelter ? 'Save changes' : 'Create shelter'}</button>
      <button class="btn-secondary" id="admin-cancel-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#admin-cancel-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#admin-save-btn').addEventListener('click', () => saveEntity('shelter', shelter && shelter.id));
}

function collectForm() {
  const data = {};
  $$('#modal-content [data-f]').forEach(el => {
    data[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value;
  });
  return data;
}

async function saveEntity(kind, id) {
  const data = collectForm();
  if (!data.name || !data.name.trim()) { showToast('Name is required'); return; }
  const base = kind === 'dog' ? '/api/dogs' : '/api/shelters';
  const btn = $('#admin-save-btn');
  btn.disabled = true;
  try {
    if (id) await API.put(`${base}/${id}`, data);
    else await API.post(base, data);
    $('#modal').classList.remove('show');
    showToast(`${kind === 'dog' ? 'Dog' : 'Shelter'} ${id ? 'updated' : 'created'} ✓`);
    await renderAdminList();
  } catch (e) {
    btn.disabled = false;
    showToast(e.error || 'Save failed');
  }
}

function confirmDelete(kind, id, name) {
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:46px;margin-bottom:6px">🗑️</div>
    <div class="modal-title" style="text-align:center">Delete ${kind}?</div>
    <div class="modal-sub" style="text-align:center">"${escAttr(name)}" will be permanently removed.${kind === 'shelter' ? ' Its dogs will be kept but unassigned.' : ''}</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="btn-danger" id="confirm-del-btn">Yes, delete</button>
      <button class="btn-secondary" id="cancel-del-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#cancel-del-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#confirm-del-btn').addEventListener('click', async () => {
    try {
      await API.del(`${kind === 'dog' ? '/api/dogs' : '/api/shelters'}/${id}`);
      $('#modal').classList.remove('show');
      showToast(`${kind === 'dog' ? 'Dog' : 'Shelter'} deleted`);
      await renderAdminList();
    } catch (e) { showToast(e.error || 'Delete failed'); }
  });
}

function decideApplication(id, decision, dogName) {
  const approve = decision === 'approve';
  const m = $('#modal-content');
  m.innerHTML = `
    <div style="text-align:center;font-size:46px;margin-bottom:6px">${approve ? '🎉' : '✋'}</div>
    <div class="modal-title" style="text-align:center">${approve ? 'Approve adoption?' : 'Decline application?'}</div>
    <div class="modal-sub" style="text-align:center">${approve
      ? `Approving will mark <b>${escAttr(dogName)}</b> as adopted, notify the adopter, and gently decline any other pending requests for this dog.`
      : `The applicant for <b>${escAttr(dogName)}</b> will be notified that this request can't proceed.`}</div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <button class="${approve ? 'btn-primary' : 'btn-danger'}" id="confirm-decision-btn">${approve ? 'Yes, approve adoption' : 'Yes, decline'}</button>
      <button class="btn-secondary" id="cancel-decision-btn">Cancel</button>
    </div>`;
  $('#modal').classList.add('show');
  $('#cancel-decision-btn').addEventListener('click', () => $('#modal').classList.remove('show'));
  $('#confirm-decision-btn').addEventListener('click', async () => {
    const btn = $('#confirm-decision-btn');
    btn.disabled = true;
    try {
      await API.post(`/api/applications/${id}/decision`, { decision });
      $('#modal').classList.remove('show');
      showToast(approve ? `${dogName} adoption approved! 🎉` : 'Application declined');
      await renderAdminList();
    } catch (e) {
      btn.disabled = false;
      showToast(e.error || 'Action failed');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  $('#admin-add-btn')?.addEventListener('click', () => {
    if (adminTab === 'applications') return;
    adminTab === 'dogs' ? showDogForm(null) : showShelterForm(null);
  });
  $$('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      adminTab = tab.dataset.tab;
      $$('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
      renderAdminList();
    });
  });
  document.addEventListener('click', async e => {
    const stFilter = e.target.closest('[data-app-status]');
    if (stFilter && adminTab === 'applications') {
      const next = stFilter.dataset.appStatus;
      adminAppStatus = (adminAppStatus === next && stFilter.classList.contains('admin-app-stat')) ? 'all' : next;
      renderAdminList();
      return;
    }
    const ap = e.target.closest('[data-approve]');
    const rj = e.target.closest('[data-reject]');
    if (ap) { decideApplication(ap.dataset.approve, 'approve', ap.dataset.name); return; }
    if (rj) { decideApplication(rj.dataset.reject, 'reject', rj.dataset.name); return; }
    const ed = e.target.closest('[data-edit-dog]');
    const es = e.target.closest('[data-edit-shelter]');
    const dd = e.target.closest('[data-del-dog]');
    const ds = e.target.closest('[data-del-shelter]');
    if (ed) {
      try { const { dogs } = await API.get('/api/dogs/admin/all'); showDogForm(dogs.find(x => x.id === ed.dataset.editDog)); } catch (er) { showToast('Could not open'); }
    } else if (es) {
      try { const { shelter } = await API.get(`/api/shelters/${es.dataset.editShelter}`); showShelterForm(shelter); } catch (er) { showToast('Could not open'); }
    } else if (dd) {
      confirmDelete('dog', dd.dataset.delDog, dd.dataset.name);
    } else if (ds) {
      confirmDelete('shelter', ds.dataset.delShelter, ds.dataset.name);
    }
  });
});
