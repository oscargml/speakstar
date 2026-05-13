// ═══════════════════════════════════════════════════════════════════════════
//                          STATE & STORAGE
// ═══════════════════════════════════════════════════════════════════════════
const state = {
  lang: localStorage.getItem('lang') || 'es',  // Spanish-first
  totalStars: parseInt(localStorage.getItem('totalStars') || '0'),
  wordsDone: parseInt(localStorage.getItem('wordsDone') || '0'),
  catProg: JSON.parse(localStorage.getItem('catProg') || '{}'),
  screen: 'home',
  module: null,  // 'sounds' | 'twisters' | 'sentences'
  cat: null,
  wordIdx: 0,
  spoken: null,
  feedback: null,
  isRecording: false,
  isLoading: false,
  showTip: false,
};

function save() {
  localStorage.setItem('lang', state.lang);
  localStorage.setItem('totalStars', state.totalStars);
  localStorage.setItem('wordsDone', state.wordsDone);
  localStorage.setItem('catProg', JSON.stringify(state.catProg));
}

// ═══════════════════════════════════════════════════════════════════════════
//                          API
// ═══════════════════════════════════════════════════════════════════════════
function offlineFeedback(lang) {
  const arr = OFFLINE[lang];
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getAIFeedback(lang, type, target, hint, spoken) {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'sk-ant-YOUR_KEY_HERE') {
    return offlineFeedback(lang);
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role:'user', content: T[lang].aiPrompt(type, target, spoken, hint) }],
      }),
    });
    const data = await r.json();
    const raw = data.content?.find(b => b.type === 'text')?.text || '';
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch (e) {
    return offlineFeedback(lang);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//                          MASCOT SVG
// ═══════════════════════════════════════════════════════════════════════════
function mascot(size = 80, wink = false) {
  return `
  <svg class="mascot" width="${size}" height="${size}" viewBox="0 0 80 80" style="display:block;margin:0 auto">
    <circle cx="40" cy="44" r="30" fill="#FFD60A"/>
    <polygon points="40,14 48,26 32,26" fill="#FFD60A"/>
    <circle cx="40" cy="13" r="8" fill="#FFD60A"/>
    <polygon points="40,5 44,13 36,13" fill="#FF6B35"/>
    <ellipse cx="29" cy="38" rx="5" ry="5.5" fill="#2D2D2D"/>
    <ellipse cx="51" cy="38" rx="5" ry="${wink ? 1.5 : 5.5}" fill="#2D2D2D"/>
    <circle cx="31" cy="36" r="2" fill="#fff"/>
    ${!wink ? '<circle cx="53" cy="36" r="2" fill="#fff"/>' : ''}
    <path d="M28 54 Q40 65 52 54" stroke="#2D2D2D" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="21" cy="50" r="7" fill="#FF6B35" opacity="0.3"/>
    <circle cx="59" cy="50" r="7" fill="#FF6B35" opacity="0.3"/>
  </svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function getCurrentList() {
  if (state.module === 'sounds') return CATEGORIES[state.lang];
  if (state.module === 'twisters') return TWISTERS[state.lang];
  if (state.module === 'sentences') return SENTENCES[state.lang];
  return [];
}

function getItemList() {
  if (!state.cat) return [];
  return state.cat.words || state.cat.items || [];
}

function getWordFontClass(text) {
  if (text.length < 8) return '';
  if (text.length < 18) return 'medium';
  return 'small';
}

function langToggle() {
  return `
    <div class="lang-row">
      <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">🇺🇸 EN</button>
      <button class="lang-btn ${state.lang === 'es' ? 'active' : ''}" onclick="setLang('es')">🇲🇽 ES</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          RENDER: HOME
// ═══════════════════════════════════════════════════════════════════════════
function renderHome() {
  const t = T[state.lang];
  const mastered = Object.values(state.catProg).filter(v => v >= 3).length;
  const articlesPath = 'articulos/';
  return `
    <div class="screen">
      <div class="home-top">${langToggle()}</div>
      <div class="mascot-wrap">${mascot(110)}</div>
      <h1 class="app-name ${state.lang}">${t.appName}</h1>
      <p class="tagline">${t.tagline}</p>
      
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-val">${state.totalStars}</div>
          <div class="stat-label">${t.stars}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-val">${state.wordsDone}</div>
          <div class="stat-label">${t.practiced}</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-val">${mastered}</div>
          <div class="stat-label">${t.mastered}</div>
        </div>
      </div>
      
      <div class="mod-grid">
        <div class="mod-card" style="border-color:#FF6B35" onclick="selectModule('sounds')">
          <div class="mod-emoji">🔤</div>
          <div class="mod-label" style="color:#FF6B35">${t.modSounds}</div>
          <div class="mod-sub">${t.modSoundsSub}</div>
        </div>
        <div class="mod-card" style="border-color:#00B4D8" onclick="selectModule('twisters')">
          <div class="mod-emoji">🌀</div>
          <div class="mod-label" style="color:#00B4D8">${t.modTwisters}</div>
          <div class="mod-sub">${t.modTwistersSub}</div>
        </div>
        <div class="mod-card" style="border-color:#06D6A0" onclick="selectModule('sentences')">
          <div class="mod-emoji">💬</div>
          <div class="mod-label" style="color:#06D6A0">${t.modSentences}</div>
          <div class="mod-sub">${t.modSentencesSub}</div>
        </div>
        <a class="mod-card" style="border-color:#9B5DE5;display:block" href="${articlesPath}">
          <div class="mod-emoji">📚</div>
          <div class="mod-label" style="color:#9B5DE5">${t.modParents}</div>
          <div class="mod-sub">${t.modParentsSub}</div>
        </a>
      </div>
      
      <button class="btn btn-secondary" onclick="go('progress')">${t.progressBtn}</button>
      
      <p class="footer">
        Powered by AI · ${state.lang === 'es' ? 'Español e Inglés' : 'English & Spanish'}
        <br>
        <a href="${articlesPath}">${t.articlesCtaLink}</a><br><br><a href="privacy.html" style="font-size:10px;color:#bbb">Privacidad</a> · <a href="terms.html" style="font-size:10px;color:#bbb">Términos</a>
      </p>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          RENDER: LIST (Categories/Twisters/Sentences)
// ═══════════════════════════════════════════════════════════════════════════
function renderList() {
  const t = T[state.lang];
  const list = getCurrentList();
  let title;
  if (state.module === 'sounds') title = t.pickSound;
  else if (state.module === 'twisters') title = t.pickTwister;
  else title = t.pickSentence;
  
  return `
    <div class="screen">
      <div class="top-bar">
        <div style="display:flex;align-items:center;gap:6px">
          <button class="back-btn" onclick="go('home')">‹</button>
          <h2 class="title">${title}</h2>
        </div>
        ${langToggle()}
      </div>
      <div class="cat-grid">
        ${list.map(c => {
          const prog = state.catProg[c.id] || 0;
          const itemCount = (c.words || c.items || []).length;
          const unit = state.module === 'sounds' ? t.words : (state.module === 'twisters' ? t.twisters : t.sentences);
          return `
            <div class="cat-card" style="background:${c.bg};border-color:${c.color}55" onclick="selectCat('${c.id}')">
              ${prog >= 3 ? `<div class="cat-badge" style="background:${c.color}">✓</div>` : ''}
              <div class="cat-emoji">${c.emoji}</div>
              <div class="cat-label" style="color:${c.color}">${c.label}</div>
              <div class="cat-stars">
                <span class="cat-star ${prog >= 1 ? 'on' : ''}">⭐</span>
                <span class="cat-star ${prog >= 2 ? 'on' : ''}">⭐</span>
                <span class="cat-star ${prog >= 3 ? 'on' : ''}">⭐</span>
              </div>
              <div class="cat-count">${itemCount} ${unit}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          RENDER: PRACTICE
// ═══════════════════════════════════════════════════════════════════════════
function renderPractice() {
  const t = T[state.lang];
  const cat = state.cat;
  const items = getItemList();
  const item = items[state.wordIdx];
  const fontClass = getWordFontClass(item.w);
  
  return `
    <div class="screen">
      <div class="practice-header">
        <button class="back-btn" onclick="go('list')">‹</button>
        <div style="font-weight:900;color:${cat.color};font-size:16px;text-align:center;flex:1">${cat.label}</div>
        <div class="counter" style="background:${cat.bg};color:${cat.color}">${state.wordIdx + 1}/${items.length}</div>
      </div>
      <div class="card word-card">
        <div class="word-emoji">${item.e}</div>
        <div class="word-text ${fontClass}">${item.w}</div>
        <div class="word-hint">${t.sayWord}</div>
      </div>
      <button class="tip-toggle" style="color:${cat.color}" onclick="toggleTip()">
        ${state.showTip ? t.hideTip : t.showTip}
      </button>
      ${state.showTip ? `<div class="tip-card" style="border-left-color:${cat.color}">${cat.hint}</div>` : ''}
      <div class="wave-row" id="waveRow" style="color:${cat.color}">
        ${Array(9).fill(0).map(() => '<div class="wave-bar"></div>').join('')}
      </div>
      <button class="btn" 
              style="background:${state.isRecording ? '#ddd' : cat.color};color:${state.isRecording ? '#aaa' : '#fff'};${!state.isRecording ? 'animation:pulse 2s ease-in-out infinite' : ''}"
              onclick="${state.isRecording ? 'stopRecording()' : 'startRecording()'}">
        ${state.isRecording ? t.listening : t.tapSpeak}
      </button>
      <button class="demo-btn" onclick="submitSpeech('${item.w.replace(/'/g, "\\'")}')">${t.demoMode}</button>
      <p class="instructions">${t.instructions}</p>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          RENDER: RESULT
// ═══════════════════════════════════════════════════════════════════════════
function renderResult() {
  const t = T[state.lang];
  if (state.isLoading) {
    return `
      <div class="screen loading">
        ${mascot(100)}
        <div class="loading-text">${t.checking}</div>
        <div class="spinner"></div>
      </div>`;
  }
  const fb = state.feedback;
  const cat = state.cat;
  const items = getItemList();
  const item = items[state.wordIdx];
  return `
    <div class="screen">
      <div class="result-mascot">
        ${mascot(88, fb.stars === 3)}
        <div class="celeb-emoji">${fb.celebEmoji || '🎉'}</div>
      </div>
      <div class="stars-result">
        <span class="star-result ${fb.stars >= 1 ? 'on an0' : ''}">⭐</span>
        <span class="star-result ${fb.stars >= 2 ? 'on an1' : ''}">⭐</span>
        <span class="star-result ${fb.stars >= 3 ? 'on an2' : ''}">⭐</span>
      </div>
      <div class="card" style="text-align:center">
        <p class="message">${fb.message}</p>
        ${state.spoken && state.spoken.toLowerCase() !== item.w.toLowerCase() ? `
          <div class="heard-row">
            ${t.heard}: <strong>"${state.spoken}"</strong> · ${t.target}: <strong>"${item.w}"</strong>
          </div>
        ` : ''}
      </div>
      <div class="tip-yellow">💡 ${fb.tip}</div>
      <button class="btn" style="background:${cat.color};color:#fff" onclick="nextWord()">${t.nextWord}</button>
      <button class="btn btn-outline" style="border-color:${cat.color};color:${cat.color}" onclick="retryWord()">${t.tryAgain}</button>
      <button class="btn btn-secondary" onclick="go('list')">${t.backToList}</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          RENDER: PROGRESS
// ═══════════════════════════════════════════════════════════════════════════
function renderProgress() {
  const t = T[state.lang];
  const cats = CATEGORIES[state.lang];
  const articlesPath = 'articulos/';
  return `
    <div class="screen">
      <div class="top-bar">
        <div style="display:flex;align-items:center;gap:6px">
          <button class="back-btn" onclick="go('home')">‹</button>
          <h2 class="title">${t.myProgress}</h2>
        </div>
        ${langToggle()}
      </div>
      <div class="card summary-card">
        ${mascot(72)}
        <div class="stars-count">${state.totalStars} ${t.stars}! ⭐</div>
        <div class="words-count">${state.wordsDone} ${t.practiced}</div>
      </div>
      <div class="section-label">${t.soundCategories}</div>
      ${cats.map(c => {
        const prog = state.catProg[c.id] || 0;
        return `
          <div class="card prog-card">
            <div class="prog-row">
              <span class="prog-emoji">${c.emoji}</span>
              <span class="prog-name" style="color:${c.color}">${c.label}</span>
              <span class="prog-count">${prog}/3 ⭐</span>
            </div>
            <div class="bar-bg">
              <div class="bar-fill" style="background:${c.color};width:${(prog/3)*100}%"></div>
            </div>
          </div>`;
      }).join('')}
      <div class="parent-card">
        <div class="parent-title">${t.parentNote}</div>
        <div class="parent-text">
          ${state.wordsDone === 0 ? t.parentDefault : t.parentActive(state.wordsDone)}
        </div>
      </div>
      <div class="articles-cta">
        <div class="articles-cta-title">${t.articlesCtaTitle}</div>
        <div class="articles-cta-text">${t.articlesCtaText}</div>
        <a class="articles-cta-link" href="${articlesPath}">${t.articlesCtaLink}</a>
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//                          MAIN ROUTER
// ═══════════════════════════════════════════════════════════════════════════
function render() {
  const app = document.getElementById('app');
  switch(state.screen) {
    case 'home': app.innerHTML = renderHome(); break;
    case 'list': app.innerHTML = renderList(); break;
    case 'practice': app.innerHTML = renderPractice(); break;
    case 'result': app.innerHTML = renderResult(); break;
    case 'progress': app.innerHTML = renderProgress(); break;
  }
  window.scrollTo(0, 0);
}

function go(screen) {
  state.screen = screen;
  state.showTip = false;
  render();
}

function setLang(lang) {
  state.lang = lang;
  state.cat = null;
  state.feedback = null;
  save();
  render();
}

function selectModule(mod) {
  state.module = mod;
  state.cat = null;
  go('list');
}

function selectCat(id) {
  const list = getCurrentList();
  state.cat = list.find(c => c.id === id);
  state.wordIdx = 0;
  state.feedback = null;
  state.showTip = false;
  go('practice');
}

function toggleTip() {
  state.showTip = !state.showTip;
  render();
}

function nextWord() {
  const items = getItemList();
  state.wordIdx = (state.wordIdx + 1) % items.length;
  state.feedback = null;
  state.spoken = null;
  state.showTip = false;
  go('practice');
}

function retryWord() {
  state.feedback = null;
  state.spoken = null;
  state.showTip = false;
  go('practice');
}

// ═══════════════════════════════════════════════════════════════════════════
//                          SPEECH RECOGNITION
// ═══════════════════════════════════════════════════════════════════════════
let recognition = null;
let waveInterval = null;

function startWaveAnim() {
  const bars = document.querySelectorAll('.wave-bar');
  waveInterval = setInterval(() => {
    bars.forEach(b => {
      b.style.height = (6 + Math.random() * 38) + 'px';
      b.classList.add('active');
    });
  }, 120);
}

function stopWaveAnim() {
  if (waveInterval) clearInterval(waveInterval);
  waveInterval = null;
  document.querySelectorAll('.wave-bar').forEach(b => {
    b.style.height = '8px';
    b.classList.remove('active');
  });
}

function startRecording() {
  const items = getItemList();
  const target = items[state.wordIdx].w;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    submitSpeech(target);
    return;
  }
  recognition = new SR();
  recognition.lang = T[state.lang].srLang;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.toLowerCase().trim();
    state.isRecording = false;
    stopWaveAnim();
    submitSpeech(text);
  };
  recognition.onerror = () => {
    state.isRecording = false;
    stopWaveAnim();
    submitSpeech(target);
  };
  recognition.onend = () => {
    state.isRecording = false;
    stopWaveAnim();
    render();
  };
  try {
    recognition.start();
    state.isRecording = true;
    render();
    setTimeout(startWaveAnim, 100);
  } catch (e) {
    submitSpeech(target);
  }
}

function stopRecording() {
  if (recognition) { try { recognition.stop(); } catch(e) {} }
  state.isRecording = false;
  stopWaveAnim();
  render();
}

async function submitSpeech(spoken) {
  state.spoken = spoken;
  state.isLoading = true;
  state.screen = 'result';
  render();
  const items = getItemList();
  const item = items[state.wordIdx];
  const moduleType = state.module === 'sounds' ? state.cat.label : (state.module === 'twisters' ? 'tongue twister' : 'sentence');
  const fb = await getAIFeedback(state.lang, moduleType, item.w, state.cat.hint, spoken);
  state.feedback = fb;
  state.totalStars += fb.stars;
  state.wordsDone += 1;
  state.catProg[state.cat.id] = Math.min(3, (state.catProg[state.cat.id] || 0) + (fb.stars >= 2 ? 1 : 0));
  state.isLoading = false;
  save();
  render();
}

// ═══════════════════════════════════════════════════════════════════════════
//                          INIT
// ═══════════════════════════════════════════════════════════════════════════
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
