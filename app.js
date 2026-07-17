      // ──────────────────────────  a• a• a• a• a• a•  DATA a• a• a• a• a• a• a• 
      // QUESTIONS loaded from data.js
      // LEADERBOARD_DATA loaded from data.js
      // CATEGORIES_DATA loaded from data.js
      // TRANSFER_PLAYERS loaded from data.js
      const LOCAL_API_URL = 'http://127.0.0.1:8000';
      const PRODUCTION_API_URL = 'https://footytrivia-api.onrender.com';

      function resolveApiBaseUrl() {
        const isLocalHost = location.hostname === 'localhost'
          || location.hostname === '127.0.0.1'
          || location.protocol === 'file:';
        const fromEnv = window.ENV && window.ENV.API_BASE_URL;
        if (fromEnv) return fromEnv;
        if (isLocalHost) return LOCAL_API_URL;
        return PRODUCTION_API_URL;
      }

      const API_BASE_URL = resolveApiBaseUrl();
      const FT_SITE_URL = (typeof location !== 'undefined' && location.origin && location.origin !== 'null')
        ? location.origin
        : 'https://footy-trivia.vercel.app';
      const API_TIMEOUT_MS = 20000;
      const QUIZ_ANSWER_TIMEOUT_MS = 8000;
      const API_RETRY_DELAY_MS = 3000;
      const API_MAX_RETRIES = 2;
      const SESSION_INACTIVITY_MS = 2 * 60 * 60 * 1000;
      const SESSION_ACTIVITY_KEY = 'footytrivia_last_activity';
      let apiWakePromise = null;
      let inactivityCheckTimer = null;
      let sessionGuardsReady = false;

      function isNetworkError(error) {
        return error && (error.name === 'AbortError' || error.message === 'Failed to fetch');
      }

      function networkErrorMessage() {
        return 'Cannot reach the server. It may be waking up — please try again in a few seconds.';
      }

      async function fetchWithTimeout(url, options = {}, timeoutMs = API_TIMEOUT_MS) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          return await fetch(url, { ...options, signal: controller.signal });
        } finally {
          clearTimeout(timer);
        }
      }

      function getCsrfTokenFromCookie() {
        const match = document.cookie.match(/(?:^|;\s*)ft_csrf=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
      }

      let csrfTokenPromise = null;
      let csrfTokenCache = null;

      function clearCsrfTokenCache() {
        csrfTokenCache = null;
      }

      async function fetchCsrfToken() {
        const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/csrf`, {
          credentials: 'include',
        }, 15000);
        if (!res.ok) throw new Error('Failed to fetch CSRF token');
        const data = await res.json();
        const token = data && data.csrf_token;
        if (!token) throw new Error('Failed to fetch CSRF token');
        csrfTokenCache = token;
        return token;
      }

      async function ensureCsrfToken(options = {}) {
        const forceRefresh = options.forceRefresh === true;
        if (forceRefresh) clearCsrfTokenCache();
        if (csrfTokenCache) return csrfTokenCache;
        if (!csrfTokenPromise) {
          csrfTokenPromise = fetchCsrfToken().finally(() => { csrfTokenPromise = null; });
        }
        return csrfTokenPromise;
      }

      async function tryRefreshSession() {
        try {
          const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
          }, 15000);
          if (!res.ok) return false;
          clearCsrfTokenCache();
          await ensureCsrfToken({ forceRefresh: true }).catch(() => null);
          return true;
        } catch (e) {
          return false;
        }
      }

      async function prepareApiOptions(options = {}) {
        const prepared = { ...options, credentials: options.credentials || 'include' };
        const method = (prepared.method || 'GET').toUpperCase();
        if (!prepared.headers) prepared.headers = {};
        const csrfExempt = [
          '/api/auth/login',
          '/api/auth/register',
          '/api/auth/csrf',
          '/api/auth/refresh',
          '/api/auth/forgot-password',
          '/api/auth/resend-verification',
          '/api/auth/verify-email',
          '/api/auth/reset-password',
        ];
        const needsCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        const endpoint = prepared._apiEndpoint || '';
        if (needsCsrf && !csrfExempt.some((path) => endpoint.startsWith(path))) {
          prepared.headers['X-CSRF-Token'] = await ensureCsrfToken();
        }
        delete prepared._apiEndpoint;
        return prepared;
      }

      function wakeApiServer() {
        if (!apiWakePromise) {
          apiWakePromise = fetchWithTimeout(`${API_BASE_URL}/`, { credentials: 'include' }, 8000)
            .catch(() => null)
            .finally(() => { apiWakePromise = null; });
        }
        return apiWakePromise;
      }

      function isSessionExpiryDetail(detail) {
        return detail === 'session_replaced' || detail === 'session_inactive';
      }

      function sessionExpiryMessage(detail) {
        if (detail === 'session_replaced') {
          return 'You were logged out because your account was accessed on another device.';
        }
        if (detail === 'session_inactive') {
          return 'You were logged out due to 2 hours of inactivity.';
        }
        return 'Your session has expired. Please log in again.';
      }

      function touchSessionActivity() {
        localStorage.setItem(SESSION_ACTIVITY_KEY, String(Date.now()));
      }

      function clearSessionActivity() {
        localStorage.removeItem(SESSION_ACTIVITY_KEY);
      }

      function isClientSessionInactive() {
        const raw = localStorage.getItem(SESSION_ACTIVITY_KEY);
        if (!raw) return false;
        const last = Number(raw);
        return Number.isFinite(last) && (Date.now() - last) >= SESSION_INACTIVITY_MS;
      }

      function forceLogout(reason, showMessage = true) {
        if (!state.user) {
          clearSessionActivity();
          return;
        }
        state.user = null;
        localStorage.removeItem('footytrivia_user');
        localStorage.removeItem('footytrivia_token');
        localStorage.removeItem('footytrivia_refresh_token');
        clearCsrfTokenCache();
        clearSessionActivity();
        updateAuthUI();
        if (showMessage) {
          showToast(sessionExpiryMessage(reason), 'info');
        }
      }

      function setupSessionGuards() {
        if (sessionGuardsReady) return;
        sessionGuardsReady = true;
        const markActive = () => {
          if (state.user) touchSessionActivity();
        };
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
          document.addEventListener(eventName, markActive, { passive: true });
        });
        if (inactivityCheckTimer) clearInterval(inactivityCheckTimer);
        inactivityCheckTimer = setInterval(() => {
          if (state.user && isClientSessionInactive()) {
            forceLogout('session_inactive');
          }
        }, 60000);
      }

      async function apiRequest(endpoint, options = {}, timeoutMs = API_TIMEOUT_MS) {
        const url = `${API_BASE_URL}${endpoint}`;
        const requestOptions = { ...options };
        const prepared = await prepareApiOptions({ ...requestOptions, _apiEndpoint: endpoint });
        
        try {
          const response = await fetchWithTimeout(url, prepared, timeoutMs);
          if (!response.ok) {
            const err = await response.json().catch(() => ({ detail: 'API request failed' }));
            const detail = typeof err.detail === 'string' ? err.detail : '';
            if (
              response.status === 403
              && detail === 'CSRF validation failed'
              && !requestOptions._csrfRetried
            ) {
              clearCsrfTokenCache();
              return apiRequest(endpoint, { ...requestOptions, _csrfRetried: true }, timeoutMs);
            }
            if (response.status === 401 && isSessionExpiryDetail(detail)) {
              forceLogout(detail);
              throw new Error(sessionExpiryMessage(detail));
            }
            if (response.status === 401 && detail === 'Could not validate credentials') {
              throw new Error(detail);
            }
            if (response.status === 403 && isVerificationRequiredError(detail)) {
              clearAuthClientState();
              throw new Error(detail);
            }
            throw new Error(err.detail || 'API request failed');
          }
          if (state.user) touchSessionActivity();
          return await response.json();
        } catch (error) {
          if (isNetworkError(error)) {
            console.error(`API network error for ${endpoint}:`, error);
            throw new Error(networkErrorMessage());
          }
          console.error(`API Error for ${endpoint}:`, error);
          throw error;
        }
      }

      async function apiRequestWithRetry(endpoint, options = {}, maxRetries = API_MAX_RETRIES, delayMs = API_RETRY_DELAY_MS) {
        let lastError;
        await wakeApiServer();
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await apiRequest(endpoint, options);
          } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, delayMs));
            }
          }
        }
        throw lastError;
      }
      let state = {
        currentPage: 'home',
        quiz: { active: false, questions: [], idx: 0, score: 0, correct: 0, streak: 0, bestStreak: 0, hintPenalty: 1, timer: null, timeLeft: 15, mode: 'solo', diff: 'easy', hintsUsed: [], serverMode: false, sessionId: null, verifyKey: null, pendingSyncs: [], answerSyncQueue: [], submitting: false, answersSubmitted: 0 },
        user: null,
        pendingVerifyEmail: '',
        transfer: { playerIdx: 0, guesses: [], maxGuesses: 5, revealed: false, hintsRevealed: 1 },
        theme: 'dark',
        sound: localStorage.getItem('footytrivia_sound') !== '0',
        lbTab: 'alltime',
        selectedMode: 'solo',
        selectedDiff: 'easy',
      };
      window.state = state;

      let sfxContext = null;
      function getSfxContext() {
        if (!sfxContext) {
          sfxContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return sfxContext;
      }

      function playSfxTone(freq, startTime, duration, type = 'sine', volume = 0.12) {
        const ctx = getSfxContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      }

      function playCorrectSound() {
        if (!state.sound) return;
        try {
          const ctx = getSfxContext();
          if (ctx.state === 'suspended') ctx.resume();
          const t = ctx.currentTime;
          playSfxTone(523.25, t, 0.1, 'sine', 0.1);
          playSfxTone(659.25, t + 0.08, 0.1, 'sine', 0.1);
          playSfxTone(783.99, t + 0.16, 0.22, 'sine', 0.12);
        } catch (e) {}
      }

      function playWrongSound() {
        if (!state.sound) return;
        try {
          const ctx = getSfxContext();
          if (ctx.state === 'suspended') ctx.resume();
          const t = ctx.currentTime;
          playSfxTone(220, t, 0.18, 'square', 0.05);
          playSfxTone(165, t + 0.1, 0.28, 'sawtooth', 0.045);
        } catch (e) {}
      }

      const SOUND_ON_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';
      const SOUND_OFF_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';

      function syncSoundUi() {
        const btn = document.getElementById('sound-btn');
        const status = document.getElementById('sound-status');
        const navBtn = document.getElementById('sound-toggle-btn');
        if (btn) btn.textContent = state.sound ? 'Disable' : 'Enable';
        if (status) status.textContent = 'Currently: ' + (state.sound ? 'On' : 'Off');
        if (navBtn) {
          navBtn.innerHTML = state.sound ? SOUND_ON_ICON : SOUND_OFF_ICON;
          navBtn.title = state.sound ? 'Mute sound effects' : 'Enable sound effects';
          navBtn.setAttribute('aria-label', navBtn.title);
        }
      }

      // ──────────────────────────  a• a• a• a• a• a•  NAVIGATION a• a• a• a• a• a• a• 
      function showPage(page) {
        if (!ALLOWED_PAGES.has(page)) {
          page = 'home';
        }
        if (page === 'profile' && !state.user) {
          showToast('Sign up to create your profile and track your stats!', 'info');
          openModal('signup');
          closeMenu();
          return;
        }
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const el = document.getElementById('page-' + page);
        if (el) { 
          el.classList.add('active'); 
          state.currentPage = page; 
          localStorage.setItem('footytrivia_last_page', page);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
        if (!['club'].includes(page)) clearPageBg();
        document.querySelectorAll('.nav-link').forEach(l => {
          if (l.getAttribute('onclick') && l.getAttribute('onclick').includes(`showPage('${page}')`)) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
        if (page === 'categories') {
          const activeExplorer = document.querySelector('.questions-explorer-pane.active');
          if (activeExplorer && activeExplorer.dataset.currentCategory) {
            const currentCat = activeExplorer.dataset.currentCategory;
            const explorerId = activeExplorer.id;
            activeExplorer.classList.remove('active');
            activeExplorer.removeAttribute('data-current-category');
            toggleCategoryQuestions(currentCat, explorerId);
          }
        }
        if (page === 'leaderboard') {
          switchLbTab(null, state.lbTab || 'alltime');
        }
        if (page === 'worldcup') {
          refreshWorldCupViews();
          const pendingTab = window._pendingWcTab;
          delete window._pendingWcTab;
          const activeTabBtn = pendingTab
            ? document.querySelector(`.wc-nav-tabs .wc-tab[onclick*="switchWCTab('${pendingTab}'"]`)
            : document.querySelector('.wc-nav-tabs .wc-tab.active');
          const activeTabId = pendingTab
            || (activeTabBtn ? activeTabBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'dashboard');
          switchWCTab(activeTabId, activeTabBtn);
          syncWcMobileNavSub(activeTabId);
        } else {
          resetWcMobileNavSub();
          stopStandingsPolling();
        }
        const wcToggle = document.querySelector('.wc-mobile-nav-toggle');
        if (wcToggle) wcToggle.classList.toggle('active', page === 'worldcup');
        if (page === 'profile' && state.user) {
          refreshProfileStats();
        }
      }
      function setPageBg(src) {
        const wrap = document.getElementById('page-bg-watermark');
        if (!wrap) return;
        wrap.style.backgroundImage = `url('${src}')`;
        wrap.classList.add('active');
      }
      function clearPageBg() {
        const wrap = document.getElementById('page-bg-watermark');
        if (wrap) { wrap.classList.remove('active'); wrap.style.backgroundImage = ''; }
      }
      // LOGO_URLS loaded from data.js
      function setLeagueBg(id) {
        if (LOGO_URLS[id]) {
          const wrap = document.getElementById('page-bg-watermark');
          if (wrap) wrap.style.backgroundImage = `url('${LOGO_URLS[id]}')`;
          setPageBg(LOGO_URLS[id]);
        }
      }
      function setClubBg(id) {
        if (LOGO_URLS[id]) {
          const wrap = document.getElementById('page-bg-watermark');
          if (wrap) wrap.style.backgroundImage = `url('${LOGO_URLS[id]}')`;
          setPageBg(LOGO_URLS[id]);
        }
      }
      function setActive(el) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        el.classList.add('active');
      }
      function isCategoryCompleted(categoryId) {
        if (!categoryId) return false;
        const completed = JSON.parse(localStorage.getItem('footytrivia_completed_categories') || '[]');
        return completed.includes(categoryId);
      }
      function markCategoryCompleted(categoryId) {
        if (!categoryId) return;
        const completed = JSON.parse(localStorage.getItem('footytrivia_completed_categories') || '[]');
        if (!completed.includes(categoryId)) {
          completed.push(categoryId);
          localStorage.setItem('footytrivia_completed_categories', JSON.stringify(completed));
        }
      }

      function showClub(clubId) {
        const clubs = {
          'man-utd': { name: 'Manchester United', logo: LOGO_URLS['man-utd'], color1: '#da291c', color2: '#fbe122', league: 'Premier League', founded: 1878, stadium: 'Old Trafford', manager: 'Ruben Amorim', trophies: ['PL x13', 'UCL x3', 'Club WC x1'], desc: 'One of the most successful clubs in English football history. 20 league titles and 3 European Cups.' },
          'man-city': { name: 'Manchester City', logo: LOGO_URLS['man-city'], color1: '#6cabdd', color2: '#1c2c5b', league: 'Premier League', founded: 1880, stadium: 'Etihad Stadium', manager: 'Pep Guardiola', trophies: ['PL x9', 'UCL x1', 'FA Cup x7'], desc: 'City have become Premier League dominators under Pep Guardiola, winning the Treble in 2022-23.' },
          'chelsea': { name: 'Chelsea FC', logo: LOGO_URLS['chelsea'], color1: '#003087', color2: '#68b0e8', league: 'Premier League', founded: 1905, stadium: 'Stamford Bridge', manager: 'Enzo Maresca', trophies: ['PL x6', 'UCL x2', 'UEL x2'], desc: 'West London giants who dominated the 2000s and 2010s, winning two Champions League titles.' },
          'arsenal': { name: 'Arsenal FC', logo: LOGO_URLS['arsenal'], color1: '#d00027', color2: '#db0007', league: 'Premier League', founded: 1886, stadium: 'Emirates Stadium', manager: 'Mikel Arteta', trophies: ['PL x3', 'FA Cup x14'], desc: 'The Invincibles of 2003-04 went the entire season unbeaten. Arteta Arsenal are strong contenders again.' },
          'liverpool': { name: 'Liverpool FC', logo: LOGO_URLS['liverpool'], color1: '#c8102e', color2: '#00b2a9', league: 'Premier League', founded: 1892, stadium: 'Anfield', manager: 'Arne Slot', trophies: ['UCL x6', 'PL x1', 'Club WC x1'], desc: 'Six-time European champions. Klopp high-pressing style brought the club back to the summit.' },
          'real-madrid': { name: 'Real Madrid CF', logo: LOGO_URLS['real-madrid'], color1: '#febe10', color2: '#fff', league: 'La Liga', founded: 1902, stadium: 'Santiago Bernabeu', manager: 'Carlo Ancelotti', trophies: ['UCL x15', 'La Liga x35', 'Club WC x8'], desc: 'The most successful club in Champions League history with 15 titles.' },
          'barcelona': { name: 'FC Barcelona', logo: LOGO_URLS['barcelona'], color1: '#004D98', color2: '#A50044', league: 'La Liga', founded: 1899, stadium: 'Spotify Camp Nou', manager: 'Hansi Flick', trophies: ['UCL x5', 'La Liga x27', 'Copa x31'], desc: 'More than a club. Home of the legendary Cruyff, Messi, and the tiki-taka era under Guardiola.' },
          'atletico': { name: 'Atlético Madrid', logo: LOGO_URLS['atletico'], color1: '#cb3524', color2: '#1a2f64', league: 'La Liga', founded: 1903, stadium: 'Metropolitano', manager: 'Diego Simeone', trophies: ['La Liga x11', 'UEL x3', 'Copa x10'], desc: 'Known as Los Colchoneros, they have been a major force in Spanish and European football under Diego Simeone.' }
        };
        const club = clubs[clubId] || clubs['man-utd'];
        setClubBg(clubId);
        const pool = QUESTIONS[clubId] || [];
        document.getElementById('club-page-content').innerHTML = `
    <div style="height:6px;background:var(--surface2)"></div>
    <div class="section">
      <div class="club-header">
        <div class="club-emblem"><img src="${club.logo}" alt="${club.name}"></div>
        <div class="club-meta">
          <h1>${club.name}</h1>
          <p>${club.league}  -  Founded ${club.founded}  -  ${club.stadium}</p>
          <p style="color:var(--text3);font-size:.85rem;margin-top:.1rem">Manager: <strong style="color:var(--text)">${club.manager}</strong></p>
          <div class="club-trophy-row">${club.trophies.map(t => `<span class="trophy-badge">${t}</span>`).join('')}</div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:2rem">
        <div class="card"><p style="color:var(--text2);line-height:1.7;font-size:.95rem">${club.desc}</p></div>
        <div class="card"><h3 style="font-family:var(--font-ui);font-weight:700;letter-spacing:.5px;margin-bottom:1rem">Quick Facts</h3>
          <div style="display:grid;gap:.5rem;font-size:.9rem">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">Stadium</span><strong>${club.stadium}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">Manager</span><strong>${club.manager}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">Founded</span><strong>${club.founded}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text3)">League</span><strong>${club.league}</strong></div>
          </div>
        </div>
      </div>

      <!-- Actual Questions Section -->
      <div class="card" style="margin-bottom:2rem; background: var(--surface2); border: 1px solid var(--border);">
        <h3 style="font-family:var(--font-display);font-weight:700;letter-spacing:.5px;margin-bottom:1.2rem;text-transform:uppercase;">
          Explore ${club.name} Questions (${pool.length})
        </h3>
        <div class="explorer-list" style="max-height: 350px;">
          ${pool.map((q, idx) => `
            <div class="explorer-item" style="background:var(--surface);">
              <div class="explorer-q-meta">
                <span style="font-size:0.75rem; color:var(--text3); font-weight:600; text-transform:uppercase;">Question ${idx + 1}</span>
                <span class="q-difficulty ${q.diff}">${q.diff}</span>
              </div>
              <div class="explorer-q-text">${q.q}</div>
              <div class="explorer-actions">
                <button class="btn-explorer-action" onclick="toggleExplorerAnswer(this)">
                  <span>👁️</span> Show Options
                </button>
              </div>
              <div class="explorer-answer-details hidden">
                <div class="explorer-options-list">
                  ${renderExplorerOptionsHtml(q)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startQuiz('${clubId}')">Start Club Trivia</button>
        <button class="btn btn-ghost" onclick="showPage('categories')">&larr; Back to Categories</button>
      </div>
    </div>`;
        showPage('club');
      }

      function renderExplorerOptionsHtml(question) {
        return (question.opts || []).map((opt, oIdx) => {
          const letter = ['A', 'B', 'C', 'D'][oIdx];
          return `
            <div class="explorer-option">
              <span class="explorer-option-letter">${letter}</span>
              <span class="explorer-option-text">${escapeHtml(opt)}</span>
            </div>
          `;
        }).join('');
      }

      function toggleCategoryQuestions(categoryId, explorerId) {
        const explorerEl = document.getElementById(explorerId);
        if (!explorerEl) return;

        // If the explorer is already active and showing this category, hide it
        const isCurrent = explorerEl.dataset.currentCategory === categoryId;
        
        // Hide all explorer panes first
        document.querySelectorAll('.questions-explorer-pane').forEach(el => {
          el.classList.remove('active');
        });

        if (isCurrent && explorerEl.classList.contains('active')) {
          explorerEl.classList.remove('active');
          explorerEl.removeAttribute('data-current-category');
          return;
        }

        // Set league background watermark
        setLeagueBg(categoryId);

        // Fetch questions from QUESTIONS
        const pool = QUESTIONS[categoryId] || [];
        const catData = CATEGORIES_DATA.find(c => c.id === categoryId) || { name: categoryId, color: '#2563eb' };
        const catName = catData.name;
        const catColor = catData.color || '#2563eb';
        explorerEl.dataset.currentCategory = categoryId;
        explorerEl.innerHTML = `
          <div class="explorer-header">
            <div>
              <h3 class="explorer-title" style="border-left: 4px solid ${catColor}; padding-left: 0.75rem;">
                ${catName} Questions <span>(${pool.length} available)</span>
              </h3>
            </div>
            <button class="btn btn-primary" onclick="startQuiz('${categoryId}')">Play Category Quiz</button>
          </div>
          <div class="explorer-list">
            ${pool.map((q, idx) => `
              <div class="explorer-item">
                <div class="explorer-q-meta">
                  <span style="font-size:0.75rem; color:var(--text3); font-weight:600; text-transform:uppercase;">Question ${idx + 1}</span>
                  <span class="q-difficulty ${q.diff}">${q.diff}</span>
                </div>
                <div class="explorer-q-text">${escapeHtml(q.q)}</div>
                <div class="explorer-actions">
                  <button class="btn-explorer-action" onclick="toggleExplorerAnswer(this)">
                    <span>👁️</span> Show Options
                  </button>
                </div>
                <div class="explorer-answer-details hidden">
                  <div class="explorer-options-list">
                    ${renderExplorerOptionsHtml(q)}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        explorerEl.classList.add('active');
        // Scroll to the explorer pane smoothly
        explorerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function toggleExplorerAnswer(btn) {
        const itemEl = btn.closest('.explorer-item');
        const detailsEl = itemEl.querySelector('.explorer-answer-details');
        if (detailsEl.classList.contains('hidden')) {
          detailsEl.classList.remove('hidden');
          btn.innerHTML = '<span>🙈</span> Hide Options';
        } else {
          detailsEl.classList.add('hidden');
          btn.innerHTML = '<span>👁️</span> Show Options';
        }
      }

      function dailyAttemptsStorageKey() {
        return state.user ? `footytrivia_daily_${state.user.id}` : 'footytrivia_daily_guest';
      }

      function hasPlayedDailyToday() {
        const today = new Date().toDateString();
        const attempts = JSON.parse(localStorage.getItem(dailyAttemptsStorageKey()) || '{}');
        return attempts.date === today && attempts.played === true;
      }

      function checkDailyLimit() {
        if (hasPlayedDailyToday()) {
          showToast('You have already played today\'s Daily Challenge. Come back tomorrow!', 'warning');
          return false;
        }
        return true;
      }

      function markDailyPlayed() {
        const today = new Date().toDateString();
        localStorage.setItem(dailyAttemptsStorageKey(), JSON.stringify({ date: today, played: true }));
      }

      function requireLoginForDaily() {
        if (state.user) return true;
        showToast('Log in to play the Daily Challenge.', 'warning');
        openModal('login');
        return false;
      }

      // ──────────────────────────  a• a• a• a• a• a•  QUIZ ENGINE a• a• a• a• a• a• a• 
      const QUIZ_QUESTIONS_PER_ROUND = 10;
      const QUIZ_RECENT_STORAGE_KEY = 'footytrivia_recent_quiz_questions';
      const QUIZ_ADVANCE_MS_CORRECT = 380;
      const QUIZ_ADVANCE_MS_WRONG = 520;
      const QUIZ_MODE_CONFIG = {
        solo: { timer: 15, multiplier: 1.0 },
        blitz: { timer: 8, multiplier: 2.0 },
        hardcore: { timer: 10, multiplier: 1.0 },
        ranked: { timer: 12, multiplier: 1.5 },
        daily: { timer: 15, multiplier: 1.25 },
      };
      const QUIZ_DIFF_BASE = { easy: 80, medium: 120, hard: 160, legendary: 200, mixed: 100 };

      function getActiveQuizMode() {
        if (state.selectedMode === 'daily' || state.quiz.category === 'daily') return 'daily';
        return state.selectedMode || 'solo';
      }

      function getQuizTimerMax(mode) {
        const key = mode || getActiveQuizMode();
        return (QUIZ_MODE_CONFIG[key] || QUIZ_MODE_CONFIG.solo).timer;
      }

      function calcQuizPoints({ difficulty, timeLeft, timerMax, mode, streak, hintPenalty = 1, correct = true }) {
        if (!correct) return 0;
        const base = QUIZ_DIFF_BASE[difficulty] || QUIZ_DIFF_BASE.mixed;
        const maxTimer = timerMax || getQuizTimerMax(mode);
        const secondsLeft = Math.max(0, Math.min(maxTimer, timeLeft));
        const speedBonus = secondsLeft * 8;
        let pts = Math.floor((base + speedBonus) * hintPenalty);
        if (streak >= 3) pts = Math.floor(pts * 1.2);
        const modeMult = (QUIZ_MODE_CONFIG[mode] || QUIZ_MODE_CONFIG.solo).multiplier;
        pts = Math.floor(pts * modeMult);
        return Math.max(pts, 30);
      }

      function getQuizAdvanceDelay(correct) {
        return correct ? QUIZ_ADVANCE_MS_CORRECT : QUIZ_ADVANCE_MS_WRONG;
      }

      const QUIZ_CATEGORY_EXPANSIONS = {
        'man-utd': { parents: ['premier-league'], keywords: ['manchester united', 'man united', 'man utd', 'old trafford', 'wayne rooney', 'sir alex', 'ferguson', 'solskjaer', 'beckham', 'giggs'] },
        'man-city': { parents: ['premier-league'], keywords: ['manchester city', 'man city', 'etihad', 'aguero', 'guardiola', 'de bruyne', 'haaland'] },
        'chelsea': { parents: ['premier-league'], keywords: ['chelsea', 'stamford bridge', 'drogba', 'lampard', 'mourinho'] },
        'arsenal': { parents: ['premier-league'], keywords: ['arsenal', 'emirates', 'wenger', 'henry', 'invincibles'] },
        'liverpool': { parents: ['premier-league'], keywords: ['liverpool', 'anfield', 'klopp', 'salah', 'gerrard', 'you\'ll never walk alone'] },
        'real-madrid': { parents: ['la-liga', 'ucl'], keywords: ['real madrid', 'bernabeu', 'blancos', 'benzema', 'modric', 'zidane'] },
        'barcelona': { parents: ['la-liga', 'ucl'], keywords: ['barcelona', 'barca', 'camp nou', 'messi', 'guardiola', 'la masia'] },
        'atletico': { parents: ['la-liga'], keywords: ['atletico', 'atleti', 'simeone', 'colchoneros', 'metropolitano'] },
      };

      const QUIZ_API_CATEGORY_MAP = {
        'world-cup': 'world_cup',
        'ucl': 'clubs',
        'premier-league': 'clubs',
        'la-liga': 'clubs',
        'serie-a': 'clubs',
        'bundesliga': 'clubs',
        'ligue-1': 'clubs',
        'man-utd': 'clubs',
        'man-city': 'clubs',
        'chelsea': 'clubs',
        'arsenal': 'clubs',
        'liverpool': 'clubs',
        'real-madrid': 'clubs',
        'barcelona': 'clubs',
        'atletico': 'clubs',
        'players': 'players',
        'history': 'history',
        'transfers': 'transfers',
        'daily': null,
        'general': 'general',
      };

      function shuffleArray(items) {
        const arr = items.slice();
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      function getQuizRecentMap() {
        try {
          const parsed = JSON.parse(localStorage.getItem(QUIZ_RECENT_STORAGE_KEY) || '{}');
          return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
          return {};
        }
      }

      function rememberQuizQuestions(category, questions) {
        const recent = getQuizRecentMap();
        const keys = (questions || []).map(q => q.q).filter(Boolean);
        const merged = [...keys, ...(recent[category] || [])].filter((q, i, arr) => arr.indexOf(q) === i).slice(0, 40);
        recent[category] = merged;
        localStorage.setItem(QUIZ_RECENT_STORAGE_KEY, JSON.stringify(recent));
      }

      function questionMatchesKeywords(question, keywords) {
        if (!keywords || !keywords.length) return false;
        const haystack = `${question.q || ''} ${question.cat || ''}`.toLowerCase();
        return keywords.some((kw) => haystack.includes(String(kw).toLowerCase()));
      }

      function buildQuizQuestionPool(category) {
        const primary = (QUESTIONS[category] || []).slice();
        const expansion = QUIZ_CATEGORY_EXPANSIONS[category];
        const related = [];
        if (expansion && expansion.parents) {
          expansion.parents.forEach((parentKey) => {
            const parentPool = QUESTIONS[parentKey] || [];
            parentPool.forEach((q) => {
              if (questionMatchesKeywords(q, expansion.keywords)) related.push(q);
            });
          });
        }
        const seen = new Set();
        return primary.concat(related).filter((q) => {
          const key = q.q;
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      function filterQuizPoolByDifficulty(pool, difficulty) {
        if (!difficulty || difficulty === 'mixed') return pool;
        const filtered = pool.filter((q) => q.diff === difficulty);
        return filtered.length >= QUIZ_QUESTIONS_PER_ROUND ? filtered : pool;
      }

      function pickQuizQuestions(category, difficulty = 'mixed', count = QUIZ_QUESTIONS_PER_ROUND) {
        let pool = filterQuizPoolByDifficulty(buildQuizQuestionPool(category), difficulty);
        if (!pool.length) {
          pool = filterQuizPoolByDifficulty(QUESTIONS[category] || QUESTIONS.general || [], difficulty);
        }
        if (!pool.length) return [];

        const recent = new Set(getQuizRecentMap()[category] || []);
        const fresh = pool.filter((q) => !recent.has(q.q));
        const stale = pool.filter((q) => recent.has(q.q));
        const ordered = shuffleArray(fresh.length >= count ? fresh : fresh.concat(shuffleArray(stale)));
        const picked = ordered.slice(0, Math.min(count, ordered.length));
        rememberQuizQuestions(category, picked);
        return picked;
      }

      function mapQuizStartParams(frontendCategory) {
        const mapped = Object.prototype.hasOwnProperty.call(QUIZ_API_CATEGORY_MAP, frontendCategory)
          ? QUIZ_API_CATEGORY_MAP[frontendCategory]
          : 'clubs';
        let difficulty = state.selectedDiff || 'mixed';
        if (frontendCategory === 'daily') difficulty = 'mixed';
        if (difficulty === 'legendary') difficulty = 'hard';
        if (!['easy', 'medium', 'hard', 'mixed'].includes(difficulty)) difficulty = 'mixed';
        const payload = {
          difficulty,
          total_questions: QUIZ_QUESTIONS_PER_ROUND,
          topic: frontendCategory,
          play_mode: frontendCategory === 'daily' ? 'daily' : (state.selectedMode || 'solo'),
        };
        if (mapped) payload.category = mapped;
        if (frontendCategory === 'daily') payload.challenge_type = 'daily';
        return payload;
      }

      function normalizeApiQuestion(q) {
        return {
          id: q.id,
          cat: q.category,
          diff: q.difficulty,
          q: q.question_text,
          opts: [q.option_a, q.option_b, q.option_c, q.option_d],
          answerHash: q.answer_hash || null,
          correctOption: null,
          ans: null,
        };
      }

      async function makeQuizAnswerHash(verifyKey, questionId, option) {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
          'raw',
          enc.encode(verifyKey),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign'],
        );
        const message = `${questionId}:${String(option).toUpperCase()}`;
        const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
        return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
      }

      async function resolveQuizCorrectOptions(verifyKey, questions) {
        return Promise.all(questions.map(async (question) => {
          if (!verifyKey || !question.answerHash) return question;
          for (const letter of ['A', 'B', 'C', 'D']) {
            const hash = await makeQuizAnswerHash(verifyKey, question.id, letter);
            if (hash === question.answerHash) {
              question.correctOption = letter;
              question.ans = 'ABCD'.indexOf(letter);
              break;
            }
          }
          return question;
        }));
      }

      async function syncQuizAnswerItem(item, attempt = 0) {
        if (item.synced) return item.result;
        const payload = {
          session_id: item.sessionId,
          question_id: item.questionId,
          time_taken_seconds: item.timeTakenSeconds,
          timed_out: item.timedOut,
        };
        if (!item.timedOut) payload.selected_option = item.selectedOption;
        try {
          const result = await apiRequest('/api/quiz/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }, QUIZ_ANSWER_TIMEOUT_MS);
          item.synced = true;
          item.result = result;
          return result;
        } catch (err) {
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
            return syncQuizAnswerItem(item, attempt + 1);
          }
          throw err;
        }
      }

      function queueQuizAnswerSync(selectedOption, timeTakenSeconds, timedOut = false) {
        const q = state.quiz;
        const question = q.questions[q.idx];
        const item = {
          sessionId: q.sessionId,
          questionId: question.id,
          selectedOption,
          timeTakenSeconds,
          timedOut,
          synced: false,
          result: null,
        };
        if (!q.answerSyncQueue) q.answerSyncQueue = [];
        q.answerSyncQueue.push(item);
        const sync = syncQuizAnswerItem(item).catch((err) => {
          console.warn('Quiz answer sync failed', err);
        });
        if (!q.pendingSyncs) q.pendingSyncs = [];
        q.pendingSyncs.push(sync);
        return sync;
      }

      async function flushQuizAnswerSyncs() {
        const queue = state.quiz.answerSyncQueue || [];
        for (const item of queue) {
          if (!item.synced) {
            await syncQuizAnswerItem(item);
          }
        }
        const pending = state.quiz.pendingSyncs || [];
        if (pending.length) await Promise.allSettled(pending);
        state.quiz.pendingSyncs = [];
      }

      let quizKeepAliveTimer = null;

      function startQuizKeepAlive() {
        stopQuizKeepAlive();
        wakeApiServer();
        quizKeepAliveTimer = setInterval(() => wakeApiServer(), 45000);
      }

      function stopQuizKeepAlive() {
        if (quizKeepAliveTimer) {
          clearInterval(quizKeepAliveTimer);
          quizKeepAliveTimer = null;
        }
      }

      function beginQuizUi() {
        showPage('play');
        document.getElementById('mode-select').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('quiz-interface').classList.remove('hidden');
        if (state.quiz.serverMode) startQuizKeepAlive();
        renderQuestion();
      }

      async function startQuiz(category) {
        if (category === 'daily') {
          if (!requireLoginForDaily()) return;
          if (!checkDailyLimit()) return;
        }

        if (state.user) {
          try {
            showPleaseWait('Loading quiz…');
            const data = await apiRequest('/api/quiz/start', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(mapQuizStartParams(category)),
            });
            hidePleaseWait();
            const verifyKey = data.verify_key || null;
            let questions = (data.questions || []).map(normalizeApiQuestion);
            if (!questions.length) {
              showToast('No questions available for this category.', 'warning');
              return;
            }
            if (verifyKey) {
              questions = await resolveQuizCorrectOptions(verifyKey, questions);
            }
            if (questions.length < QUIZ_QUESTIONS_PER_ROUND) {
              showToast(`This category has ${questions.length} questions right now.`, 'info');
            }
            state.quiz = {
              ...state.quiz,
              active: true,
              serverMode: true,
              sessionId: data.session.id,
              verifyKey,
              pendingSyncs: [],
              answerSyncQueue: [],
              questions,
              idx: 0,
              score: data.session.score || 0,
              correct: 0,
              streak: 0,
              bestStreak: 0,
              hintPenalty: 1,
              hintsUsed: [],
              submitting: false,
              answersSubmitted: 0,
              category,
            };
            if (category === 'daily') markDailyPlayed();
            beginQuizUi();
          } catch (err) {
            hidePleaseWait();
            const msg = err && err.message ? String(err.message) : 'Could not start quiz';
            if (msg.toLowerCase().includes('verify')) {
              showToast('Please verify your email before playing ranked quizzes.', 'warning');
              openModal('login');
            } else if (msg.toLowerCase().includes('daily challenge')) {
              markDailyPlayed();
              showToast(msg, 'warning');
            } else {
              showToast(msg, 'error');
            }
          }
          return;
        }

        if (category === 'daily') {
          showToast('Log in to play the Daily Challenge.', 'warning');
          openModal('login');
          return;
        }
        showToast('Playing as guest — log in before starting a quiz to update the global leaderboard.', 'info');
        const picked = pickQuizQuestions(category, state.selectedDiff || 'mixed', QUIZ_QUESTIONS_PER_ROUND);
        if (!picked.length) {
          showToast('No questions available for this category.', 'warning');
          return;
        }
        state.quiz = {
          ...state.quiz,
          active: true,
          serverMode: false,
          sessionId: null,
          verifyKey: null,
          pendingSyncs: [],
          answerSyncQueue: [],
          questions: picked,
          idx: 0,
          score: 0,
          correct: 0,
          streak: 0,
          bestStreak: 0,
          hintPenalty: 1,
          hintsUsed: [],
          submitting: false,
          answersSubmitted: 0,
          category,
        };
        beginQuizUi();
      }

      async function submitQuizAnswer(selectedOption, timeTakenSeconds, timedOut = false) {
        const q = state.quiz;
        const question = q.questions[q.idx];
        const payload = {
          session_id: q.sessionId,
          question_id: question.id,
          time_taken_seconds: timeTakenSeconds,
          timed_out: timedOut,
        };
        if (!timedOut) payload.selected_option = selectedOption;
        return apiRequest('/api/quiz/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }, QUIZ_ANSWER_TIMEOUT_MS);
      }

      function markPendingAnswer(idx) {
        document.querySelectorAll('.option').forEach((option, i) => {
          option.classList.add('disabled');
          if (i === idx) option.classList.add('pending');
        });
      }

      function revealAnswerResult(selectedIdx, correctOption, isCorrect) {
        const correctIdx = 'ABCD'.indexOf(correctOption);
        const options = document.querySelectorAll('.option');
        options.forEach(o => o.classList.add('disabled'));
        if (options[correctIdx]) options[correctIdx].classList.add('correct');
        if (!isCorrect && selectedIdx >= 0 && options[selectedIdx]) options[selectedIdx].classList.add('wrong');
      }
      function renderQuestion() {
        const q = state.quiz;
        const question = q.questions[q.idx];
        if (!question) { endQuiz(); return; }
        // reset hints
        q.hintPenalty = 1; q.hintsUsed = [];
        ['hint1', 'hint2', 'hint3'].forEach(id => { const el = document.getElementById(id); if (el) { el.classList.remove('used') } });
        document.getElementById('q-hint').classList.remove('show');
        // update UI
        document.getElementById('q-num').textContent = `Q ${q.idx + 1} / ${q.questions.length}`;
        document.getElementById('q-progress').style.width = `${((q.idx + 1) / q.questions.length) * 100}%`;
        document.getElementById('q-score').textContent = `${q.score} PTS`;
        document.getElementById('q-cat').innerHTML = `<span>${escapeHtml(question.cat)}</span><span class="q-difficulty ${escapeHtml(question.diff)}">${escapeHtml(question.diff)}</span>`;
        document.getElementById('q-text').textContent = question.q;
        const grid = document.getElementById('options-grid');
        grid.innerHTML = question.opts.map((opt, i) => `
    <button class="option" onclick="selectAnswer(${i})">
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      ${escapeHtml(opt)}
    </button>`).join('');
        startTimer();
      }
      async function selectAnswer(idx) {
        const q = state.quiz;
        if (q.submitting) return;
        clearInterval(state.quiz.timer);
        const question = q.questions[q.idx];
        const timeTaken = TIMER_MAX - state.quiz.timeLeft;

        const selectedOption = String.fromCharCode(65 + idx);
        const correctOption = q.serverMode
          ? (question.correctOption || 'A')
          : String.fromCharCode(65 + question.ans);
        const correct = q.serverMode ? (selectedOption === correctOption) : (idx === question.ans);
        const nextStreak = correct ? q.streak + 1 : 0;
        const pts = calcQuizPoints({
          difficulty: question.diff,
          timeLeft: state.quiz.timeLeft,
          timerMax: TIMER_MAX,
          mode: getActiveQuizMode(),
          streak: nextStreak,
          hintPenalty: q.hintPenalty,
          correct,
        });

        q.submitting = true;
        if (correct) {
          q.score += pts;
          q.correct++;
          q.streak = nextStreak;
          if (q.streak > q.bestStreak) q.bestStreak = q.streak;
        } else {
          q.streak = 0;
        }

        revealAnswerResult(idx, correctOption, correct);
        document.getElementById('q-score').textContent = `${q.score} PTS`;
        showFeedback(correct, pts, q.streak);

        if (q.serverMode) {
          q.answersSubmitted++;
          queueQuizAnswerSync(selectedOption, timeTaken);
        }

        const advanceDelay = getQuizAdvanceDelay(correct);
        if (!correct && state.selectedMode === 'hardcore') {
          setTimeout(() => { hideFeedback(); q.submitting = false; endQuiz(); }, advanceDelay);
          return;
        }
        setTimeout(() => {
          hideFeedback();
          q.idx++;
          q.submitting = false;
          renderQuestion();
        }, advanceDelay);
      }
      function showFeedback(correct, pts, streak) {
        if (correct) playCorrectSound();
        else playWrongSound();
        const overlay = document.getElementById('feedback-overlay');
        document.getElementById('fb-icon').textContent = correct ? (streak >= 3 ? '!!!' : 'OK') : 'X';
        document.getElementById('fb-title').textContent = correct ? (streak >= 3 ? `${streak}X COMBO!` : 'CORRECT!') : 'WRONG!';
        document.getElementById('fb-title').style.color = correct ? 'var(--green)' : 'var(--red)';
        document.getElementById('fb-points').textContent = correct ? `+${pts}` : '0';
        document.getElementById('fb-sub').textContent = correct && streak >= 3 ? `🔥 ${streak} in a row! Bonus applied!` : '';
        overlay.classList.add('show');
        if (correct && streak >= 3) spawnComboFlash(streak);
      }
      function hideFeedback() { document.getElementById('feedback-overlay').classList.remove('show'); }
      function spawnComboFlash(streak) {
        const el = document.createElement('div');
        el.className = 'combo-flash';
        el.textContent = `${streak}× COMBO!`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 700);
      }
      function useHint(hintIdx) {
        const q = state.quiz;
        if (q.serverMode) {
          showToast('Hints are not available in verified quiz mode.', 'info');
          return;
        }
        const question = q.questions[q.idx];
        const el = document.getElementById(`hint${hintIdx + 1}`);
        if (!el || el.classList.contains('used')) return;
        el.classList.add('used');
        const penalties = [0.9, 0.8, 0.65];
        q.hintPenalty *= penalties[hintIdx];
        let hintText = '';
        if (hintIdx === 0) {
          // 50/50: hide 2 wrong answers
          const options = document.querySelectorAll('.option');
          let removed = 0;
          options.forEach((opt, i) => {
            if (i !== question.ans && removed < 2) { opt.style.opacity = '0.2'; opt.style.pointerEvents = 'none'; removed++; }
          });
          hintText = 'Two wrong answers removed.';
        } else if (hintIdx === 1) { hintText = question.hint || 'No hint available.'; }
        else { hintText = `Category: ${question.cat}`; }
        const hintEl = document.getElementById('q-hint');
        document.getElementById('q-hint-text').textContent = hintText;
        hintEl.classList.add('show');
        showToast(`💡 Hint used! Points reduced`, 'info');
      }
      // ──────────────────────────  a• a• a• a• a• a•  TIMER a• a• a• a• a• a• a• 
      let TIMER_MAX = 15;
      function startTimer() {
        clearInterval(state.quiz.timer);
        TIMER_MAX = getQuizTimerMax(getActiveQuizMode());
        state.quiz.timeLeft = TIMER_MAX;
        updateTimerUI();
        state.quiz.timer = setInterval(() => {
          state.quiz.timeLeft--;
          updateTimerUI();
          if (state.quiz.timeLeft <= 0) {
            clearInterval(state.quiz.timer);
            timeUp();
          }
        }, 1000);
      }
      function updateTimerUI() {
        const t = state.quiz.timeLeft;
        const ring = document.getElementById('timer-ring');
        const arc = document.getElementById('timer-arc');
        const text = document.getElementById('timer-text');
        if (!ring) return;
        const pct = t / TIMER_MAX;
        const circumference = 176;
        arc.style.strokeDashoffset = circumference * (1 - pct);
        text.textContent = t;
        ring.classList.remove('warning', 'danger');
        if (t <= 5) ring.classList.add('danger');
        else if (t <= 8) ring.classList.add('warning');
      }
      async function timeUp() {
        const q = state.quiz;
        if (q.submitting) return;

        if (q.serverMode) {
          q.submitting = true;
          const question = q.questions[q.idx];
          const correctOption = question.correctOption || 'A';
          q.answersSubmitted++;
          revealAnswerResult(-1, correctOption, false);
          q.streak = 0;
          showFeedback(false, 0, 0);
          queueQuizAnswerSync(null, TIMER_MAX, true);
          const advanceDelay = getQuizAdvanceDelay(false);
          if (state.selectedMode === 'hardcore') {
            setTimeout(() => { hideFeedback(); q.submitting = false; endQuiz(); }, advanceDelay);
            return;
          }
          setTimeout(() => {
            hideFeedback();
            q.idx++;
            q.submitting = false;
            renderQuestion();
          }, advanceDelay);
          return;
        }

        const question = q.questions[q.idx];
        revealAnswerResult(-1, String.fromCharCode(65 + question.ans), false);
        q.streak = 0;
        showFeedback(false, 0, 0);
        const advanceDelay = getQuizAdvanceDelay(false);
        if (state.selectedMode === 'hardcore') {
          setTimeout(() => { hideFeedback(); endQuiz(); }, advanceDelay);
          return;
        }
        setTimeout(() => {
          hideFeedback();
          q.idx++;
          renderQuestion();
        }, advanceDelay);
      }

      function setResultsLoading(loading) {
        const loadingEl = document.getElementById('results-loading');
        const contentEl = document.getElementById('results-content');
        const actionsEl = document.getElementById('results-actions');
        if (loadingEl) loadingEl.classList.toggle('hidden', !loading);
        if (contentEl) contentEl.classList.toggle('results-content-hidden', loading);
        if (actionsEl) {
          actionsEl.querySelectorAll('button').forEach((btn) => { btn.disabled = loading; });
        }
      }

      function renderQuizResults({ score, correct, total, bestStreak }) {
        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
        const titles = ['Keep Practicing!', 'Not Bad!', 'Good Game!', 'Great Performance!', 'Excellent!', 'Unstoppable! 🔥'];
        const titleIdx = Math.floor(pct / 20);
        document.getElementById('results-pct').textContent = pct + '%';
        document.getElementById('results-title').textContent = titles[Math.min(titleIdx, 5)];
        document.getElementById('results-msg').textContent = `${correct}/${total} correct answers`;
        document.getElementById('r-correct').textContent = correct;
        document.getElementById('r-points').textContent = score;
        document.getElementById('r-best-streak').textContent = bestStreak;
        const arc = document.getElementById('results-arc');
        if (arc) {
          arc.style.strokeDashoffset = '377';
          setTimeout(() => {
            arc.style.strokeDashoffset = String(377 * (1 - pct / 100));
          }, 80);
        }
      }

      async function endQuiz() {
        stopQuizKeepAlive();
        clearInterval(state.quiz.timer);
        document.getElementById('quiz-interface').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');

        const q = state.quiz;
        const total = q.questions.length;
        let score = q.score;
        let correct = q.correct;
        const needsDbSync = q.serverMode && q.sessionId;

        setResultsLoading(needsDbSync);

        if (needsDbSync) {
          try {
            await flushQuizAnswerSyncs();
            if (q.answersSubmitted >= total) {
              const session = await apiRequest(`/api/quiz/complete/${q.sessionId}`, { method: 'POST' });
              score = session.score ?? score;
              correct = q.correct;
              clearLeaderboardCache();
              updateHomeLeaderboardPreview();
              if (state.lbTab) switchLbTab(null, state.lbTab);
            }
          } catch (err) {
            showToast(err.message || 'Quiz finished locally but could not be saved to leaderboard.', 'warning');
          }
        }

        setResultsLoading(false);
        renderQuizResults({ score, correct, total, bestStreak: q.bestStreak });
        q.score = score;
        saveQuizResult(q.category, score, correct, total, TIMER_MAX - state.quiz.timeLeft);
        if (!q.serverMode || q.answersSubmitted >= total) {
          markCategoryCompleted(q.category);
        }
        showToast(`🏆 Game over! ${correct}/${total} correct`, 'success');
      }
      function exitQuiz() {
        clearInterval(state.quiz.timer);
        document.getElementById('quiz-interface').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('mode-select').classList.remove('hidden');
      }
      function restartQuiz() {
        setResultsLoading(false);
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('mode-select').classList.remove('hidden');
        syncModeCardSelection();
      }
      function syncModeCardSelection(mode) {
        const activeMode = mode || state.selectedMode || 'solo';
        document.querySelectorAll('.mode-card').forEach(card => {
          card.classList.toggle('active', card.dataset.mode === activeMode);
        });
      }

      function selectMode(mode) {
        if (mode === 'daily') {
          if (!requireLoginForDaily()) return;
          state.selectedMode = mode;
          syncModeCardSelection(mode);
          startQuiz('daily');
          return;
        }
        if (mode === 'multiplayer') {
          if (!state.user) {
            showToast('Please log in or sign up to enter the Realtime Arena.', 'warning');
            openModal('login');
            return;
          }
          state.selectedMode = mode;
          syncModeCardSelection(mode);
          showPage('battle');
          return;
        }
        if (mode === 'ranked') {
          if (!state.user) {
            showToast('Please log in to play Ranked Mode. Your scores count towards the global leaderboard!', 'warning');
            openModal('login');
            return;
          }
        }
        state.selectedMode = mode;
        syncModeCardSelection(mode);
        showToast(`⚡ Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, 'info');
      }
      function selectDiff(diff, el) {
        state.selectedDiff = diff;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        showToast(`Difficulty: ${diff.charAt(0).toUpperCase() + diff.slice(1)}`, 'info');
      }
      // ────────────────────────── a•a•a•a•a•a• TRANSFER GUESSER a•a•a•a•a•a•a•
      function newTransferGame() {
        const maxGuesses = 5;
        state.transfer = { playerIdx: Math.floor(Math.random() * TRANSFER_PLAYERS.length), guesses: [], maxGuesses, revealed: false, hintsRevealed: 1 };
        document.getElementById('tg-num').textContent = state.transfer.playerIdx + 1;
        document.getElementById('tg-guesses-left').textContent = maxGuesses;
        document.getElementById('tg-input').value = '';
        document.getElementById('tg-guesses-list').innerHTML = '';
        document.getElementById('tg-answer-reveal').classList.add('hidden');
        renderTransferClues();
      }
      function showTransferSuggestions() {
        const input = document.getElementById('tg-input');
        const val = input.value.trim().toLowerCase();
        const suggestionsDiv = document.getElementById('tg-suggestions');
        if (!val) {
          suggestionsDiv.style.display = 'none';
          return;
        }
        const matches = TRANSFER_PLAYERS.filter(p => p.name.toLowerCase().includes(val));
        if (matches.length === 0) {
          suggestionsDiv.style.display = 'none';
          return;
        }
        suggestionsDiv.innerHTML = matches.map(p => `
        <div class="suggestion-item" onclick="selectTransferSuggestion('${escapeJsString(p.name)}')">
          ${escapeHtml(p.name)}
        </div>
      `).join('');
        suggestionsDiv.style.display = 'block';
      }
      function selectTransferSuggestion(name) {
        document.getElementById('tg-input').value = name;
        document.getElementById('tg-suggestions').style.display = 'none';
        document.getElementById('tg-input').focus();
      }
      document.addEventListener('click', function (e) {
        const suggestionsDiv = document.getElementById('tg-suggestions');
        const input = document.getElementById('tg-input');
        if (suggestionsDiv && e.target !== input && !suggestionsDiv.contains(e.target)) {
          suggestionsDiv.style.display = 'none';
        }
      });
      function renderTransferClues() {
        const container = document.getElementById('tg-clues-container');
        container.style.display = 'block';
        const player = TRANSFER_PLAYERS[state.transfer.playerIdx];
        const clueCategories = ['Nationality', 'Age', 'Position', 'League', 'Club', 'Value'];
        const clueValues = [player.nationality, player.age + '', player.position, player.league, player.club, player.value];
        const hintsRevealed = state.transfer.hintsRevealed;
        container.innerHTML = `
    <div class="clue-row">
      ${clueCategories.map((cat, i) => `
        <div class="clue-cell${i < hintsRevealed ? '' : ''}">
          <div class="clue-cell-label">${cat}</div>
          <div class="clue-cell-value">${i < hintsRevealed ? clueValues[i] : '?'}</div>
        </div>`).join('')}
    </div>`;
      }
      function submitTransferGuess() {
        const input = document.getElementById('tg-input');
        const guess = input.value.trim();
        if (!guess) return;
        const player = TRANSFER_PLAYERS[state.transfer.playerIdx];
        const t = state.transfer;
        if (t.revealed) return;
        // Find guessed player details
        const guessedPlayer = TRANSFER_PLAYERS.find(p => p.name.toLowerCase() === guess.toLowerCase());
        if (!guessedPlayer) {
          showToast('Player not found. Choose from the suggestions.', 'error');
          return;
        }
        const correct = guessedPlayer.name.toLowerCase() === player.name.toLowerCase();
        // Comparison logic for cells
        // Nationality
        const natCorrect = guessedPlayer.nationality.toLowerCase() === player.nationality.toLowerCase();
        const natClass = natCorrect ? 'correct' : 'wrong';
        // Age
        const ageDiff = Math.abs(guessedPlayer.age - player.age);
        const ageCorrect = guessedPlayer.age === player.age;
        const ageClass = ageCorrect ? 'correct' : (ageDiff <= 2 ? 'partial' : 'wrong');
        const ageArrow = player.age > guessedPlayer.age ? ' ↑' : (player.age < guessedPlayer.age ? ' ↓' : '');
        // Position
        const posCorrect = guessedPlayer.position.toLowerCase() === player.position.toLowerCase();
        const isAttacker = p => ['striker', 'forward', 'winger'].includes(p.toLowerCase());
        const isMidfielder = p => ['midfielder'].includes(p.toLowerCase());
        const isDefender = p => ['defender'].includes(p.toLowerCase());
        const posPartial = (isAttacker(guessedPlayer.position) && isAttacker(player.position)) ||
          (isMidfielder(guessedPlayer.position) && isMidfielder(player.position)) ||
          (isDefender(guessedPlayer.position) && isDefender(player.position));
        const posClass = posCorrect ? 'correct' : (posPartial ? 'partial' : 'wrong');
        // League
        const lgCorrect = guessedPlayer.league.toLowerCase() === player.league.toLowerCase();
        const lgClass = lgCorrect ? 'correct' : 'wrong';
        // Club
        const clubCorrect = guessedPlayer.club.toLowerCase() === player.club.toLowerCase();
        const hasSharedClubs = guessedPlayer.clubs.some(c => player.clubs.includes(c));
        const clubClass = clubCorrect ? 'correct' : (hasSharedClubs ? 'partial' : 'wrong');
        // Value
        const getValNum = str => parseInt(str.replace(/[^0-9]/g, '')) || 0;
        const guessedVal = getValNum(guessedPlayer.value);
        const playerVal = getValNum(player.value);
        const valCorrect = guessedVal === playerVal;
        const valClass = valCorrect ? 'correct' : 'wrong';
        const valArrow = playerVal > guessedVal ? ' ↑' : (playerVal < guessedVal ? ' ↓' : '');
        const guessList = document.getElementById('tg-guesses-list');
        const guessEl = document.createElement('div');
        guessEl.style.marginBottom = '1.25rem';
        guessEl.innerHTML = `
        <div style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text2);margin-bottom:0.35rem">
          Guess ${t.guesses.length + 1}: <strong>${escapeHtml(guessedPlayer.name)}</strong>
        </div>
        <div class="clue-row">
          <div class="clue-cell ${natClass}">
            <div class="clue-cell-label">Nation</div>
            <div class="clue-cell-value">${escapeHtml(guessedPlayer.nationality)}</div>
          </div>
          <div class="clue-cell ${ageClass}">
            <div class="clue-cell-label">Age</div>
            <div class="clue-cell-value">${guessedPlayer.age}${ageArrow}</div>
          </div>
          <div class="clue-cell ${posClass}">
            <div class="clue-cell-label">Pos</div>
            <div class="clue-cell-value">${escapeHtml(guessedPlayer.position)}</div>
          </div>
          <div class="clue-cell ${lgClass}">
            <div class="clue-cell-label">League</div>
            <div class="clue-cell-value">${escapeHtml(guessedPlayer.league)}</div>
          </div>
          <div class="clue-cell ${clubClass}">
            <div class="clue-cell-label">Club</div>
            <div class="clue-cell-value">${escapeHtml(guessedPlayer.club)}</div>
          </div>
          <div class="clue-cell ${valClass}">
            <div class="clue-cell-label">Value</div>
            <div class="clue-cell-value">${escapeHtml(guessedPlayer.value)}${valArrow}</div>
          </div>
        </div>
      `;
        guessList.appendChild(guessEl);
        t.guesses.push(guess);
        input.value = '';
        if (!correct && t.hintsRevealed < 6) {
          t.hintsRevealed++;
        }
        renderTransferClues();
        document.getElementById('tg-guesses-left').textContent = Math.max(0, t.maxGuesses - t.guesses.length);
        if (correct || t.guesses.length >= t.maxGuesses) {
          t.revealed = true;
          t.hintsRevealed = 6;
          renderTransferClues();
          const reveal = document.getElementById('tg-answer-reveal');
          reveal.classList.remove('hidden');
          reveal.innerHTML = `
          <div style="font-family:var(--font-display);font-size: 1.25rem; font-weight: 600;letter-spacing:2px;margin-bottom:.5rem;color:${correct ? 'var(--green)' : 'var(--text)'}">${correct ? 'CORRECT!' : 'THE ANSWER WAS...'}</div>
          <div style="font-family:var(--font-display);font-size: 1.25rem; font-weight: 600;color:var(--accent);letter-spacing:1px">${escapeHtml(player.name)}</div>
          <div style="color:var(--text2);font-size:.9rem;margin-top:.5rem">${escapeHtml(player.nationality)}  -  ${escapeHtml(player.position)}  -  ${escapeHtml(player.club)}</div>
          <div style="margin-top:.75rem;font-size:.85rem;color:var(--text3)">Career: ${escapeHtml(player.clubs.join(' → '))}</div>
          <button class="btn btn-primary mt-3" onclick="newTransferGame()">Try Another</button>
        `;
          showToast(correct ? 'You got it!' : `It was ${player.name}`, correct ? 'success' : 'error');
          if (correct) playCorrectSound();
          else playWrongSound();
        }
      }
      // ──────────────────────────  a• a• a• a• a• a•  LEADERBOARD a• a• a• a• a• a• a• 
      let lbUnsubscribe = null;
      function getLeaderboardFlagImg(country) {
        if (!country) return '';
        const emojiMap = {
          '🇧🇷': 'br', '🇬🇧': 'gb', '🇦🇷': 'ar', '🇩🇪': 'de', '🇫🇷': 'fr', '🇵🇹': 'pt', '🇮🇹': 'it', '🇪🇸': 'es',
          'br': 'br', 'gb': 'gb', 'ar': 'ar', 'de': 'de', 'fr': 'fr', 'pt': 'pt', 'it': 'it', 'es': 'es'
        };
        const code = emojiMap[country] || (country.length === 2 ? country.toLowerCase() : null);
        if (code) {
          return `<img src="https://flagcdn.com/${code}.svg" alt="${country}" style="width:18px; height:12px; border-radius:2px; object-fit:cover; vertical-align:middle; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.25);">`;
        }
        return country;
      }

      function getLeaderboardFlag(entry) {
        const code = entry && (entry.country_code || entry.countryCode);
        if (!code) return '';
        const flagStyle = 'width:18px; height:12px; border-radius:2px; object-fit:cover; vertical-align:middle; margin-right:4px; box-shadow:0 1px 2px rgba(0,0,0,0.25);';
        return countryFlagImg(code, '', flagStyle);
      }
      // DB stores 3-letter country codes (ENG, ESP, BRA...), but flagcdn needs
      // 2-letter ISO codes. Map the common football nations; UK home nations use
      // flagcdn subdivision codes (gb-eng, gb-sct, gb-wls).
      const FLAGCDN_CODE_MAP = {
        eng: 'gb-eng', sco: 'gb-sct', wal: 'gb-wls', nir: 'gb-nir',
        gbr: 'gb', uk: 'gb',
        esp: 'es', bra: 'br', deu: 'de', ger: 'de', ita: 'it', fra: 'fr',
        arg: 'ar', prt: 'pt', por: 'pt', nld: 'nl', ned: 'nl', bel: 'be',
        usa: 'us', mex: 'mx', can: 'ca', ury: 'uy', uru: 'uy', col: 'co',
        chl: 'cl', chi: 'cl', per: 'pe', ecu: 'ec', par: 'py', pry: 'py',
        ven: 've', bol: 'bo', crc: 'cr', cri: 'cr',
        jpn: 'jp', kor: 'kr', aus: 'au', sau: 'sa', irn: 'ir', irq: 'iq',
        qat: 'qa', uae: 'ae', mar: 'ma', sen: 'sn', nga: 'ng', gha: 'gh',
        egy: 'eg', cmr: 'cm', civ: 'ci', tun: 'tn', alg: 'dz', dza: 'dz',
        rsa: 'za', zaf: 'za', cro: 'hr', hrv: 'hr', srb: 'rs', sui: 'ch',
        che: 'ch', swe: 'se', nor: 'no', den: 'dk', dnk: 'dk', pol: 'pl',
        ukr: 'ua', tur: 'tr', gre: 'gr', grc: 'gr', aut: 'at', cze: 'cz',
        rou: 'ro', rus: 'ru', hun: 'hu', irl: 'ie',
        pak: 'pk', ind: 'in', bgd: 'bd', mys: 'my', idn: 'id', phl: 'ph', sgp: 'sg',
      };

      function toFlagcdnCode(code) {
        if (!code) return null;
        const c = String(code).toLowerCase();
        if (FLAGCDN_CODE_MAP[c]) return FLAGCDN_CODE_MAP[c];
        if (c.length === 2) return c; // already a valid ISO-2 code
        return null;
      }

      // Returns flag <img> HTML with a graceful emoji fallback if it fails to load.
      function countryFlagImg(code, name, sizeStyle) {
        const fc = toFlagcdnCode(code);
        const style = sizeStyle || 'width:24px; height:16px; border-radius:2px; object-fit:cover; box-shadow:0 1px 2px rgba(0,0,0,0.25);';
        if (!fc) {
          return `<span style="${style}display:inline-flex;align-items:center;justify-content:center;background:var(--surface2)">🏳️</span>`;
        }
        const safeName = escapeAttr(name || '');
        return `<img src="https://flagcdn.com/${fc}.svg" alt="${safeName}" style="${style}" onerror="lbLogoFallback(this,'🏳️')">`;
      }

      // Replaces a broken/failed league logo with a stable emoji badge so it
      // doesn't simply vanish after first paint (e.g. WC.png 404s, host flakiness).
      function lbLogoFallback(img, emoji) {
        if (!img || img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = '1';
        const span = document.createElement('span');
        span.className = 'lb-league-logo';
        span.textContent = emoji || '⚽';
        span.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;font-size:18px;line-height:1;';
        img.replaceWith(span);
      }

      function getStaticLeaderboard() {
        return (typeof window !== 'undefined' && window.LEADERBOARD_DATA) || [];
      }

      function readLbCache(period, maxAgeMs = 2 * 60 * 1000) {
        try {
          const raw = localStorage.getItem('ft_lb_cache_' + period);
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (!parsed || !Array.isArray(parsed.entries)) return null;
          if (parsed.savedAt && Date.now() - parsed.savedAt > maxAgeMs) return null;
          return parsed;
        } catch (e) {}
        return null;
      }

      function saveLbCache(period, entries, currentUser) {
        try {
          localStorage.setItem('ft_lb_cache_' + period, JSON.stringify({
            savedAt: Date.now(),
            entries,
            current_user: currentUser || null,
          }));
        } catch (e) {}
      }

      function clearLeaderboardCache() {
        ['all_time', 'weekly', 'monthly'].forEach((period) => {
          try { localStorage.removeItem('ft_lb_cache_' + period); } catch (e) {}
        });
      }

      function paintLbRows(container, entries, tab, currentUser) {
        if (!container || !entries || !entries.length) return false;
        const meId = currentUser ? currentUser.user_id : null;
        const userInTop10 = !!(meId && entries.some(p => p.user_id === meId));
        let html = entries.map(p => buildLbRowHtml(p, tab, meId && p.user_id === meId)).join('');
        if (currentUser && !userInTop10) {
          html += `<div class="lb-separator" style="text-align:center;color:var(--text3);font-size:1.25rem;letter-spacing:0.4em;padding:0.5rem 0;user-select:none">· · ·</div>`;
          html += buildLbRowHtml(currentUser, tab, true);
        }
        container.innerHTML = html;
        return true;
      }

      function renderLocalLbRows(container, limit = 10) {
        if (!container) return;
        const rows = getStaticLeaderboard().slice(0, limit);
        if (!rows.length) return;
        container.innerHTML = rows.map((p, i) => `
          <div class="lb-row">
            <div class="lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">${i + 1}</div>
            <div class="lb-avatar" style="background:var(--surface2)">${p.name ? p.name[0].toUpperCase() : '?'}</div>
            <div class="lb-info"><div class="lb-name">${escapeHtml(p.name || 'Guest')}</div></div>
            <div class="lb-score">${(p.score || 0).toLocaleString()}</div>
          </div>
        `).join('');
      }

      function renderStaticLeaderboard() {
        switchLbTab(null, 'alltime');
      }
      // Map UI tab -> backend period query param.
      const LB_TAB_TO_PERIOD = { daily: 'daily', weekly: 'weekly', monthly: 'monthly', alltime: 'all_time' };

      function buildLbRowHtml(p, tab, isCurrentUser) {
        const rankLabel = p.rank;
        const rankClass = rankLabel === 1 ? 'gold' : rankLabel === 2 ? 'silver' : rankLabel === 3 ? 'bronze' : '';
        let tierName = 'Bronze'; let tierColor = '#cd7f32';
        if (p.total_points >= 10000) { tierName = 'Diamond'; tierColor = '#b9f2ff'; }
        else if (p.total_points >= 5000) { tierName = 'Platinum'; tierColor = '#e5e4e2'; }
        else if (p.total_points >= 2500) { tierName = 'Gold'; tierColor = 'var(--gold)'; }
        else if (p.total_points >= 1000) { tierName = 'Silver'; tierColor = '#c0c0c0'; }

        const scoreToDisplay = tab === 'monthly' ? p.monthly_points
          : (tab === 'alltime' ? p.total_points : p.weekly_points);

        const highlightStyle = isCurrentUser
          ? 'background:rgba(212,175,55,0.12);border:1px solid var(--gold);border-radius:10px;'
          : '';
        const youBadge = isCurrentUser
          ? '<span style="font-size:0.6rem;background:var(--gold);color:#000;padding:0.1rem 0.35rem;border-radius:4px;margin-left:0.4rem;font-weight:800;letter-spacing:0.03em">YOU</span>'
          : '';

        return `
            <div class="lb-row" style="${highlightStyle}">
              <div class="lb-rank ${rankClass}">${rankLabel}</div>
              <div class="lb-avatar" style="background:var(--surface2)">${escapeHtml(p.username ? p.username[0].toUpperCase() : '?')}</div>
              <div class="lb-info">
                <div class="lb-name">${escapeHtml(p.username || 'Guest')}${youBadge}
                  <span style="font-size:0.65rem;background:${tierColor};color:#000;padding:0.1rem 0.35rem;border-radius:4px;margin-left:0.5rem;font-weight:700">${tierName}</span>
                </div>
                <div class="lb-meta">${getLeaderboardFlag(p)} &nbsp; Rank: ${rankLabel}</div>
              </div>
              <div class="lb-score">${(scoreToDisplay || 0).toLocaleString()}</div>
            </div>`;
      }

      async function switchLbTab(el, tab) {
        state.lbTab = tab || 'alltime';
        const container = document.getElementById('lb-main-list');
        if (!container) return;

        const period = LB_TAB_TO_PERIOD[tab] || 'all_time';
        const cached = readLbCache(period);
        if (cached && cached.entries.length) {
          paintLbRows(container, cached.entries, tab, cached.current_user);
        } else {
          renderLocalLbRows(container, 10);
        }

        try {
          const data = await apiRequestWithRetry(`/api/leaderboard/ranked?period=${encodeURIComponent(period)}`);
          const entries = (data && data.entries) || [];
          const currentUser = data && data.current_user;

          if (entries.length === 0) {
            container.innerHTML = "<div style='padding:2rem;text-align:center'>No scores yet.</div>";
            return;
          }

          saveLbCache(period, entries, currentUser);
          paintLbRows(container, entries, tab, currentUser);
        } catch (err) {
          console.error('Failed to load leaderboard from database:', err);
          if (cached && cached.entries.length) return;
          container.innerHTML = `<div style='padding:2rem;text-align:center;color:var(--text3)'>
            ${escapeHtml(err.message || 'Could not load live rankings.')}
            <br><button class="btn btn-ghost" style="margin-top:1rem" onclick="switchLbTab(null, state.lbTab || 'alltime')">Retry</button>
          </div>`;
        }
      }
      async function updateHomeLeaderboardPreview() {
        const lbPreview = document.getElementById('lb-list');
        if (!lbPreview) return;
        const cached = readLbCache('all_time');
        if (cached && cached.entries.length) {
          let html = '';
          cached.entries.slice(0, 5).forEach((p, i) => {
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            html += `<div class="lb-row"><div class="lb-rank ${rankClass}">${p.rank || i + 1}</div><div class="lb-info"><div class="lb-name">${escapeHtml(p.username || 'Guest')}</div></div><div class="lb-score">${(p.total_points || 0).toLocaleString()}</div></div>`;
          });
          lbPreview.innerHTML = html;
        } else {
          renderLocalLbRows(lbPreview, 5);
        }
        try {
          const data = await apiRequestWithRetry('/api/leaderboard/global?limit=5');
          let html = '';
          data.slice(0, 5).forEach((p, i) => {
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            html += `<div class="lb-row"><div class="lb-rank ${rankClass}">${p.rank || i + 1}</div><div class="lb-info"><div class="lb-name">${escapeHtml(p.username || 'Guest')}</div></div><div class="lb-score">${(p.total_points || 0).toLocaleString()}</div></div>`;
          });
          lbPreview.innerHTML = html;
          saveLbCache('all_time', data, null);
        } catch (err) {
          console.error('Failed to load home leaderboard preview:', err);
        }
      }
      function renderLeaderboard(containerId, data) {
        if (containerId === 'lb-main-list') {
          switchLbTab(null, 'alltime');
        } else if (containerId === 'lb-list') {
          updateHomeLeaderboardPreview();
        }
      }
      function setActive(el) {
        if (!el) return;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        el.classList.add('active');
      }
      function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        var btn = document.querySelector('.theme-toggle');
        if (btn) btn.innerHTML = state.theme === 'dark' ? '&#9790;' : '&#9728;';
        var st = document.getElementById('theme-status');
        if (st) st.textContent = 'Currently: ' + (state.theme === 'dark' ? 'Dark' : 'Light');
      }
      function toggleSound() {
        state.sound = !state.sound;
        localStorage.setItem('footytrivia_sound', state.sound ? '1' : '0');
        syncSoundUi();
        showToast(state.sound ? 'Sound effects enabled' : 'Sound effects disabled', 'info');
        if (state.sound) playCorrectSound();
      }
      // ────────────────────────── a•a•a•a•a•a• TOAST a•a•a•a•a•a•a•
      let authWaitToast = null;
      let authWaitShownAt = 0;
      const AUTH_WAIT_MIN_MS = 800;

      function showToast(msg, type = 'info', durationMs = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '🏆', error: '❌', warning: '⚠️', info: '⚡' };
        toast.innerHTML = `<span>${icons[type] || '⚡'}</span> <span>${escapeHtml(msg)}</span>`;
        container.appendChild(toast);
        const hideAfter = Math.max(3000, durationMs || 3000);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(20px)';
          toast.style.transition = 'all .3s';
          setTimeout(() => toast.remove(), 300);
        }, hideAfter);
      }

      function showPleaseWait(msg = 'Please wait…') {
        hidePleaseWait(true);
        const container = document.getElementById('toast-container');
        if (!container) return;
        authWaitShownAt = Date.now();
        container.classList.add('auth-wait-active');
        authWaitToast = document.createElement('div');
        authWaitToast.className = 'toast info auth-wait-toast';
        authWaitToast.innerHTML = `<span>⏳</span> <span>${escapeHtml(msg)}</span>`;
        container.appendChild(authWaitToast);
      }

      function hidePleaseWait(immediate = false) {
        const remove = () => {
          if (authWaitToast) {
            authWaitToast.remove();
            authWaitToast = null;
          }
          authWaitShownAt = 0;
          const container = document.getElementById('toast-container');
          if (container) container.classList.remove('auth-wait-active');
        };
        if (immediate || !authWaitShownAt) {
          remove();
          return;
        }
        const remaining = Math.max(0, AUTH_WAIT_MIN_MS - (Date.now() - authWaitShownAt));
        setTimeout(remove, remaining);
      }

      function escapeHtml(value) {
        return String(value ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
      }

      function escapeJsString(value) {
        return String(value ?? '')
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
          .replace(/</g, '\\u003c');
      }

      const ALLOWED_PAGES = new Set([
        'home', 'categories', 'play', 'battle', 'transfer', 'leaderboard',
        'worldcup', 'profile', 'club', 'analytics', 'prediction-center',
      ]);

      function safeImageUrl(url, fallback = '') {
        try {
          const parsed = new URL(String(url || '').trim());
          if (parsed.protocol !== 'https:') return fallback;
          return parsed.href;
        } catch (e) {
          return fallback;
        }
      }

      const INPUT_LIMITS = {
        email: 254,
        password: 128,
        username: 50,
        roomCode: 6,
      };
      const CONTROL_CHAR_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;
      const USERNAME_RE = /^[a-zA-Z0-9_]+$/;
      const ROOM_CODE_RE = /^[A-Z0-9]{6}$/;

      function rejectControlChars(value, label) {
        if (CONTROL_CHAR_RE.test(value) || value.includes('\0')) {
          throw new Error(`${label} contains invalid characters`);
        }
      }

      function validateEmailInput(value) {
        const email = String(value || '').trim();
        rejectControlChars(email, 'Email');
        if (!email || email.length > INPUT_LIMITS.email) {
          throw new Error('Enter a valid email address');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error('Enter a valid email address');
        }
        return email;
      }

      function validateUsernameInput(value) {
        const username = String(value || '').trim();
        rejectControlChars(username, 'Username');
        if (username.length < 3 || username.length > INPUT_LIMITS.username || !USERNAME_RE.test(username)) {
          throw new Error('Username must be 3-50 characters and use only letters, numbers, or underscores');
        }
        return username;
      }

      function validatePasswordInput(value, label = 'Password') {
        const password = String(value || '');
        rejectControlChars(password, label);
        if (password.length < 8 || password.length > INPUT_LIMITS.password) {
          throw new Error(`${label} must be 8-128 characters`);
        }
        return password;
      }

      function validateRoomCodeInput(value) {
        const code = String(value || '').trim().toUpperCase();
        rejectControlChars(code, 'Room code');
        if (!ROOM_CODE_RE.test(code)) {
          throw new Error('Room code must be exactly 6 letters or numbers');
        }
        return code;
      }

      function authPasswordField(id, placeholder, extraAttrs = '') {
        return `
            <div class="password-field-wrap">
              <input type="password" id="${id}" class="form-input" required placeholder="${placeholder}" maxlength="${INPUT_LIMITS.password}" ${extraAttrs}>
              <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('${id}', this)" aria-label="Show password" title="Show password">👁</button>
            </div>`;
      }

      function togglePasswordVisibility(inputId, btn) {
        const input = document.getElementById(inputId);
        if (!input || !btn) return;
        const revealing = input.type === 'password';
        input.type = revealing ? 'text' : 'password';
        btn.textContent = revealing ? '🙈' : '👁';
        const label = revealing ? 'Hide password' : 'Show password';
        btn.setAttribute('aria-label', label);
        btn.title = label;
      }

      function setupAuthModal() {
        setAuthFormError('');
        setAuthFormStatus('');
        const form = document.querySelector('#modal-content form');
        if (!form) return;
        const passwordInput = form.querySelector('#auth-password, #auth-new-password');
        if (!passwordInput) return;
        passwordInput.addEventListener('keydown', (ev) => {
          if (ev.key !== 'Enter') return;
          ev.preventDefault();
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn && !submitBtn.disabled) submitBtn.click();
        });
      }

      function setAuthSubmitting(form, isSubmitting) {
        const btn = form && form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = isSubmitting;
      }
      // ──────────────────────────  a• a• a• a• a• a•  COUNTDOWN TIMER a• a• a• a• a• a• a• 
      function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diff = tomorrow - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const pad = n => String(n).padStart(2, '0');
        const hEl = document.getElementById('cd-h'), mEl = document.getElementById('cd-m'), sEl = document.getElementById('cd-s');
        if (hEl) hEl.textContent = pad(h);
        if (mEl) mEl.textContent = pad(m);
        if (sEl) sEl.textContent = pad(s);
      }
      // ────────────────────────── a•a•a•a•a•a• HAMBURGER a•a•a•a•a•a•a•
      function resetWcMobileNavSub() {
        const sub = document.getElementById('wc-mobile-nav-sub');
        const toggle = document.querySelector('.wc-mobile-nav-toggle');
        if (sub) sub.classList.remove('open');
        if (toggle) toggle.classList.remove('expanded');
        document.querySelectorAll('.wc-mobile-tab').forEach(el => el.classList.remove('active'));
      }

      function toggleMenu() {
        const menu = document.getElementById('mobile-menu');
        const wasOpen = menu.classList.contains('open');
        menu.classList.toggle('open');
        if (wasOpen) resetWcMobileNavSub();
      }
      function closeMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
        resetWcMobileNavSub();
      }
      // ──────────────────────────  FAVOURITE CLUB DATA & ACTIONS ──────────────────────────
      const ALL_CLUBS = {
        "Premier League": [
          { name: "Arsenal", logo: "https://crests.football-data.org/57.png" },
          { name: "Aston Villa", logo: "https://crests.football-data.org/58.png" },
          { name: "Bournemouth", logo: "https://crests.football-data.org/1044.png" },
          { name: "Brentford", logo: "https://crests.football-data.org/402.png" },
          { name: "Brighton", logo: "https://crests.football-data.org/397.png" },
          { name: "Chelsea", logo: "https://crests.football-data.org/61.png" },
          { name: "Crystal Palace", logo: "https://crests.football-data.org/354.png" },
          { name: "Everton", logo: "https://crests.football-data.org/62.png" },
          { name: "Fulham", logo: "https://crests.football-data.org/63.png" },
          { name: "Ipswich Town", logo: "https://crests.football-data.org/394.png" },
          { name: "Leicester City", logo: "https://crests.football-data.org/338.png" },
          { name: "Liverpool", logo: "https://crests.football-data.org/64.png" },
          { name: "Manchester City", logo: "https://crests.football-data.org/65.png" },
          { name: "Manchester United", logo: "https://crests.football-data.org/66.png" },
          { name: "Newcastle United", logo: "https://crests.football-data.org/67.png" },
          { name: "Nottingham Forest", logo: "https://crests.football-data.org/68.png" },
          { name: "Southampton", logo: "https://crests.football-data.org/340.png" },
          { name: "Tottenham Hotspur", logo: "https://crests.football-data.org/73.png" },
          { name: "West Ham United", logo: "https://crests.football-data.org/563.png" },
          { name: "Wolverhampton Wanderers", logo: "https://crests.football-data.org/76.png" }
        ],
        "La Liga": [
          { name: "Athletic Bilbao", logo: "https://crests.football-data.org/77.png" },
          { name: "Atletico Madrid", logo: "https://crests.football-data.org/78.png" },
          { name: "Barcelona", logo: "https://crests.football-data.org/81.png" },
          { name: "Celta Vigo", logo: "https://crests.football-data.org/80.png" },
          { name: "Deportivo Alaves", logo: "https://crests.football-data.org/263.png" },
          { name: "Espanyol", logo: "https://crests.football-data.org/89.png" },
          { name: "Getafe", logo: "https://crests.football-data.org/82.png" },
          { name: "Girona", logo: "https://crests.football-data.org/298.png" },
          { name: "Las Palmas", logo: "https://crests.football-data.org/275.png" },
          { name: "Leganes", logo: "https://crests.football-data.org/745.png" },
          { name: "Mallorca", logo: "https://crests.football-data.org/84.png" },
          { name: "Osasuna", logo: "https://crests.football-data.org/79.png" },
          { name: "Rayo Vallecano", logo: "https://crests.football-data.org/87.png" },
          { name: "Real Betis", logo: "https://crests.football-data.org/90.png" },
          { name: "Real Madrid", logo: "https://crests.football-data.org/86.png" },
          { name: "Real Sociedad", logo: "https://crests.football-data.org/92.png" },
          { name: "Sevilla", logo: "https://crests.football-data.org/95.png" },
          { name: "Valencia", logo: "https://crests.football-data.org/94.png" },
          { name: "Real Valladolid", logo: "https://crests.football-data.org/250.png" },
          { name: "Villarreal", logo: "https://crests.football-data.org/385.png" }
        ],
        "Serie A": [
          { name: "AC Milan", logo: "https://crests.football-data.org/98.png" },
          { name: "Atalanta", logo: "https://crests.football-data.org/102.png" },
          { name: "Bologna", logo: "https://crests.football-data.org/103.png" },
          { name: "Cagliari", logo: "https://crests.football-data.org/104.png" },
          { name: "Como", logo: "https://crests.football-data.org/5890.png" },
          { name: "Empoli", logo: "https://crests.football-data.org/445.png" },
          { name: "Fiorentina", logo: "https://crests.football-data.org/99.png" },
          { name: "Genoa", logo: "https://crests.football-data.org/107.png" },
          { name: "Inter Milan", logo: "https://crests.football-data.org/108.png" },
          { name: "Juventus", logo: "https://crests.football-data.org/109.png" },
          { name: "Lazio", logo: "https://crests.football-data.org/110.png" },
          { name: "Lecce", logo: "https://crests.football-data.org/112.png" },
          { name: "Monza", logo: "https://crests.football-data.org/5911.png" },
          { name: "Napoli", logo: "https://crests.football-data.org/113.png" },
          { name: "Parma", logo: "https://crests.football-data.org/114.png" },
          { name: "Roma", logo: "https://crests.football-data.org/100.png" },
          { name: "Torino", logo: "https://crests.football-data.org/586.png" },
          { name: "Udinese", logo: "https://crests.football-data.org/115.png" },
          { name: "Venezia", logo: "https://crests.football-data.org/5882.png" },
          { name: "Verona", logo: "https://crests.football-data.org/450.png" }
        ],
        "Bundesliga": [
          { name: "Augsburg", logo: "https://crests.football-data.org/16.png" },
          { name: "Bayer Leverkusen", logo: "https://crests.football-data.org/3.png" },
          { name: "Bayern Munich", logo: "https://crests.football-data.org/5.png" },
          { name: "Bochum", logo: "https://crests.football-data.org/36.png" },
          { name: "Borussia Dortmund", logo: "https://crests.football-data.org/4.png" },
          { name: "Borussia Monchengladbach", logo: "https://crests.football-data.org/18.png" },
          { name: "Eintracht Frankfurt", logo: "https://crests.football-data.org/19.png" },
          { name: "Freiburg", logo: "https://crests.football-data.org/17.png" },
          { name: "Heidenheim", logo: "https://crests.football-data.org/44.png" },
          { name: "Hoffenheim", logo: "https://crests.football-data.org/2.png" },
          { name: "Holstein Kiel", logo: "https://crests.football-data.org/34.png" },
          { name: "Mainz 05", logo: "https://crests.football-data.org/15.png" },
          { name: "RB Leipzig", logo: "https://crests.football-data.org/506.png" },
          { name: "St. Pauli", logo: "https://crests.football-data.org/13.png" },
          { name: "Stuttgart", logo: "https://crests.football-data.org/10.png" },
          { name: "Union Berlin", logo: "https://crests.football-data.org/28.png" },
          { name: "Werder Bremen", logo: "https://crests.football-data.org/12.png" },
          { name: "Wolfsburg", logo: "https://crests.football-data.org/11.png" }
        ],
        "Ligue 1": [
          { name: "Angers", logo: "https://crests.football-data.org/532.png" },
          { name: "Auxerre", logo: "https://crests.football-data.org/519.png" },
          { name: "Brest", logo: "https://crests.football-data.org/512.png" },
          { name: "Le Havre", logo: "https://crests.football-data.org/533.png" },
          { name: "Lens", logo: "https://crests.football-data.org/546.png" },
          { name: "Lille", logo: "https://crests.football-data.org/521.png" },
          { name: "Lyon", logo: "https://crests.football-data.org/523.png" },
          { name: "Marseille", logo: "https://crests.football-data.org/516.png" },
          { name: "Monaco", logo: "https://crests.football-data.org/548.png" },
          { name: "Montpellier", logo: "https://crests.football-data.org/512.png" },
          { name: "Nantes", logo: "https://crests.football-data.org/543.png" },
          { name: "Nice", logo: "https://crests.football-data.org/522.png" },
          { name: "PSG", logo: "https://crests.football-data.org/524.png" },
          { name: "Reims", logo: "https://crests.football-data.org/547.png" },
          { name: "Rennes", logo: "https://crests.football-data.org/529.png" },
          { name: "Saint-Etienne", logo: "https://crests.football-data.org/527.png" },
          { name: "Strasbourg", logo: "https://crests.football-data.org/518.png" },
          { name: "Toulouse", logo: "https://crests.football-data.org/511.png" }
        ],
        "Eredivisie": [
          { name: "Ajax", logo: "https://crests.football-data.org/678.png" },
          { name: "Almere City", logo: "https://crests.football-data.org/1914.png" },
          { name: "AZ Alkmaar", logo: "https://crests.football-data.org/673.png" },
          { name: "Feyenoord", logo: "https://crests.football-data.org/675.png" },
          { name: "Fortuna Sittard", logo: "https://crests.football-data.org/679.png" },
          { name: "Go Ahead Eagles", logo: "https://crests.football-data.org/682.png" },
          { name: "Groningen", logo: "https://crests.football-data.org/677.png" },
          { name: "Heerenveen", logo: "https://crests.football-data.org/668.png" },
          { name: "Heracles Almelo", logo: "https://crests.football-data.org/659.png" },
          { name: "NAC Breda", logo: "https://crests.football-data.org/662.png" },
          { name: "NEC Nijmegen", logo: "https://crests.football-data.org/671.png" },
          { name: "PEC Zwolle", logo: "https://crests.football-data.org/684.png" },
          { name: "PSV Eindhoven", logo: "https://crests.football-data.org/674.png" },
          { name: "RKC Waalwijk", logo: "https://crests.football-data.org/683.png" },
          { name: "Sparta Rotterdam", logo: "https://crests.football-data.org/680.png" },
          { name: "Twente", logo: "https://crests.football-data.org/666.png" },
          { name: "Utrecht", logo: "https://crests.football-data.org/676.png" },
          { name: "Willem II", logo: "https://crests.football-data.org/672.png" }
        ],
        "Primeira Liga": [
          { name: "AVS Futebol SAD", logo: "https://crests.football-data.org/5873.png" },
          { name: "Benfica", logo: "https://crests.football-data.org/1903.png" },
          { name: "Boavista", logo: "https://crests.football-data.org/501.png" },
          { name: "Braga", logo: "https://crests.football-data.org/502.png" },
          { name: "Casa Pia", logo: "https://crests.football-data.org/5871.png" },
          { name: "Estoril Praia", logo: "https://crests.football-data.org/5868.png" },
          { name: "Estrela da Amadora", logo: "https://crests.football-data.org/5872.png" },
          { name: "Famalicao", logo: "https://crests.football-data.org/5867.png" },
          { name: "Farense", logo: "https://crests.football-data.org/2987.png" },
          { name: "Gil Vicente", logo: "https://crests.football-data.org/504.png" },
          { name: "Moreirense", logo: "https://crests.football-data.org/5865.png" },
          { name: "Nacional", logo: "https://crests.football-data.org/512.png" },
          { name: "Porto", logo: "https://crests.football-data.org/503.png" },
          { name: "Rio Ave", logo: "https://crests.football-data.org/496.png" },
          { name: "Santa Clara", logo: "https://crests.football-data.org/506.png" },
          { name: "Sporting CP", logo: "https://crests.football-data.org/498.png" },
          { name: "Vitoria Guimaraes", logo: "https://crests.football-data.org/507.png" }
        ],
        "Süper Lig": [
          { name: "Adana Demirspor", logo: "https://crests.football-data.org/616.png" },
          { name: "Alanyaspor", logo: "https://crests.football-data.org/619.png" },
          { name: "Antalyaspor", logo: "https://crests.football-data.org/620.png" },
          { name: "Besiktas", logo: "https://crests.football-data.org/613.png" },
          { name: "Bodrum", logo: "https://upload.wikimedia.org/wikipedia/en/2/23/Bodrum_FK_logo.png" },
          { name: "Eyupspor", logo: "https://upload.wikimedia.org/wikipedia/en/e/ec/Ey%C3%BCpspor_logo.png" },
          { name: "Fenerbahce", logo: "https://crests.football-data.org/611.png" },
          { name: "Galatasaray", logo: "https://crests.football-data.org/610.png" },
          { name: "Gaziantep", logo: "https://crests.football-data.org/622.png" },
          { name: "Goztepe", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/G%C3%B6ztepe_logo.png" },
          { name: "Hatayspor", logo: "https://crests.football-data.org/624.png" },
          { name: "Istanbul Basaksehir", logo: "https://crests.football-data.org/615.png" },
          { name: "Kasimpasa", logo: "https://crests.football-data.org/617.png" },
          { name: "Konyaspor", logo: "https://crests.football-data.org/623.png" },
          { name: "Rizespor", logo: "https://crests.football-data.org/621.png" },
          { name: "Samsunspor", logo: "https://crests.football-data.org/625.png" },
          { name: "Sivasspor", logo: "https://crests.football-data.org/618.png" },
          { name: "Trabzonspor", logo: "https://crests.football-data.org/614.png" }
        ],
        "Belgian Pro League": [
          { name: "Anderlecht", logo: "https://crests.football-data.org/553.png" },
          { name: "Antwerp", logo: "https://crests.football-data.org/563.png" },
          { name: "Beerschot", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/K.Beerschot.V.A._logo.svg/200px-K.Beerschot.V.A._logo.svg.png" },
          { name: "Cercle Brugge", logo: "https://crests.football-data.org/566.png" },
          { name: "Charleroi", logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Sporting_Charleroi_logo.png" },
          { name: "Club Brugge", logo: "https://crests.football-data.org/547.png" },
          { name: "Dender", logo: "https://upload.wikimedia.org/wikipedia/en/b/b3/FCVDenderEH.png" },
          { name: "Genk", logo: "https://crests.football-data.org/561.png" },
          { name: "Gent", logo: "https://crests.football-data.org/562.png" },
          { name: "Kortrijk", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/KV_Kortrijk_logo.png" },
          { name: "Leuven", logo: "https://upload.wikimedia.org/wikipedia/en/a/ad/OH_Leuven.png" },
          { name: "Mechelen", logo: "https://upload.wikimedia.org/wikipedia/en/d/db/KV_Mechelen_Logo.png" },
          { name: "Sint-Truiden", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Sint-Truidense_V.V._logo.svg/200px-Sint-Truidense_V.V._logo.svg.png" },
          { name: "Standard Liege", logo: "https://crests.football-data.org/565.png" },
          { name: "Union SG", logo: "https://crests.football-data.org/564.png" },
          { name: "Westerlo", logo: "https://upload.wikimedia.org/wikipedia/en/7/79/KVC_Westerlo_logo.png" }
        ],
        "Scottish Premiership": [
          { name: "Aberdeen", logo: "https://crests.football-data.org/399.png" },
          { name: "Celtic", logo: "https://crests.football-data.org/397.png" },
          { name: "Dundee FC", logo: "https://upload.wikimedia.org/wikipedia/en/9/9c/Dundee_FC_logo.png" },
          { name: "Dundee United", logo: "https://upload.wikimedia.org/wikipedia/en/f/f6/Dundee_United_F.C._logo.png" },
          { name: "Hearts", logo: "https://crests.football-data.org/398.png" },
          { name: "Hibernian", logo: "https://crests.football-data.org/403.png" },
          { name: "Kilmarnock", logo: "https://crests.football-data.org/400.png" },
          { name: "Motherwell", logo: "https://crests.football-data.org/402.png" },
          { name: "Rangers", logo: "https://crests.football-data.org/396.png" },
          { name: "Ross County", logo: "https://upload.wikimedia.org/wikipedia/en/e/ee/Ross_County_F.C._logo.png" },
          { name: "St. Johnstone", logo: "https://upload.wikimedia.org/wikipedia/en/2/2d/St_Johnstone_F.C._logo.png" },
          { name: "St. Mirren", logo: "https://crests.football-data.org/401.png" }
        ],
        "MLS": [
          { name: "Atlanta United", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Atlanta_United_FC_logo.svg/200px-Atlanta_United_FC_logo.svg.png" },
          { name: "Austin FC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Austin_FC_logo.svg/200px-Austin_FC_logo.svg.png" },
          { name: "Charlotte FC", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/Charlotte_FC_logo.svg/200px-Charlotte_FC_logo.svg.png" },
          { name: "Chicago Fire", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Chicago_Fire_FC_logo_2021.svg/200px-Chicago_Fire_FC_logo_2021.svg.png" },
          { name: "Colorado Rapids", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b2/Colorado_Rapids_logo.svg/200px-Colorado_Rapids_logo.svg.png" },
          { name: "Columbus Crew", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Columbus_Crew_logo_2021.svg/200px-Columbus_Crew_logo_2021.svg.png" },
          { name: "DC United", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/D.C._United_logo_%282016%29.svg/200px-D.C._United_logo_%282016%29.svg.png" },
          { name: "FC Cincinnati", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/FC_Cincinnati_logo.svg/200px-FC_Cincinnati_logo.svg.png" },
          { name: "FC Dallas", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/FC_Dallas_logo.svg/200px-FC_Dallas_logo.svg.png" },
          { name: "Houston Dynamo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Houston_Dynamo_FC_logo.svg/200px-Houston_Dynamo_FC_logo.svg.png" },
          { name: "Inter Miami", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/Inter_Miami_CF_logo.svg/200px-Inter_Miami_CF_logo.svg.png" },
          { name: "LA Galaxy", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Los_Angeles_Galaxy_logo.svg/200px-Los_Angeles_Galaxy_logo.svg.png" },
          { name: "LAFC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Los_Angeles_FC_logo.svg/200px-Los_Angeles_FC_logo.svg.png" },
          { name: "Minnesota United", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Minnesota_United_FC_logo.svg/200px-Minnesota_United_FC_logo.svg.png" },
          { name: "CF Montreal", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/CF_Montr%C3%A9al_logo.svg/200px-CF_Montr%C3%A9al_logo.svg.png" },
          { name: "Nashville SC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Nashville_SC_logo.svg/200px-Nashville_SC_logo.svg.png" },
          { name: "New England Revolution", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/New_England_Revolution_logo_2021.svg/200px-New_England_Revolution_logo_2021.svg.png" },
          { name: "New York Red Bulls", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/69/New_York_Red_Bulls_logo.svg/200px-New_York_Red_Bulls_logo.svg.png" },
          { name: "NYCFC", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/New_York_City_FC_logo.svg/200px-New_York_City_FC_logo.svg.png" },
          { name: "Orlando City", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Orlando_City_2014.svg/200px-Orlando_City_2014.svg.png" },
          { name: "Philadelphia Union", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Philadelphia_Union_logo.svg/200px-Philadelphia_Union_logo.svg.png" },
          { name: "Portland Timbers", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Portland_Timbers_logo.svg/200px-Portland_Timbers_logo.svg.png" },
          { name: "Real Salt Lake", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/Real_Salt_Lake_logo_%282010%29.svg/200px-Real_Salt_Lake_logo_%282010%29.svg.png" },
          { name: "San Jose Earthquakes", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/San_Jose_Earthquakes_logo_%282014%29.svg/200px-San_Jose_Earthquakes_logo_%282014%29.svg.png" },
          { name: "Seattle Sounders", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Seattle_Sounders_FC_logo_%282023%29.svg/200px-Seattle_Sounders_FC_logo_%282023%29.svg.png" },
          { name: "Sporting KC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sporting_Kansas_City_logo.svg/200px-Sporting_Kansas_City_logo.svg.png" },
          { name: "St. Louis City SC", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/St._Louis_City_SC_logo.svg/200px-St._Louis_City_SC_logo.svg.png" },
          { name: "Toronto FC", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/Toronto_FC_logo.svg/200px-Toronto_FC_logo.svg.png" },
          { name: "Vancouver Whitecaps", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Vancouver_Whitecaps_FC_logo_%282024%29.svg/200px-Vancouver_Whitecaps_FC_logo_%282024%29.svg.png" }
        ],
        "Saudi Pro League": [
          { name: "Al Ahli", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Al-Ahli_Saudi_FC_logo.svg/200px-Al-Ahli_Saudi_FC_logo.svg.png" },
          { name: "Al Ettifaq", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Al-Ettifaq_FC_logo.svg/200px-Al-Ettifaq_FC_logo.svg.png" },
          { name: "Al Fateh", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Al-Fateh_logo.svg/200px-Al-Fateh_logo.svg.png" },
          { name: "Al Fayha", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/Al-Fayha_FC_logo.svg/200px-Al-Fayha_FC_logo.svg.png" },
          { name: "Al Hilal", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Al_Hilal_logo_%282022%29.svg/200px-Al_Hilal_logo_%282022%29.svg.png" },
          { name: "Al Ittihad", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Al_Ittihad_Club_logo_%28Saudi_Arabia%29.svg/200px-Al_Ittihad_Club_logo_%28Saudi_Arabia%29.svg.png" },
          { name: "Al Kholood", logo: "https://upload.wikimedia.org/wikipedia/en/e/ec/Al-Kholood_Club_logo.png" },
          { name: "Al Khaleej", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Al-Khaleej_Club_logo.svg/200px-Al-Khaleej_Club_logo.svg.png" },
          { name: "Al Nassr", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Al-Nassr_FC_logo.svg/200px-Al-Nassr_FC_logo.svg.png" },
          { name: "Al Okhdood", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Al-Okhdood_logo.png" },
          { name: "Al Oroobah", logo: "https://upload.wikimedia.org/wikipedia/en/b/b1/Al-Oruba_Club_logo.png" },
          { name: "Al Qadsiah", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Al-Qadsiah_FC_logo.svg/200px-Al-Qadsiah_FC_logo.svg.png" },
          { name: "Al Raed", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Al-Raed_FC_logo.svg/200px-Al-Raed_FC_logo.svg.png" },
          { name: "Al Riyadh", logo: "https://upload.wikimedia.org/wikipedia/en/0/0a/Al_Riyadh_SC_logo.png" },
          { name: "Al Shabab", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png" },
          { name: "Al Taawoun", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Al-Taawoun_FC_logo.svg/200px-Al-Taawoun_FC_logo.svg.png" },
          { name: "Al Wahda", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Al_Wehda_FC_logo.svg/200px-Al_Wehda_FC_logo.svg.png" },
          { name: "Damac", logo: "https://upload.wikimedia.org/wikipedia/en/d/de/Damac_FC_logo.png" }
        ]
      };
      let currentFavClubLeague = "";

      const PROFILE_COUNTRY_EXTRAS = [
        { name: 'Pakistan', code: 'pk' },
        { name: 'India', code: 'in' },
        { name: 'Bangladesh', code: 'bd' },
        { name: 'United Kingdom', code: 'gb' },
        { name: 'Ireland', code: 'ie' },
        { name: 'United Arab Emirates', code: 'ae' },
        { name: 'Malaysia', code: 'my' },
        { name: 'Indonesia', code: 'id' },
        { name: 'Philippines', code: 'ph' },
        { name: 'Singapore', code: 'sg' },
      ];

      let profileCountriesCache = null;
      function getProfileCountriesList() {
        if (profileCountriesCache) return profileCountriesCache;
        const seen = new Set();
        const list = [];
        const add = (name, code) => {
          const key = `${name}|${code}`;
          if (!name || !code || seen.has(key)) return;
          seen.add(key);
          list.push({ name, code });
        };
        if (typeof COUNTRY_CODES !== 'undefined') {
          Object.entries(COUNTRY_CODES).forEach(([name, code]) => add(name, code));
        }
        WORLD_CUP_TEAMS.forEach(t => add(t.name, t.code));
        PROFILE_COUNTRY_EXTRAS.forEach(c => add(c.name, c.code));
        profileCountriesCache = list.sort((a, b) => a.name.localeCompare(b.name));
        return profileCountriesCache;
      }

      function applyProfilePreferences(prefs, userObj = state.user) {
        if (!userObj || !prefs || typeof prefs !== 'object') return;
        userObj.profilePreferences = { ...(userObj.profilePreferences || {}), ...prefs };
        if (prefs.country) {
          userObj.country = prefs.country.name;
          userObj.countryCode = prefs.country.code;
          userObj.countryFlag = prefs.country.flag || `https://flagcdn.com/w80/${prefs.country.code}.png`;
        }
        if (prefs.favClub) {
          userObj.favClub = prefs.favClub.name;
          userObj.favClubLogo = prefs.favClub.logo;
        }
        if (prefs.favWc) {
          userObj.favWc = prefs.favWc.name;
          userObj.favWcLogo = prefs.favWc.flag || (prefs.favWc.code ? `https://flagcdn.com/w80/${prefs.favWc.code}.png` : '');
        }
        persistUserCache(userObj);
      }

      function saveProfilePreferences(partial) {
        if (!state.user) return;
        const merged = { ...(state.user.profilePreferences || {}), ...partial };
        applyProfilePreferences(merged);
        updateAuthUI();
        apiRequest('/api/users/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences: merged }),
        }).then((updated) => {
          if (updated && updated.preferences) applyProfilePreferences(updated.preferences);
        }).catch((err) => {
          console.error('Profile preferences sync failed:', err);
        });
      }

      function openFavCountryModal() {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        const modalContainer = overlay.querySelector('.modal');
        if (modalContainer) modalContainer.style.maxWidth = '580px';
        content.innerHTML = `
        <h2 class="modal-title" style="margin-bottom:0.5rem;font-family:var(--font-ui);font-weight:700">Select Your Country</h2>
        <div style="margin-bottom:1.25rem">
          <input type="text" id="fav-country-search" placeholder="Search countries..." oninput="filterFavCountry()" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid var(--border2);background:var(--surface);color:var(--text);font-family:var(--font-ui);outline:none"/>
        </div>
        <div id="fav-country-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));gap:0.75rem;max-height:350px;overflow-y:auto;padding-right:0.25rem"></div>
      `;
        overlay.classList.add('show');
        renderFavCountryGrid();
      }

      function renderFavCountryGrid() {
        const grid = document.getElementById('fav-country-grid');
        const searchInput = document.getElementById('fav-country-search');
        const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (!grid) return;
        let countries = getProfileCountriesList();
        if (searchVal) countries = countries.filter(c => c.name.toLowerCase().includes(searchVal));
        if (countries.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">No countries found</div>`;
          return;
        }
        grid.innerHTML = countries.map(c => {
          const flagUrl = `https://flagcdn.com/w80/${c.code}.png`;
          return `
          <div class="fav-club-card" onclick="selectFavCountry('${c.name.replace(/'/g, "\\'")}', '${c.code}')" style="display:flex;flex-direction:column;align-items:center;padding:0.75rem;background:var(--surface2);border-radius:6px;cursor:pointer;border:1px solid transparent;transition:all 0.2s ease;text-align:center" onmouseover="this.style.borderColor='var(--border2)';this.style.background='var(--surface3)'" onmouseout="this.style.borderColor='transparent';this.style.background='var(--surface2)'">
            <img src="${flagUrl}" style="height:32px;width:48px;object-fit:cover;border-radius:3px;margin-bottom:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.3)"/>
            <div style="font-size:0.8rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%">${c.name}</div>
          </div>
        `;
        }).join('');
      }

      function filterFavCountry() {
        renderFavCountryGrid();
      }

      function selectFavCountry(name, code) {
        const flagUrl = `https://flagcdn.com/w80/${code}.png`;
        if (state.user) {
          saveProfilePreferences({ country: { name, code, flag: flagUrl } });
        } else {
          state.guestCountry = name;
          state.guestCountryCode = code;
          state.guestCountryFlag = flagUrl;
          localStorage.setItem('footytrivia_guest_country', name);
          localStorage.setItem('footytrivia_guest_country_code', code);
          localStorage.setItem('footytrivia_guest_country_flag', flagUrl);
          updateAuthUI();
        }
        closeModal();
        showToast(`Country set to ${name}!`, 'success');
      }

      function openFavClubModal() {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        const modalContainer = overlay.querySelector('.modal');
        if (modalContainer) {
          modalContainer.style.maxWidth = '580px';
        }
        let leaguesHtml = Object.keys(ALL_CLUBS).map((league, idx) => `
        <button class="tab-btn ${idx === 0 ? 'active' : ''}" onclick="switchFavClubLeague('${league.replace(/'/g, "\\'")}', this)" style="padding:0.4rem 0.8rem;font-size:0.8rem;border-radius:4px;border:1px solid var(--border2);background:transparent;color:var(--text);margin-right:0.25rem;margin-bottom:0.25rem;cursor:pointer;font-family:var(--font-ui)">
          ${league}
        </button>
      `).join('');
        content.innerHTML = `
        <h2 class="modal-title" style="margin-bottom:0.5rem;font-family:var(--font-ui);font-weight:700">Select Favourite Club</h2>
        <div style="margin-bottom:1rem">
          <input type="text" id="fav-club-search" placeholder="Search clubs..." oninput="filterFavClubs()" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid var(--border2);background:var(--surface);color:var(--text);font-family:var(--font-ui);outline:none"/>
        </div>
        <div class="league-tabs" style="display:flex;flex-wrap:wrap;margin-bottom:1rem;padding-bottom:0.25rem">
          ${leaguesHtml}
        </div>
        <div id="fav-clubs-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));gap:0.75rem;max-height:300px;overflow-y:auto;padding-right:0.25rem;margin-top:0.5rem">
          <!-- Clubs populated dynamically -->
        </div>
      `;
        overlay.classList.add('show');
        const firstTabBtn = document.querySelector('.league-tabs .tab-btn');
        switchFavClubLeague(Object.keys(ALL_CLUBS)[0], firstTabBtn);
      }
      function switchFavClubLeague(league, btn) {
        currentFavClubLeague = league;
        if (btn) {
          document.querySelectorAll('.league-tabs .tab-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.borderColor = 'var(--border2)';
            b.style.color = 'var(--text)';
          });
          btn.classList.add('active');
          btn.style.background = 'rgba(212, 160, 23, 0.15)';
          btn.style.borderColor = '#d4a017';
          btn.style.color = '#d4a017';
        }
        renderFavClubsGrid();
      }
      function renderFavClubsGrid() {
        const grid = document.getElementById('fav-clubs-grid');
        const searchInput = document.getElementById('fav-club-search');
        const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (!grid) return;
        let clubs = [];
        if (currentFavClubLeague && !searchVal) {
          clubs = ALL_CLUBS[currentFavClubLeague] || [];
        } else {
          Object.values(ALL_CLUBS).forEach(list => clubs.push(...list));
        }
        if (searchVal) {
          clubs = clubs.filter(c => c.name.toLowerCase().includes(searchVal));
        }
        const uniqueClubs = [];
        const seen = new Set();
        clubs.forEach(c => {
          if (!seen.has(c.name)) {
            seen.add(c.name);
            uniqueClubs.push(c);
          }
        });
        if (uniqueClubs.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">No clubs found</div>`;
          return;
        }
        grid.innerHTML = uniqueClubs.map(c => `
        <div class="fav-club-card" onclick="selectFavClub('${c.name.replace(/'/g, "\\'")}', '${c.logo}')" style="display:flex;flex-direction:column;align-items:center;padding:0.75rem;background:var(--surface2);border-radius:6px;cursor:pointer;border:1px solid transparent;transition:all 0.2s ease;text-align:center" onmouseover="this.style.borderColor='var(--border2)';this.style.background='var(--surface3)'" onmouseout="this.style.borderColor='transparent';this.style.background='var(--surface2)'">
          <img src="${c.logo}" style="height:40px;width:40px;object-fit:contain;margin-bottom:0.5rem" onerror="this.src='https://crests.football-data.org/PL.png'"/>
          <div style="font-size:0.8rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%">${c.name}</div>
        </div>
      `).join('');
      }
      function filterFavClubs() {
        renderFavClubsGrid();
      }
      function selectFavClub(name, logo) {
        if (state.user) {
          saveProfilePreferences({ favClub: { name, logo } });
        } else {
          state.guestFavClub = name;
          state.guestFavClubLogo = logo;
          localStorage.setItem('footytrivia_guest_fav_club', name);
          localStorage.setItem('footytrivia_guest_fav_club_logo', logo);
        }
        updateAuthUI();
        closeModal();
        showToast(`Favourite club set to ${name}!`, 'success');
      }
      // ──────────────────────────  FAVORITE WORLD CUP TEAM DATA & ACTIONS ──────────────────────────
      const WORLD_CUP_TEAMS = [
        { name: "Argentina", code: "ar" },
        { name: "France", code: "fr" },
        { name: "Brazil", code: "br" },
        { name: "England", code: "gb-eng" },
        { name: "Belgium", code: "be" },
        { name: "Portugal", code: "pt" },
        { name: "Netherlands", code: "nl" },
        { name: "Spain", code: "es" },
        { name: "Italy", code: "it" },
        { name: "Croatia", code: "hr" },
        { name: "USA", code: "us" },
        { name: "Mexico", code: "mx" },
        { name: "Morocco", code: "ma" },
        { name: "Colombia", code: "co" },
        { name: "Uruguay", code: "uy" },
        { name: "Germany", code: "de" },
        { name: "Senegal", code: "sn" },
        { name: "Japan", code: "jp" },
        { name: "Switzerland", code: "ch" },
        { name: "Denmark", code: "dk" },
        { name: "South Korea", code: "kr" },
        { name: "Australia", code: "au" },
        { name: "Ukraine", code: "ua" },
        { name: "Sweden", code: "se" },
        { name: "Poland", code: "pl" },
        { name: "Wales", code: "gb-wls" },
        { name: "Scotland", code: "gb-sct" },
        { name: "Canada", code: "ca" },
        { name: "Austria", code: "at" },
        { name: "Hungary", code: "hu" },
        { name: "Turkey", code: "tr" },
        { name: "Ecuador", code: "ec" },
        { name: "Peru", code: "pe" },
        { name: "Chile", code: "cl" },
        { name: "Nigeria", code: "ng" },
        { name: "Egypt", code: "eg" },
        { name: "Cameroon", code: "cm" },
        { name: "Ivory Coast", code: "ci" },
        { name: "Ghana", code: "gh" },
        { name: "Algeria", code: "dz" },
        { name: "Saudi Arabia", code: "sa" },
        { name: "Iran", code: "ir" },
        { name: "Qatar", code: "qa" },
        { name: "Tunisia", code: "tn" },
        { name: "Costa Rica", code: "cr" },
        { name: "Jamaica", code: "jm" },
        { name: "Panama", code: "pa" },
        { name: "New Zealand", code: "nz" }
      ];
      function openFavWcModal() {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        const modalContainer = overlay.querySelector('.modal');
        if (modalContainer) {
          modalContainer.style.maxWidth = '580px';
        }
        content.innerHTML = `
        <h2 class="modal-title" style="margin-bottom:0.5rem;font-family:var(--font-ui);font-weight:700">Select Favorite World Cup Team</h2>
        <div style="margin-bottom:1.25rem">
          <input type="text" id="fav-wc-search" placeholder="Search teams..." oninput="filterFavWc()" style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid var(--border2);background:var(--surface);color:var(--text);font-family:var(--font-ui);outline:none"/>
        </div>
        <div id="fav-wc-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));gap:0.75rem;max-height:350px;overflow-y:auto;padding-right:0.25rem">
          <!-- WC Teams populated dynamically -->
        </div>
      `;
        overlay.classList.add('show');
        renderFavWcGrid();
      }
      function renderFavWcGrid() {
        const grid = document.getElementById('fav-wc-grid');
        const searchInput = document.getElementById('fav-wc-search');
        const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
        if (!grid) return;
        let teams = WORLD_CUP_TEAMS;
        if (searchVal) {
          teams = teams.filter(t => t.name.toLowerCase().includes(searchVal));
        }
        if (teams.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text3);font-size:0.9rem">No countries found</div>`;
          return;
        }
        grid.innerHTML = teams.map(t => {
          const flagUrl = `https://flagcdn.com/w80/${t.code}.png`;
          return `
          <div class="fav-club-card" onclick="selectFavWc('${t.name.replace(/'/g, "\\'")}', '${t.code}')" style="display:flex;flex-direction:column;align-items:center;padding:0.75rem;background:var(--surface2);border-radius:6px;cursor:pointer;border:1px solid transparent;transition:all 0.2s ease;text-align:center" onmouseover="this.style.borderColor='var(--border2)';this.style.background='var(--surface3)'" onmouseout="this.style.borderColor='transparent';this.style.background='var(--surface2)'">
            <img src="${flagUrl}" style="height:32px;width:48px;object-fit:cover;border-radius:3px;margin-bottom:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.3)"/>
            <div style="font-size:0.8rem;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%">${t.name}</div>
          </div>
        `;
        }).join('');
      }
      function filterFavWc() {
        renderFavWcGrid();
      }
      function selectFavWc(name, code) {
        const flagUrl = `https://flagcdn.com/w80/${code}.png`;
        if (state.user) {
          saveProfilePreferences({ favWc: { name, code, flag: flagUrl } });
        } else {
          state.guestFavWc = name;
          state.guestFavWcLogo = flagUrl;
          localStorage.setItem('footytrivia_guest_fav_wc', name);
          localStorage.setItem('footytrivia_guest_fav_wc_logo', flagUrl);
        }
        updateAuthUI();
        closeModal();
        showToast(`Favorite World Cup team set to ${name}!`, 'success');
      }
      // ──────────────────────────  AUTHENTICATION & MODALS ──────────────────────────
      function authErrorMessage(detail, fallback) {
        if (!detail) return fallback;
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) {
          return detail.map((d) => d.msg || d.message || String(d)).filter(Boolean).join('. ') || fallback;
        }
        if (typeof detail === 'object' && detail.message) return String(detail.message);
        return fallback;
      }

      function isVerificationRequiredError(message) {
        const text = String(message || '').toLowerCase();
        return text.includes('verify your email') || text.includes('email address is not verified');
      }

      async function clearAuthClientState() {
        try {
          await fetchWithTimeout(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          }, 10000);
        } catch (e) {
          /* ignore */
        }
        forceLogout(null, false);
      }

      async function readApiErrorMessage(res, fallback) {
        try {
          const data = await res.json();
          return authErrorMessage(data?.detail, fallback);
        } catch (e) {
          if (res.status >= 500) return 'Server error — please try again in a moment.';
          if (res.status === 409) return 'That email or username is already in use.';
          if (res.status === 400 || res.status === 422) return fallback;
          return `${fallback} (error ${res.status || 'unknown'})`;
        }
      }

      function authFieldForError(message) {
        const text = String(message || '').toLowerCase();
        if (text.includes('email')) return 'auth-email';
        if (text.includes('username')) return 'auth-username';
        if (text.includes('password')) return 'auth-password';
        return null;
      }

      function setAuthFormError(message, fieldId = null) {
        const el = document.getElementById('auth-form-error');
        if (el) {
          el.textContent = message || '';
          el.classList.toggle('hidden', !message);
        }
        if (message) setAuthFormStatus('');
        document.querySelectorAll('#modal-content .form-input.auth-field-error').forEach((input) => {
          input.classList.remove('auth-field-error');
        });
        if (fieldId) {
          const input = document.getElementById(fieldId);
          if (input) input.classList.add('auth-field-error');
        }
        if (message && el) {
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }

      function setAuthFormStatus(message) {
        const el = document.getElementById('auth-form-status');
        if (el) {
          el.textContent = message || '';
          el.classList.toggle('hidden', !message);
        }
      }

      async function postRegisterRequest(username, email, password) {
        return fetchWithTimeout(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include',
        }, 35000);
      }

      function persistUserCache(user) {
        if (!user) return;
        const copy = { ...user };
        delete copy.email;
        localStorage.setItem('footytrivia_user', JSON.stringify(copy));
      }

      function buildUserFromApi(profile, progress, email, rank = null) {
        const totalPoints = progress.total_points || 0;
        return {
          id: profile.user_id,
          username: profile.display_name || (email ? email.split('@')[0] : 'Player'),
          level: Math.floor(totalPoints / 1000) + 1,
          xp: totalPoints % 1000,
          totalPoints,
          gamesPlayed: profile.total_quizzes_played || 0,
          correctAnswers: progress.total_correct || 0,
          bestStreak: progress.longest_streak || 0,
          accuracy: progress.total_questions_answered > 0
            ? Math.round((progress.total_correct / progress.total_questions_answered) * 100)
            : 0,
          totalQuestions: progress.total_questions_answered || 0,
          globalRank: rank,
        };
      }

      function renderProfileStats(user) {
        const stats = user || { gamesPlayed: 0, totalPoints: 0, accuracy: 0, bestStreak: 0, globalRank: null };
        const gamesEl = document.getElementById('prof-stat-games');
        const pointsEl = document.getElementById('prof-stat-points');
        const accEl = document.getElementById('prof-stat-accuracy');
        const streakEl = document.getElementById('prof-stat-streak');
        const rankEl = document.getElementById('prof-stat-rank');
        if (gamesEl) gamesEl.textContent = String(stats.gamesPlayed ?? 0);
        if (pointsEl) pointsEl.textContent = (stats.totalPoints ?? 0).toLocaleString();
        if (accEl) accEl.textContent = `${stats.accuracy ?? 0}%`;
        if (streakEl) streakEl.textContent = String(stats.bestStreak ?? 0);
        if (rankEl) {
          rankEl.textContent = stats.globalRank ? `#${stats.globalRank}` : '#--';
        }
      }

      async function refreshProfileStats() {
        if (!state.user) return;
        try {
          const [profile, progress, ranked] = await Promise.all([
            apiRequest('/api/users/me'),
            apiRequest('/api/users/me/progress'),
            apiRequest('/api/leaderboard/ranked?period=all_time').catch(() => null),
          ]);
          let rank = null;
          if (ranked?.current_user?.rank) {
            rank = ranked.current_user.rank;
          } else if (ranked?.entries?.length) {
            const me = ranked.entries.find(e => e.user_id === state.user.id);
            if (me?.rank) rank = me.rank;
          }
          const stored = JSON.parse(localStorage.getItem('footytrivia_user') || '{}');
          const userObj = buildUserFromApi(profile, progress, stored.email || '', rank);
          state.user = { ...state.user, ...userObj };
          persistUserCache(state.user);
          renderProfileStats(state.user);
          const xpFillEl = document.querySelector('.profile-xp-fill');
          const xpLabelEl = document.querySelector('.profile-xp-label');
          const profileRankEl = document.querySelector('.profile-rank');
          if (xpFillEl) xpFillEl.style.width = `${(userObj.xp / 1000) * 100}%`;
          if (xpLabelEl) xpLabelEl.textContent = `${userObj.xp} / 1000 XP to next level`;
          if (profileRankEl) {
            const ranks = ['Rookie - Silver I', 'Amateur - Silver II', 'Pro - Gold I', 'Elite - Gold II', 'World Class - Diamond I', 'Legendary - Champion'];
            const rankIdx = Math.min(ranks.length - 1, Math.floor((userObj.level || 0) / 2));
            profileRankEl.textContent = (ranks[rankIdx] || ranks[0]).toUpperCase();
          }
        } catch (err) {
          console.warn('Failed to refresh profile stats:', err);
          renderProfileStats(state.user);
        }
      }

      async function finishAuthSession(email) {
        localStorage.removeItem('footytrivia_token');
        localStorage.removeItem('footytrivia_refresh_token');
        clearCsrfTokenCache();

        const [, profile, progress] = await Promise.all([
          ensureCsrfToken({ forceRefresh: true }).catch(() => null),
          apiRequest('/api/users/me'),
          apiRequest('/api/users/me/progress').catch(() => ({})),
        ]);

        const userObj = buildUserFromApi(profile, progress, email);
        applyProfilePreferences(profile.preferences, userObj);
        persistUserCache(userObj);
        state.user = userObj;
        touchSessionActivity();
        setupSessionGuards();
        updateAuthUI();
        refreshProfileStats().catch(() => {});
        hydrateWcPredictionsForUser().catch(() => {});
        updatePredictorProfile();
        return state.user;
      }

      async function completeLogin(email, password) {
        await wakeApiServer();
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        let tokenRes;
        let lastLoginError;
        for (let attempt = 0; attempt <= 3; attempt++) {
          try {
            await wakeApiServer();
            tokenRes = await fetchWithTimeout(`${API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: formData,
              credentials: 'include',
            }, 35000);
            break;
          } catch (error) {
            lastLoginError = error;
            if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 4000));
          }
        }
        if (!tokenRes) {
          if (isNetworkError(lastLoginError)) throw new Error(networkErrorMessage());
          throw lastLoginError;
        }

        if (!tokenRes.ok) {
          const err = await tokenRes.json().catch(() => ({ detail: 'Invalid email or password' }));
          const message = authErrorMessage(err.detail, 'Invalid email or password');
          if (tokenRes.status === 403 && isVerificationRequiredError(message)) {
            await clearAuthClientState();
          }
          const verifyErr = new Error(message);
          verifyErr.requiresVerification = isVerificationRequiredError(message);
          throw verifyErr;
        }

        await tokenRes.json();
        return finishAuthSession(email);
      }

      async function restoreSession() {
        try {
          const [, profile, progress] = await Promise.all([
            ensureCsrfToken().catch(() => null),
            apiRequest('/api/users/me'),
            apiRequest('/api/users/me/progress').catch(() => ({})),
          ]);
          const stored = JSON.parse(localStorage.getItem('footytrivia_user') || '{}');
          const userObj = buildUserFromApi(profile, progress, stored.email || '');
          applyProfilePreferences(profile.preferences, userObj);
          if (!profile.preferences?.favClub && stored.favClub) {
            userObj.favClub = stored.favClub;
            userObj.favClubLogo = stored.favClubLogo;
          }
          if (!profile.preferences?.favWc && stored.favWc) {
            userObj.favWc = stored.favWc;
            userObj.favWcLogo = stored.favWcLogo;
          }
          if (!profile.preferences?.country && stored.country) {
            userObj.country = stored.country;
            userObj.countryCode = stored.countryCode;
            userObj.countryFlag = stored.countryFlag;
          }
          state.user = userObj;
          persistUserCache(userObj);
          touchSessionActivity();
          setupSessionGuards();
          const legacyPrefs = {};
          if (!profile.preferences?.country && userObj.country) {
            legacyPrefs.country = { name: userObj.country, code: userObj.countryCode, flag: userObj.countryFlag };
          }
          if (!profile.preferences?.favClub && userObj.favClub) {
            legacyPrefs.favClub = { name: userObj.favClub, logo: userObj.favClubLogo };
          }
          if (!profile.preferences?.favWc && userObj.favWc) {
            legacyPrefs.favWc = { name: userObj.favWc, flag: userObj.favWcLogo };
          }
          if (Object.keys(legacyPrefs).length) saveProfilePreferences(legacyPrefs);
          refreshProfileStats().catch(() => {});
          hydrateWcPredictionsForUser().catch(() => {});
          updatePredictorProfile();
        } catch (e) {
          console.warn('Session restore failed:', e);
          const msg = e && e.message ? String(e.message) : '';
          if (msg.includes('another device') || msg.includes('inactivity')) {
            forceLogout(
              msg.includes('another device') ? 'session_replaced' : 'session_inactive',
              false
            );
            showToast(msg, 'info');
          } else if (isVerificationRequiredError(msg)) {
            await clearAuthClientState();
            showToast('Please verify your email before logging in.', 'warning');
          } else {
            localStorage.removeItem('footytrivia_token');
            localStorage.removeItem('footytrivia_refresh_token');
            localStorage.removeItem('footytrivia_user');
            clearSessionActivity();
            state.user = null;
          }
        }
      }
      function openModal(type) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        if (type === 'login' || type === 'signup') {
          wakeApiServer();
        }
        if (type === 'extension') {
          const modalContainer = overlay.querySelector('.modal');
          if (modalContainer) {
            modalContainer.style.maxWidth = '550px';
          }
          content.innerHTML = `
            <h2 class="modal-title">Live Score Chrome Extension</h2>
            <div class="modal-sub" style="margin-bottom:1.5rem">Track live World Cup '26 match scores and running minutes directly from your browser toolbar.</div>
            
            <div style="text-align:center; margin-bottom:2rem">
              <a href="/footy-trivia-extension.zip" download class="btn btn-primary" style="display:inline-flex; align-items:center; gap:8px; text-decoration:none; justify-content:center; width:100%; max-width:280px; margin:0 auto; padding:12px 24px">
                <span>📥</span> Download Extension ZIP
              </a>
            </div>

            <div class="extension-instructions" style="font-size:0.88rem; line-height:1.6; color:var(--text2); display:flex; flex-direction:column; gap:12px; text-align:left; border-top:1px solid var(--border); padding-top:1.5rem">
              <h4 style="color:var(--text); font-family:var(--font-display); font-size:1rem; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:4px">How to Install in Google Chrome:</h4>
              <div style="display:flex; gap:8px"><strong style="color:var(--gold)">1.</strong> <span><strong>Extract the ZIP:</strong> Extract the downloaded <code>footy-trivia-extension.zip</code> file to a folder on your computer.</span></div>
              <div style="display:flex; gap:8px"><strong style="color:var(--gold)">2.</strong> <span><strong>Open Extensions:</strong> Open Chrome and type <code>chrome://extensions/</code> in the URL bar, or click Menu (three dots) → Extensions → Manage Extensions.</span></div>
              <div style="display:flex; gap:8px"><strong style="color:var(--gold)">3.</strong> <span><strong>Enable Developer Mode:</strong> Toggle the <strong>Developer mode</strong> switch in the top-right corner to <strong>ON</strong>.</span></div>
              <div style="display:flex; gap:8px"><strong style="color:var(--gold)">4.</strong> <span><strong>Load Unpacked:</strong> Click the <strong>Load unpacked</strong> button in the top-left, select the extracted <code>footy-trivia-extension</code> folder, and click select/open.</span></div>
              <div style="display:flex; gap:8px"><strong style="color:var(--gold)">5.</strong> <span><strong>Pin for Quick Access:</strong> Click the Puzzle piece icon next to your Chrome profile picture and click the pin icon next to <strong>Footy-Trivia Live Score</strong>.</span></div>
            </div>
          `;
        } else if (type === 'login') {
          content.innerHTML = `
          <h2 class="modal-title">Welcome Back</h2>
          <div class="modal-sub">Log in to track your scores and compete globally.</div>
          <form onsubmit="mockLogin(event)">
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required maxlength="${INPUT_LIMITS.email}" placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              ${authPasswordField('auth-password', '••••••••', 'minlength="8"')}
            </div>
            <div style="text-align:right;margin-top:0.35rem">
              <a onclick="openModal('forgot')" style="font-size:0.8rem;cursor:pointer">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Log In</button>
          </form>
          <div class="modal-footer" style="display:flex;flex-direction:column;gap:0.35rem">
            <span>Don't have an account? <a onclick="openModal('signup')">Sign Up</a></span>
            <a onclick="openModal('resend-verify')" style="font-size:0.8rem">Resend verification email</a>
          </div>
        `;
        } else if (type === 'forgot') {
          content.innerHTML = `
          <h2 class="modal-title">Forgot Password</h2>
          <div class="modal-sub">Enter your email and we'll send you a reset link.</div>
          <form onsubmit="mockForgotPassword(event)">
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required maxlength="${INPUT_LIMITS.email}" placeholder="you@example.com">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Send Reset Link</button>
          </form>
          <div class="modal-footer">
            <a onclick="openModal('login')">Back to Log In</a>
          </div>
        `;
        } else if (type === 'reset') {
          content.innerHTML = `
          <h2 class="modal-title">Reset Password</h2>
          <div class="modal-sub">Choose a new password for your account.</div>
          <form onsubmit="mockResetPassword(event)">
            <input type="hidden" id="auth-reset-token" value="">
            <div class="form-group">
              <label class="form-label">NEW PASSWORD</label>
              ${authPasswordField('auth-new-password', 'At least 8 characters', 'minlength="8"')}
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Update Password</button>
          </form>
          <div class="modal-footer">
            <a onclick="openModal('login')">Back to Log In</a>
          </div>
        `;
          const tokenInput = document.getElementById('auth-reset-token');
          if (tokenInput && state.pendingResetToken) tokenInput.value = state.pendingResetToken;
        } else if (type === 'resend-verify') {
          const pendingEmail = state.pendingVerifyEmail || '';
          content.innerHTML = `
          <h2 class="modal-title">Verify Email</h2>
          <div class="modal-sub">Check your inbox for the verification link. You must verify before you can log in.</div>
          <form onsubmit="mockResendVerification(event)">
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required maxlength="${INPUT_LIMITS.email}" placeholder="you@example.com" value="${escapeHtml(pendingEmail)}">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Resend Email</button>
          </form>
          <div class="modal-footer">
            <a onclick="openModal('login')">Back to Log In</a>
          </div>
        `;
        } else {
          content.innerHTML = `
          <h2 class="modal-title">Create Account</h2>
          <div class="modal-sub">Join Footy-Trivia. You will need to verify your email before you can log in.</div>
          <form onsubmit="mockRegister(event)">
            <div class="form-group">
              <label class="form-label">USERNAME</label>
              <input type="text" id="auth-username" class="form-input" required minlength="3" maxlength="${INPUT_LIMITS.username}" pattern="[A-Za-z0-9_]+" placeholder="footballer123">
            </div>
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required maxlength="${INPUT_LIMITS.email}" placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              ${authPasswordField('auth-password', 'At least 8 characters', 'minlength="8"')}
            </div>
            <button type="submit" id="auth-submit-btn" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Sign Up</button>
            <div id="auth-form-status" class="auth-form-status hidden" aria-live="polite"></div>
            <div id="auth-form-error" class="auth-form-error hidden" role="alert"></div>
          </form>
          <div class="modal-footer">
            Already have an account? <a onclick="openModal('login')">Log In</a>
          </div>
        `;
        }
        setupAuthModal();
        overlay.classList.add('show');
      }
      function closeModal() {
        hidePleaseWait(true);
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
          overlay.classList.remove('show');
          const modalContainer = overlay.querySelector('.modal');
          if (modalContainer) {
            modalContainer.style.maxWidth = '';
          }
        }
      }
      function closeModalOutside(e) {
        if (e.target.id === 'modal-overlay') {
          closeModal();
        }
      }
      async function mockRegister(e) {
        e.preventDefault();
        let username, email, password;
        try {
          username = validateUsernameInput(document.getElementById('auth-username').value);
          email = validateEmailInput(document.getElementById('auth-email').value);
          password = validatePasswordInput(document.getElementById('auth-password').value);
        } catch (err) {
          showToast(err.message, 'error');
          return;
        }

        const form = e.currentTarget || e.target;
        hidePleaseWait(true);
        setAuthFormError('');
        setAuthFormStatus('Creating your account…');
        setAuthSubmitting(form, true);
        try {
          await wakeApiServer();
          let registerRes;
          try {
            registerRes = await postRegisterRequest(username, email, password);
          } catch (networkErr) {
            if (!isNetworkError(networkErr)) throw networkErr;
            setAuthFormStatus('Connecting to server…');
            await wakeApiServer();
            await new Promise((resolve) => setTimeout(resolve, 1500));
            registerRes = await postRegisterRequest(username, email, password);
          }

          if (!registerRes.ok) {
            hidePleaseWait(true);
            setAuthFormStatus('');
            const message = await readApiErrorMessage(registerRes, 'Registration failed');
            const fieldId = authFieldForError(message);
            setAuthFormError(message, fieldId);
            showToast(message, registerRes.status === 409 ? 'warning' : 'error', 5500);
            return;
          }

          const registerData = await registerRes.json().catch(() => ({}));
          await clearAuthClientState();
          setAuthFormError('');
          setAuthFormStatus('');
          closeModal();
          state.pendingVerifyEmail = email;
          const verifyMsg = registerData.detail
            || `Account created! We sent a verification link to ${email}. Please verify before logging in.`;
          showToast(verifyMsg, 'success', 7000);
          openModal('resend-verify');
        } catch (err) {
          console.error(err);
          hidePleaseWait(true);
          setAuthFormStatus('');
          const message = err.message || (isNetworkError(err) ? networkErrorMessage() : 'Registration failed');
          setAuthFormError(message, authFieldForError(message));
          showToast(message, 'error', 5500);
        } finally {
          hidePleaseWait(true);
          setAuthFormStatus('');
          setAuthSubmitting(form, false);
        }
      }

      async function mockLogin(e) {
        e.preventDefault();
        let email, password;
        try {
          email = validateEmailInput(document.getElementById('auth-email').value);
          password = validatePasswordInput(document.getElementById('auth-password').value);
        } catch (err) {
          showToast(err.message, 'error');
          return;
        }

        showPleaseWait();
        setAuthSubmitting(e.target, true);
        try {
          const userObj = await completeLogin(email, password);
          closeModal();
          showToast(`Welcome back, ${userObj.username}!`, 'success');
        } catch (err) {
          console.error(err);
          const message = err.message || (isNetworkError(err) ? networkErrorMessage() : 'Login failed');
          showToast(message, 'error', err.requiresVerification ? 7000 : 4000);
          if (err.requiresVerification) {
            state.pendingVerifyEmail = email;
            openModal('resend-verify');
          }
        } finally {
          hidePleaseWait();
          setAuthSubmitting(e.target, false);
        }
      }

      async function mockForgotPassword(e) {
        e.preventDefault();
        let email;
        try {
          email = validateEmailInput(document.getElementById('auth-email').value);
        } catch (err) {
          showToast(err.message, 'error');
          return;
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include',
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error('Password reset is unavailable. Restart the backend server, then try again.');
            }
            throw new Error(authErrorMessage(data.detail, 'Could not send reset email'));
          }
          closeModal();
          showToast(data.detail || 'If that email is registered, a reset link has been sent.', 'success');
        } catch (err) {
          if (err.message === 'Failed to fetch') {
            showToast('Cannot reach the API server. Make sure the backend is running on ' + API_BASE_URL, 'error');
          } else {
            showToast(err.message || 'Could not send reset email', 'error');
          }
        }
      }

      async function mockResetPassword(e) {
        e.preventDefault();
        const token = String(document.getElementById('auth-reset-token').value || '').trim();
        let new_password;
        try {
          if (!token || token.length > 2048) throw new Error('Invalid reset token');
          rejectControlChars(token, 'Reset token');
          new_password = validatePasswordInput(document.getElementById('auth-new-password').value, 'New password');
        } catch (err) {
          showToast(err.message, 'error');
          return;
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password }),
            credentials: 'include',
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(authErrorMessage(data.detail, 'Password reset failed'));
          state.pendingResetToken = null;
          closeModal();
          showToast(data.detail || 'Password updated. You can log in now.', 'success');
          openModal('login');
        } catch (err) {
          showToast(err.message || 'Password reset failed', 'error');
        }
      }

      async function mockResendVerification(e) {
        e.preventDefault();
        let email;
        try {
          email = validateEmailInput(document.getElementById('auth-email').value);
        } catch (err) {
          showToast(err.message, 'error');
          return;
        }
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include',
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(authErrorMessage(data.detail, 'Could not resend verification email'));
          closeModal();
          showToast(data.detail || 'Verification email sent if the account exists.', 'success');
        } catch (err) {
          showToast(err.message || 'Could not resend verification email', 'error');
        }
      }

      function readAuthTokensFromUrl(urlParams) {
        const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        return {
          verifyToken: hashParams.get('verify_token') || urlParams.get('verify_token'),
          resetToken: hashParams.get('reset_token') || urlParams.get('reset_token'),
        };
      }

      async function handleAuthUrlParams(urlParams) {
        const { verifyToken, resetToken } = readAuthTokensFromUrl(urlParams);
        const cleanUrl = () => {
          const url = new URL(window.location);
          url.searchParams.delete('verify_token');
          url.searchParams.delete('reset_token');
          url.hash = '';
          window.history.replaceState({}, document.title, url.pathname + url.search);
        };
        if (verifyToken) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: verifyToken }),
              credentials: 'include',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(authErrorMessage(data.detail, 'Verification failed'));
            showToast(data.detail || 'Email verified! You can log in now.', 'success');
            openModal('login');
          } catch (err) {
            showToast(err.message || 'Verification failed', 'error');
          } finally {
            cleanUrl();
          }
        }
        if (resetToken) {
          state.pendingResetToken = resetToken;
          openModal('reset');
          cleanUrl();
        }
      }

      async function logout() {
        try {
          await apiRequest('/api/auth/logout', { method: 'POST' });
        } catch (_) {}
        forceLogout(null, false);
        updateAuthUI();
        const bracketTab = document.getElementById('wc-bracket');
        if (bracketTab && bracketTab.style.display !== 'none') {
          const dashboardBtn = document.querySelector('.wc-tab[onclick*="\'dashboard\'"]');
          switchWCTab('dashboard', dashboardBtn);
        }
        showToast('Logged out successfully.', 'info');
      }
      function updateAuthUI() {
        const navAuthWrap = document.getElementById('nav-auth-wrap');
        const mobileAuthWrap = document.getElementById('mobile-auth-wrap');
        const profileAuthBtnWrap = document.getElementById('profile-auth-btn-wrap');
        const profileNameEl = document.querySelector('.profile-name');
        const profileRankEl = document.querySelector('.profile-rank');
        const xpFillEl = document.querySelector('.profile-xp-fill');
        const xpLabelEl = document.querySelector('.profile-xp-label');
        if (state.user) {
          const user = state.user;
          if (navAuthWrap) {
            navAuthWrap.innerHTML = `
            <span style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text2);margin-right:0.5rem">👤 ${escapeHtml(user.username)}</span>
            <button class="btn btn-ghost" onclick="logout()">Log out</button>
          `;
          }
          if (mobileAuthWrap) {
            mobileAuthWrap.innerHTML = `
            <span style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text2);flex:1;text-align:center">👤 ${escapeHtml(user.username)}</span>
            <button class="btn btn-ghost" style="flex:1" onclick="logout()">Log out</button>
          `;
          }
          if (profileAuthBtnWrap) {
            profileAuthBtnWrap.innerHTML = `
            <button class="btn btn-ghost" onclick="logout()">🚪 Log out</button>
          `;
          }
          if (profileNameEl) profileNameEl.textContent = user.username;
          if (profileRankEl) {
            const ranks = ['Rookie - Silver I', 'Amateur - Silver II', 'Pro - Gold I', 'Elite - Gold II', 'World Class - Diamond I', 'Legendary - Champion'];
            const rankIdx = Math.min(ranks.length - 1, Math.floor((user.level || 0) / 2));
            profileRankEl.textContent = (ranks[rankIdx] || ranks[0]).toUpperCase();
          }
          if (xpFillEl) {
            const pct = (user.xp / 1000) * 100;
            xpFillEl.style.width = `${pct}%`;
          }
          if (xpLabelEl) {
            xpLabelEl.textContent = `${user.xp} / 1000 XP to next level`;
          }
          renderProfileStats(user);
          updatePredictionCenterAuthUI();
        } else {
          if (navAuthWrap) {
            navAuthWrap.innerHTML = `
            <button class="btn btn-ghost" onclick="openModal('login')">Log in</button>
            <button class="btn btn-primary" onclick="openModal('signup')">Sign up</button>
          `;
          }
          if (mobileAuthWrap) {
            mobileAuthWrap.innerHTML = `
            <button class="btn btn-ghost" style="flex:1;justify-content:center" onclick="openModal('login')">Log in</button>
            <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="openModal('signup')">Sign Up</button>
          `;
          }
          if (profileAuthBtnWrap) {
            profileAuthBtnWrap.innerHTML = `
            <button class="btn btn-ghost" onclick="openModal('signup')">👤 Create Account</button>
          `;
          }
          if (profileNameEl) profileNameEl.textContent = 'Guest Player';
          if (profileRankEl) profileRankEl.textContent = 'ROOKIE - SILVER I';
          if (xpFillEl) xpFillEl.style.width = '12%';
          if (xpLabelEl) xpLabelEl.textContent = '120 / 1000 XP to next level';
          renderProfileStats(null);
          updatePredictionCenterAuthUI();
        }
        const countryLabel = document.getElementById('profile-country-label');
        const countryBtn = document.getElementById('profile-country-btn');
        const countryName = state.user ? state.user.country : state.guestCountry;
        const countryFlag = state.user ? state.user.countryFlag : state.guestCountryFlag;
        if (countryName) {
          if (countryLabel) {
            countryLabel.innerHTML = `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem"><img src="${safeImageUrl(countryFlag)}" style="height:1.2rem;width:1.8rem;object-fit:cover;border-radius:2px;vertical-align:middle" onerror="this.style.display='none'"/> <span style="color:var(--text);font-weight:600">${escapeHtml(countryName)}</span></div>`;
          }
          if (countryBtn) countryBtn.textContent = 'Change';
        } else {
          if (countryLabel) countryLabel.textContent = 'Not set';
          if (countryBtn) countryBtn.textContent = 'Set';
        }
        // Update Favourite Club UI
        const favClubLabel = document.getElementById('profile-fav-club-label');
        const favClubBtn = document.getElementById('profile-fav-club-btn');
        let favClubName = state.user ? state.user.favClub : state.guestFavClub;
        let favClubLogoUrl = state.user ? state.user.favClubLogo : state.guestFavClubLogo;
        if (favClubName) {
          if (favClubLabel) {
            favClubLabel.innerHTML = `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem"><img src="${safeImageUrl(favClubLogoUrl, 'https://crests.football-data.org/PL.png')}" style="height:2rem;width:2rem;object-fit:contain;vertical-align:middle" onerror="this.src='https://crests.football-data.org/PL.png'"/> <span style="color:var(--text);font-weight:600">${escapeHtml(favClubName)}</span></div>`;
          }
          if (favClubBtn) favClubBtn.textContent = 'Change';
        } else {
          if (favClubLabel) favClubLabel.textContent = 'Not set';
          if (favClubBtn) favClubBtn.textContent = 'Set';
        }
        // Update Favourite World Cup Team UI
        const favWcLabel = document.getElementById('profile-fav-wc-label');
        const favWcBtn = document.getElementById('profile-fav-wc-btn');
        let favWcName = state.user ? state.user.favWc : state.guestFavWc;
        let favWcLogoUrl = state.user ? state.user.favWcLogo : state.guestFavWcLogo;
        if (favWcName) {
          if (favWcLabel) {
            favWcLabel.innerHTML = `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem"><img src="${safeImageUrl(favWcLogoUrl)}" style="height:1.2rem;width:1.8rem;object-fit:cover;border-radius:2px;vertical-align:middle;box-shadow:0 1px 2px rgba(0,0,0,0.2)"/> <span style="color:var(--text);font-weight:600">${escapeHtml(favWcName)}</span></div>`;
          }
          if (favWcBtn) favWcBtn.textContent = 'Change';
        } else {
          if (favWcLabel) favWcLabel.textContent = 'Not set';
          if (favWcBtn) favWcBtn.textContent = 'Set';
        }
      }
      async function saveQuizResult(_mode, _score, _correct, _total, _timeTaken) {
        if (!state.user) return;
        try {
          await refreshProfileStats();
        } catch (e) {
          console.warn('Failed to refresh profile after quiz:', e);
        }
        updateAuthUI();
      }
      function renderCategories(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = CATEGORIES_DATA.map(cat => {
          let iconContent = '';
          if (cat.logo && cat.logo.startsWith('<svg')) {
            iconContent = cat.logo;
          } else if (cat.logo) {
            iconContent = `<img src="${cat.logo}" alt="${cat.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                           <span style="display:none">${cat.icon}</span>`;
          } else {
            iconContent = cat.icon;
          }
          let action = `startQuiz('${cat.id}')`;
          if (cat.id === 'all-categories') {
            action = `showPage('categories')`;
          } else if (cat.id === 'transfer') {
            action = `showPage('transfer')`;
          }
          return `
          <div class="category-card" onclick="${action}">
            <div class="category-icon" style="background:${cat.color}20;color:${cat.color}">
              ${iconContent}
            </div>
            <div class="category-info">
              <div class="category-name">${cat.name}</div>
              <div class="category-count">${cat.count}</div>
            </div>
          </div>
          `;
        }).join('');
      }
      // ────────────────────────── a•a•a•a•a•a• INIT a•a•a•a•a•a•a•
      function updateDynamicCategoryCounts() {
        document.querySelectorAll('.cat-card').forEach(card => {
          const onclickAttr = card.getAttribute('onclick') || '';
          let categoryId = null;
          
          if (onclickAttr.includes('toggleCategoryQuestions')) {
            const match = onclickAttr.match(/toggleCategoryQuestions\(\s*'([^']+)'/);
            if (match) categoryId = match[1];
          } else if (onclickAttr.includes('showClub')) {
            const match = onclickAttr.match(/showClub\(\s*'([^']+)'/);
            if (match) categoryId = match[1];
          }
          
          if (categoryId && QUESTIONS[categoryId]) {
            const pool = QUESTIONS[categoryId];
            const countEl = card.querySelector('.cat-count');
            if (countEl) {
              if (onclickAttr.includes('showClub')) {
                countEl.textContent = `${pool.length} questions`;
              } else {
                countEl.textContent = `${pool.length} questions - All difficulties`;
              }
            }
          }
        });

        const plTotal = (QUESTIONS['premier-league']?.length || 0) +
                        (QUESTIONS['man-utd']?.length || 0) +
                        (QUESTIONS['man-city']?.length || 0) +
                        (QUESTIONS['chelsea']?.length || 0) +
                        (QUESTIONS['arsenal']?.length || 0) +
                        (QUESTIONS['liverpool']?.length || 0);
        
        const llTotal = (QUESTIONS['la-liga']?.length || 0) +
                        (QUESTIONS['real-madrid']?.length || 0) +
                        (QUESTIONS['barcelona']?.length || 0) +
                        (QUESTIONS['atletico']?.length || 0);

        const intlTotal = (QUESTIONS['ucl']?.length || 0) +
                          (QUESTIONS['world-cup']?.length || 0) +
                          (QUESTIONS['bundesliga']?.length || 0) +
                          (QUESTIONS['serie-a']?.length || 0) +
                          (QUESTIONS['ligue-1']?.length || 0);

        const leagueCounts = document.querySelectorAll('.league-count');
        if (leagueCounts.length >= 3) {
          leagueCounts[0].textContent = `${plTotal} Questions Available`;
          leagueCounts[1].textContent = `${llTotal} Questions Available`;
          leagueCounts[2].textContent = `${intlTotal} Questions Available`;
        }
      }

      const HERO_ACTIVE_PLAYERS_BOOST = 500;
      const HERO_QUESTIONS_LABEL = '200+';
      const HERO_CATEGORIES_LABEL = '10+';
      const HERO_GAME_MODES_LABEL = '5';
      const CACHED_ACTIVE_PLAYERS_KEY = 'footytrivia_cached_active_players';

      function formatActivePlayers(count) {
        const n = Number(count);
        if (!Number.isFinite(n) || n < 0) return '0';
        return n.toLocaleString();
      }

      function displayHeroActivePlayers(realCount) {
        const real = Number(realCount);
        const base = Number.isFinite(real) && real >= 0 ? real : 0;
        return formatActivePlayers(base + HERO_ACTIVE_PLAYERS_BOOST);
      }

      function getCachedActivePlayers() {
        try {
          const raw = localStorage.getItem(CACHED_ACTIVE_PLAYERS_KEY);
          if (raw === null) return null;
          const n = Number(raw);
          return Number.isFinite(n) && n >= 0 ? n : null;
        } catch (e) {
          return null;
        }
      }

      function saveCachedActivePlayers(realCount) {
        try {
          const n = Number(realCount);
          if (Number.isFinite(n) && n >= 0) {
            localStorage.setItem(CACHED_ACTIVE_PLAYERS_KEY, String(n));
          }
        } catch (e) {}
      }

      function getLocalStatsFallback() {
        const questions = window.QUESTIONS || {};
        const categories = window.CATEGORIES_DATA || [];
        let totalQuestions = 0;
        Object.values(questions).forEach(pool => {
          if (Array.isArray(pool)) totalQuestions += pool.length;
        });
        return {
          active_players: getCachedActivePlayers() ?? 0,
          total_questions: totalQuestions || null,
          total_categories: categories.length || null,
          total_game_modes: 4,
        };
      }

      function applyLocalHeroStats() {
        const fallback = getLocalStatsFallback();
        const playersEl = document.getElementById('hero-stat-players');
        const questionsEl = document.getElementById('hero-stat-questions');
        const categoriesEl = document.getElementById('hero-stat-categories');
        const modesEl = document.getElementById('hero-stat-modes');
        if (playersEl) playersEl.textContent = displayHeroActivePlayers(fallback.active_players);
        if (questionsEl) questionsEl.textContent = HERO_QUESTIONS_LABEL;
        if (categoriesEl) categoriesEl.textContent = HERO_CATEGORIES_LABEL;
        if (modesEl) modesEl.textContent = HERO_GAME_MODES_LABEL;
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) heroStats.classList.remove('is-loading');
      }

      async function updateDatabaseStats() {
        try {
          const stats = await apiRequestWithRetry('/api/stats/overview');
          
          // Update hero stats
          const playersEl = document.getElementById('hero-stat-players');
          const questionsEl = document.getElementById('hero-stat-questions');
          const categoriesEl = document.getElementById('hero-stat-categories');
          const modesEl = document.getElementById('hero-stat-modes');
          
          saveCachedActivePlayers(stats.active_players);
          if (playersEl) playersEl.textContent = displayHeroActivePlayers(stats.active_players);
          if (questionsEl) questionsEl.textContent = HERO_QUESTIONS_LABEL;
          if (categoriesEl) categoriesEl.textContent = HERO_CATEGORIES_LABEL;
          if (modesEl) modesEl.textContent = HERO_GAME_MODES_LABEL;

          const heroStats = document.querySelector('.hero-stats');
          if (heroStats) {
            heroStats.classList.remove('is-loading');
            heroStats.querySelectorAll('.hero-stat-num').forEach(el => { el.style.animation = 'popIn .6s ease'; });
          }
          
          // Update league rankings counts on the leaderboard page
          const plRank = document.getElementById('league-rank-pl');
          const llRank = document.getElementById('league-rank-ll');
          const uclRank = document.getElementById('league-rank-ucl');
          const wcRank = document.getElementById('league-rank-wc');
          
          if (plRank && stats.league_players['premier-league']) plRank.textContent = `${stats.league_players['premier-league'].toLocaleString()} players`;
          if (llRank && stats.league_players['la-liga']) llRank.textContent = `${stats.league_players['la-liga'].toLocaleString()} players`;
          if (uclRank && stats.league_players['ucl']) uclRank.textContent = `${stats.league_players['ucl'].toLocaleString()} players`;
          if (wcRank && stats.league_players['world-cup']) wcRank.textContent = `${stats.league_players['world-cup'].toLocaleString()} players`;
        } catch (err) {
          console.error('Failed to load database stats:', err);
          applyLocalHeroStats();
        }
      }

      function paintWCLeaderboardRows(tbody, entries) {
        if (!tbody || !entries || !entries.length) return false;
        let html = '';
        entries.forEach((p, i) => {
          const rankNum = p.rank || (i + 1);
          const rankStyle = rankNum === 1 ? 'color:var(--gold);font-weight:800;font-size:1.2rem;' : (rankNum === 2 ? 'color:var(--text2);font-weight:800;font-size:1.2rem;' : (rankNum === 3 ? 'color:#b45309;font-weight:800;font-size:1.2rem;' : 'color:var(--text3);font-weight:800;font-size:1.1rem;'));
          const tierName = p.tier || 'Unranked';
          const tierClass = tierName === 'Elite' ? 'wc-tier-elite' : (tierName === 'Gold' ? 'wc-tier-gold' : 'wc-tier-bronze');
          const accuracy = p.accuracy || '0%';
          html += `
            <tr>
              <td><span style="${rankStyle}display:inline-block;width:30px;text-align:center">${rankNum}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:0.75rem">
                  <div class="profile-avatar" style="width:32px;height:32px;font-size:0.8rem;background:var(--surface2);display:flex;justify-content:center;align-items:center;border-radius:50%;border:1px solid var(--border)">${p.username ? p.username[0].toUpperCase() : '?'}</div>
                  <span style="font-weight:600">${escapeHtml(p.username || 'Guest')}</span>
                </div>
              </td>
              <td>${escapeHtml(accuracy)}</td>
              <td style="font-weight:700">${(p.total_points || 0).toLocaleString()}</td>
              <td><span class="wc-tier-badge ${tierClass}">${escapeHtml(tierName)}</span></td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
        return true;
      }

      function readWCLeaderboardCache() {
        try {
          const raw = localStorage.getItem('wc_leaderboard_cache');
          if (!raw) return null;
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return { savedAt: 0, entries: parsed };
          if (parsed && Array.isArray(parsed.entries)) return parsed;
        } catch (e) {}
        return null;
      }

      async function renderWCLeaderboard() {
        const table = document.getElementById('wc-leaderboard-table');
        if (!table) return;

        let tbody = table.querySelector('tbody');
        if (!tbody) {
          tbody = document.createElement('tbody');
          table.appendChild(tbody);
        }

        const cached = readWCLeaderboardCache();
        if (cached && cached.entries && cached.entries.length) {
          paintWCLeaderboardRows(tbody, cached.entries);
        } else {
          tbody.innerHTML = `
            <tr><td colspan="5" style="text-align:center;padding:2rem">Loading rankings from database...</td></tr>
          `;
        }

        try {
          const data = await apiRequestWithRetry('/api/wc/leaderboard?limit=10', {}, 2, 3000);
          if (!data || data.length === 0) {
            tbody.innerHTML = `
              <tr><td colspan="5" style="text-align:center;padding:2rem">No prediction rankings yet. Points are awarded when your predictions are correct.</td></tr>
            `;
            return;
          }
          localStorage.setItem('wc_leaderboard_cache', JSON.stringify({ savedAt: Date.now(), entries: data }));
          paintWCLeaderboardRows(tbody, data);
        } catch (err) {
          console.error('Failed to load World Cup prediction rankings:', err);
          if (cached && cached.entries && cached.entries.length) return;
          tbody.innerHTML = `
            <tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text3)">
              ${escapeHtml(err.message || 'Error loading rankings from database.')}
              <br><button class="btn btn-ghost" style="margin-top:1rem" onclick="renderWCLeaderboard()">Retry</button>
            </td></tr>
          `;
        }
      }

      document.addEventListener('DOMContentLoaded', async () => {
        // Clear la-liga from completed categories on load as requested
        try {
          const completed = JSON.parse(localStorage.getItem('footytrivia_completed_categories') || '[]');
          const idx = completed.indexOf('la-liga');
          if (idx > -1) {
            completed.splice(idx, 1);
            localStorage.setItem('footytrivia_completed_categories', JSON.stringify(completed));
          }
        } catch (e) {}

        function loadGuestPreferences() {
          state.guestFavClub = localStorage.getItem('footytrivia_guest_fav_club');
          state.guestFavClubLogo = localStorage.getItem('footytrivia_guest_fav_club_logo');
          state.guestFavWc = localStorage.getItem('footytrivia_guest_fav_wc');
          state.guestFavWcLogo = localStorage.getItem('footytrivia_guest_fav_wc_logo');
          state.guestCountry = localStorage.getItem('footytrivia_guest_country');
          state.guestCountryCode = localStorage.getItem('footytrivia_guest_country_code');
          state.guestCountryFlag = localStorage.getItem('footytrivia_guest_country_flag');
        }

        loadGuestPreferences();
        updateAuthUI();
        syncSoundUi();
        setupSessionGuards();
        wakeApiServer();
        restoreSession()
          .then(() => {
            if (!state.user) loadGuestPreferences();
            updateAuthUI();
          })
          .catch(() => {
            state.user = null;
            updateAuthUI();
          });
        // Auto-join battle lobby if code is in URL
        const urlParams = new URLSearchParams(window.location.search);
        handleAuthUrlParams(urlParams);
        const battleCode = urlParams.get('code');
        if (battleCode && /^[A-Z0-9]{6}$/i.test(battleCode)) {
          showPage('battle');
          joinRoom(battleCode.toUpperCase());
        } else {
          const lastPage = localStorage.getItem('footytrivia_last_page');
          if (lastPage && ALLOWED_PAGES.has(lastPage)) {
            showPage(lastPage);
          }
        }
        // Show local data immediately, then upgrade from API in the background
        applyLocalHeroStats();
        updateDatabaseStats();
        updateHomeLeaderboardPreview();
        
        // Init leaderboard with static data on load
        const lbContainer = document.getElementById('lb-main-list');
        if (lbContainer) renderStaticLeaderboard();
        renderCategories('home-cats');
        renderCategories('play-cats');
        updateDynamicCategoryCounts();
        newTransferGame();
        setInterval(updateCountdown, 1000);
        updateCountdown();
        syncModeCardSelection();
        if (areGroupRankingsSubmitted()) {
          try { openThirdPlaceSelection(); } catch (e) {}
        }
      });
      // ── WORLD CUP 2026 DATA & FUNCTIONS ──
      // COUNTRY_CODES loaded from data.js
      function getFlagImg(countryName) {
        const code = COUNTRY_CODES[countryName];
        if (!code) return '🏳️';
        return `<img src="https://flagcdn.com/w40/${code}.png" alt="${escapeAttr(countryName)}" class="wc-flag-img" style="width:22px; height:15px; border-radius:2px; object-fit:cover; vertical-align:middle; box-shadow:0 1px 2px rgba(0,0,0,0.25);">`;
      }
      // WC_TEAMS loaded from data.js
      // WC_GROUPS loaded from data.js
      // WC_PLAYERS loaded from data.js
      // WC_FIXTURES loaded from data.js
      // Verified SportsDB player IDs for mononyms / ambiguous names (search alone returns wrong players).
      const playerPhotoIds = {
        pedri: '34172243',
        rodri: '34163415',
        gavi: '34193417',
        'kaoru mitoma': '34179731',
        'alexis mac allister': '34170133',
        'antoine griezmann': '34159231',
        'bernardo silva': '34152742',
        'kai havertz': '34169226',
        'dani olmo': '34168363',
      };
      const seedPlayerPhotos = {
        'Kylian Mbappe': 'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
        'Lionel Messi': 'https://r2.thesportsdb.com/images/media/player/cutout/e0i2051750317027.png',
        'Cristiano Ronaldo': 'https://r2.thesportsdb.com/images/media/player/cutout/a19jje1761592498.png',
        'Jude Bellingham': 'https://r2.thesportsdb.com/images/media/player/cutout/trk5271750271712.png',
        'Lamine Yamal': 'https://r2.thesportsdb.com/images/media/player/cutout/m9n4ja1761512633.png',
        'Vinicius Jr': 'https://r2.thesportsdb.com/images/media/player/cutout/ejuxsh1750271859.png',
        'Harry Kane': 'https://r2.thesportsdb.com/images/media/player/cutout/j4ouvd1756408895.png',
        'Bukayo Saka': 'https://r2.thesportsdb.com/images/media/player/cutout/xfwok41769331816.png',
        'Cole Palmer': 'https://r2.thesportsdb.com/images/media/player/cutout/fn0pzc1757010119.png',
        'Kevin De Bruyne': 'https://r2.thesportsdb.com/images/media/player/cutout/o4flia1764089447.png',
        'Phil Foden': 'https://r2.thesportsdb.com/images/media/player/cutout/lbn4sx1769182620.png',
        'Pedri': 'https://r2.thesportsdb.com/images/media/player/cutout/82xtuu1726509836.png',
      };
      const SPORTSDB_SEARCH_URL = (window.ENV && window.ENV.SPORTSDB_API_URL)
        || 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php';
      const SPORTSDB_LOOKUP_URL = 'https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php';
      const PLAYER_PHOTO_CACHE_KEY = 'wc_player_photo_cache_v3';
      const PLAYER_PHOTO_IMG_ATTRS = 'style="display:none; width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;" referrerpolicy="no-referrer" onload="this.style.display=\'block\'; this.previousElementSibling.style.display=\'none\';" onerror="this.style.display=\'none\'; this.previousElementSibling.style.display=\'flex\'; if(window.invalidatePlayerPhoto) window.invalidatePlayerPhoto(this.dataset.player);"';

      function normalizePlayerName(name) {
        return String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      }

      function playerPhotoCacheKey(name) {
        return normalizePlayerName(name).toLowerCase();
      }

      function normalizeClubName(club) {
        return normalizePlayerName(club).toLowerCase()
          .replace(/\b(fc|afc|cf|sc|ac)\b/g, '')
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      function clubMatches(resultTeam, expectedClub) {
        if (!expectedClub || !resultTeam) return false;
        const expected = normalizeClubName(expectedClub);
        const actual = normalizeClubName(resultTeam);
        if (!expected || !actual) return false;
        if (actual.includes(expected) || expected.includes(actual)) return true;
        return expected.split(' ').filter(w => w.length > 3).some(word => actual.includes(word));
      }

      function getPlayerPhotoContext(playerName) {
        const key = playerPhotoCacheKey(playerName);
        return wcPlayers().find(p => playerPhotoCacheKey(p.name) === key) || null;
      }

      function normalizePlayerPhotoCache(rawCache) {
        const normalized = {};
        Object.entries(rawCache || {}).forEach(([name, url]) => {
          if (!url) return;
          const safeUrl = safeImageUrl(url);
          if (safeUrl) normalized[playerPhotoCacheKey(name)] = safeUrl;
        });
        return normalized;
      }

      let playerPhotoCache = normalizePlayerPhotoCache(
        JSON.parse(localStorage.getItem(PLAYER_PHOTO_CACHE_KEY) || '{}')
      );
      const playerPhotoPending = new Set();

      function buildPlayerSearchVariants(playerName, context) {
        const trimmed = String(playerName || '').trim();
        const normalized = normalizePlayerName(trimmed);
        const parts = normalized.split(/\s+/).filter(Boolean);
        const variants = [trimmed, normalized];
        if (parts.length >= 2) {
          variants.push(parts.slice(-2).join(' '));
        }
        if (context?.club) {
          variants.push(`${trimmed} ${context.club}`);
          if (parts.length >= 2) {
            variants.push(`${parts.slice(-2).join(' ')} ${context.club}`);
          }
        }
        return [...new Set(variants.filter(Boolean))];
      }

      function isMononym(playerName) {
        return normalizePlayerName(playerName).split(/\s+/).filter(Boolean).length === 1;
      }

      function scorePlayerMatch(candidate, targetName, context) {
        const playerName = normalizePlayerName(candidate.strPlayer || '').toLowerCase();
        const target = normalizePlayerName(targetName).toLowerCase();
        const targetParts = target.split(/\s+/).filter(Boolean);
        const playerParts = playerName.split(/\s+/).filter(Boolean);
        let score = 0;

        if (playerName === target) {
          score += 100;
        } else if (targetParts.length === 1) {
          if (playerParts.length === 1 && playerParts[0] === targetParts[0]) {
            score += 95;
          } else if (playerParts[0] === targetParts[0] && context?.club && clubMatches(candidate.strTeam, context.club)) {
            score += 88;
          } else {
            return 0;
          }
        } else if (playerParts.slice(-2).join(' ') === targetParts.slice(-2).join(' ')) {
          score += 80;
        } else if (playerName.includes(target) || target.includes(playerName)) {
          score += 55;
        } else {
          return 0;
        }

        if (context?.club && clubMatches(candidate.strTeam, context.club)) score += 35;
        if (context?.team && clubMatches(candidate.strTeam, context.team)) score += 15;
        if (candidate.strSport === 'Soccer') score += 5;
        if (candidate.strCutout) score += 3;
        return score;
      }

      function pickBestSoccerPlayer(results, targetName, context) {
        if (!Array.isArray(results) || !results.length) return null;
        const mononym = isMononym(targetName);
        const minScore = mononym ? 90 : 70;
        const scored = results
          .map(item => ({ item, score: scorePlayerMatch(item, targetName, context) }))
          .filter(entry => entry.score >= minScore)
          .sort((a, b) => b.score - a.score);
        return scored[0]?.item || null;
      }

      function extractPlayerPhotoUrl(data, targetName, context) {
        const result = pickBestSoccerPlayer(data && data.player, targetName, context);
        if (!result) return '';
        return result.strCutout || result.strThumb || result.strFanart1 || '';
      }

      function extractLookupPlayerPhotoUrl(data) {
        const result = (data && data.players && data.players[0]) || null;
        if (!result) return '';
        return result.strCutout || result.strThumb || result.strFanart1 || '';
      }

      function persistPlayerPhotoCache() {
        try {
          localStorage.setItem(PLAYER_PHOTO_CACHE_KEY, JSON.stringify(playerPhotoCache));
        } catch (e) {}
      }

      let seedCacheUpdated = false;
      for (const [name, url] of Object.entries(seedPlayerPhotos)) {
        const key = playerPhotoCacheKey(name);
        if (!playerPhotoCache[key]) {
          const safeUrl = safeImageUrl(url);
          if (safeUrl) {
            playerPhotoCache[key] = safeUrl;
            seedCacheUpdated = true;
          }
        }
      }
      if (seedCacheUpdated) persistPlayerPhotoCache();

      function cachePlayerPhoto(playerName, photoUrl) {
        const safeUrl = safeImageUrl(photoUrl);
        if (!safeUrl) return '';
        const key = playerPhotoCacheKey(playerName);
        playerPhotoCache[key] = safeUrl;
        persistPlayerPhotoCache();
        return safeUrl;
      }

      async function fetchPlayerPhotoById(playerId) {
        const res = await fetch(`${SPORTSDB_LOOKUP_URL}?id=${encodeURIComponent(playerId)}`);
        if (!res.ok) throw new Error('SportsDB lookup failed');
        const data = await res.json();
        return extractLookupPlayerPhotoUrl(data);
      }

      async function fetchPlayerPhotoFromBackend(searchName, context, targetName) {
        const res = await fetch(
          `${API_BASE_URL}/api/players/search?name=${encodeURIComponent(searchName)}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Player search unavailable');
        const data = await res.json();
        return extractPlayerPhotoUrl(data, targetName, context);
      }

      async function fetchPlayerPhotoFromSportsDb(searchName, context, targetName) {
        const res = await fetch(`${SPORTSDB_SEARCH_URL}?p=${encodeURIComponent(searchName)}`);
        if (!res.ok) throw new Error('SportsDB search failed');
        const data = await res.json();
        return extractPlayerPhotoUrl(data, targetName, context);
      }

      async function resolvePlayerPhotoUrl(playerName) {
        const context = getPlayerPhotoContext(playerName);
        const cacheKey = playerPhotoCacheKey(playerName);
        const mappedId = playerPhotoIds[cacheKey];
        if (mappedId) {
          try {
            const idUrl = await fetchPlayerPhotoById(mappedId);
            if (idUrl) return idUrl;
          } catch (e) {}
        }

        const variants = buildPlayerSearchVariants(playerName, context);
        for (const variant of variants) {
          try {
            const backendUrl = await fetchPlayerPhotoFromBackend(variant, context, playerName);
            if (backendUrl) return backendUrl;
          } catch (e) {}
          try {
            const sportsDbUrl = await fetchPlayerPhotoFromSportsDb(variant, context, playerName);
            if (sportsDbUrl) return sportsDbUrl;
          } catch (e) {}
        }
        return '';
      }

      function invalidatePlayerPhoto(playerName) {
        const key = playerPhotoCacheKey(playerName);
        if (!playerPhotoCache[key]) return;
        delete playerPhotoCache[key];
        persistPlayerPhotoCache();
      }
      window.invalidatePlayerPhoto = invalidatePlayerPhoto;

      function getPlayerPhoto(playerName, callback) {
        const cacheKey = playerPhotoCacheKey(playerName);
        const cached = playerPhotoCache[cacheKey];
        if (cached) {
          callback(cached);
          return;
        }
        if (playerPhotoPending.has(cacheKey)) {
          const waitForPhoto = () => {
            if (playerPhotoCache[cacheKey]) {
              callback(playerPhotoCache[cacheKey]);
              return;
            }
            if (!playerPhotoPending.has(cacheKey)) {
              callback('');
              return;
            }
            setTimeout(waitForPhoto, 120);
          };
          waitForPhoto();
          return;
        }
        playerPhotoPending.add(cacheKey);
        resolvePlayerPhotoUrl(playerName)
          .then((photoUrl) => {
            const safeUrl = photoUrl ? cachePlayerPhoto(playerName, photoUrl) : '';
            callback(safeUrl);
          })
          .catch(() => callback(''))
          .finally(() => playerPhotoPending.delete(cacheKey));
      }
      function safeParseStorage(key, fallback) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return fallback;
          return JSON.parse(raw);
        } catch (e) {
          return fallback;
        }
      }

      function wcGroups() { return window.WC_GROUPS || {}; }
      function wcPlayers() { return window.WC_PLAYERS || []; }
      function wcFixtures() { return window.WC_FIXTURES || []; }
      function wcTeams() { return window.WC_TEAMS || []; }

      function resolveAwardPrediction(key, value) {
        if (!value) return null;
        if (typeof value === 'object' && value.name) return value;
        if (typeof value !== 'string') return value;
        if (key === 'world-champion') return value;
        return wcPlayers().find(p => p.name === value) || value;
      }

      function normalizeAwardPredictions(raw) {
        if (!raw || typeof raw !== 'object') return {};
        const normalized = {};
        Object.entries(raw).forEach(([key, value]) => {
          const resolved = resolveAwardPrediction(key, value);
          if (resolved) normalized[key] = resolved;
        });
        return normalized;
      }

      function normalizeGroupPredictions(source) {
        const base = wcGroups();
        if (!base || !Object.keys(base).length) return {};
        const merged = JSON.parse(JSON.stringify(base));
        if (!source || typeof source !== 'object') return merged;
        Object.keys(merged).forEach(key => {
          const incoming = source[key];
          if (!incoming || !Array.isArray(incoming.teams)) return;
          const teams = incoming.teams
            .filter(team => team && team.name)
            .slice(0, 4)
            .map((team, index) => ({
              name: team.name,
              p: team.p ?? merged[key].teams[index]?.p ?? 0,
              gd: team.gd ?? merged[key].teams[index]?.gd ?? 0,
              pts: team.pts ?? merged[key].teams[index]?.pts ?? 0,
            }));
          if (teams.length === 4) {
            merged[key].name = incoming.name || merged[key].name;
            merged[key].teams = teams;
          }
        });
        return merged;
      }

      function computeGroupPredictions(stored) {
        let merged = normalizeGroupPredictions(stored);
        if (!merged || !Object.keys(merged).length) {
          const fallback = wcGroups();
          if (Object.keys(fallback).length) {
            merged = JSON.parse(JSON.stringify(fallback));
          }
        }
        return merged;
      }

      function ensureValidGroupPredictions() {
        const stored = safeParseStorage('wc_group_predictions', null);
        groupPredictions = computeGroupPredictions(stored);
        if (groupPredictions && Object.keys(groupPredictions).length) {
          localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        }
        return groupPredictions;
      }

      function refreshWorldCupViews() {
        ensureValidGroupPredictions();
        awardPredictions = normalizeAwardPredictions(awardPredictions);
        updateGroupStandingsStats();
        const activeTabBtn = document.querySelector('.wc-nav-tabs .wc-tab.active');
        const activeTabId = activeTabBtn
          ? (activeTabBtn.getAttribute('onclick') || '').match(/'([^']+)'/)?.[1]
          : 'dashboard';
        if (activeTabId === 'dashboard' || !activeTabId) {
          renderGroupStandings();
          renderBestThirdPlacedTable();
        }
        if (activeTabId === 'predictions') {
          try { renderGroupPredictions(); } catch (err) { console.error('renderGroupPredictions failed:', err); }
          try { renderMatchPredictions(); } catch (err) { console.error('renderMatchPredictions failed:', err); }
          try { updateAwardsDisplay(); } catch (err) { console.error('updateAwardsDisplay failed:', err); }
          try { renderBestThirdPlacedTable(); } catch (err) { console.error('renderBestThirdPlacedTable failed:', err); }
        }
      }

      function refreshPredictionCenterIfVisible() {
        const tab = document.getElementById('wc-predictions');
        if (!tab || tab.style.display === 'none') return;
        ensureValidGroupPredictions();
        updateGroupStandingsStats();
        renderGroupPredictions();
        renderMatchPredictions();
        updateAwardsDisplay();
        renderBestThirdPlacedTable();
      }

      let groupPredictions = computeGroupPredictions(safeParseStorage('wc_group_predictions', null));
      if (groupPredictions && Object.keys(groupPredictions).length && !localStorage.getItem('wc_group_predictions')) {
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
      }
      let matchPredictions = safeParseStorage('wc_match_predictions', {});
      let awardPredictions = normalizeAwardPredictions(safeParseStorage('wc_award_predictions', {}));
      const GROUP_RANKINGS_SUBMITTED_KEY = 'wc_group_rankings_submitted';
      const BRACKET_SUBMITTED_KEY = 'wc_bracket_submitted';
      function areGroupRankingsSubmitted() {
        return localStorage.getItem(GROUP_RANKINGS_SUBMITTED_KEY) === 'true';
      }

      // ── Manual 3rd-place qualifier selection ──
      const MANUAL_THIRD_PLACE_KEY = 'wc_manual_third_place_v1';
      let manualThirdPlace = (() => {
        try {
          const saved = JSON.parse(localStorage.getItem(MANUAL_THIRD_PLACE_KEY));
          if (saved && Array.isArray(saved.groups)) return { confirmed: !!saved.confirmed, groups: saved.groups };
        } catch (e) {}
        return { confirmed: false, groups: [] };
      })();
      // Working selection while the user is choosing (before confirming).
      let thirdPlaceDraft = [];

      function saveManualThirdPlace() {
        localStorage.setItem(MANUAL_THIRD_PLACE_KEY, JSON.stringify(manualThirdPlace));
      }

      const WC_PREDICTIONS_SYNCED_AT_KEY = 'wc_predictions_synced_at';

      function slimGroupsForPayload(groups) {
        const slim = {};
        Object.entries(groups || {}).forEach(([key, group]) => {
          if (!group || !Array.isArray(group.teams)) return;
          slim[key] = {
            name: group.name || `Group ${key}`,
            teams: group.teams.slice(0, 4).map(team => ({ name: team.name })),
          };
        });
        return slim;
      }

      function getBracketPayloadFromStorage() {
        try {
          const saved = localStorage.getItem('wc_bracket_state_official_slots_v1');
          if (!saved) return [];
          const data = JSON.parse(saved);
          return Array.isArray(data) ? data : [];
        } catch (e) {
          return [];
        }
      }

      function bracketStorageHasCompleteWinners() {
        const stored = getBracketPayloadFromStorage();
        return stored.length === 31 && stored.every(m => m && m.winner);
      }

      function isBracketSubmittedPersisted() {
        if (localStorage.getItem(BRACKET_SUBMITTED_KEY) !== '1') return false;
        return bracketStorageHasCompleteWinners();
      }

      function collectWcPredictionPayload() {
        let bracket = [];
        let champion = null;
        let bracketSubmitted = false;
        if (window.bracketPredictor && window.bracketPredictor.matches) {
          bracket = window.bracketPredictor.matches.map(m => ({
            home: m.home ? m.home.name : null,
            away: m.away ? m.away.name : null,
            winner: m.winner || null,
          }));
          const finalM = window.bracketPredictor.matches[30];
          if (finalM && finalM.winner && finalM[finalM.winner]) {
            champion = finalM[finalM.winner].name || finalM[finalM.winner];
          }
          bracketSubmitted = window.bracketPredictor.isBracketSubmitted();
        }
        if (!bracketSubmitted) {
          bracketSubmitted = isBracketSubmittedPersisted();
        }
        const storedBracket = getBracketPayloadFromStorage();
        const memoryHasWinners = bracket.some(m => m && m.winner);
        const storageHasWinners = storedBracket.some(m => m && m.winner);
        if (!memoryHasWinners && storageHasWinners) {
          bracket = storedBracket.map(m => ({
            home: m.home || null,
            away: m.away || null,
            winner: m.winner || null,
          }));
          const finalEntry = bracket[30];
          if (finalEntry && finalEntry.winner) {
            champion = finalEntry[finalEntry.winner] || null;
          }
        }
        const awards = {};
        Object.entries(awardPredictions).forEach(([key, val]) => {
          awards[key] = (val && typeof val === 'object') ? val.name : val;
        });
        return {
          matches: matchPredictions,
          awards,
          groups: slimGroupsForPayload(groupPredictions),
          third_place: manualThirdPlace.confirmed ? manualThirdPlace.groups.slice() : [],
          bracket,
          champion,
          bracket_submitted: bracketSubmitted,
          group_rankings_submitted: areGroupRankingsSubmitted(),
        };
      }

      let wcSyncTimer = null;
      function scheduleWcSync() {
        if (!state.user) return;
        clearTimeout(wcSyncTimer);
        wcSyncTimer = setTimeout(() => syncWcPredictionsToApi({ silent: true }), 1000);
      }

      function applyWcPredictionsFromApi(data) {
        if (!data) return;
        if (data.matches && Object.keys(data.matches).length) {
          matchPredictions = data.matches;
          localStorage.setItem('wc_match_predictions', JSON.stringify(matchPredictions));
        }
        if (data.awards && Object.keys(data.awards).length) {
          awardPredictions = normalizeAwardPredictions(data.awards);
          localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));
        }
        if (data.groups && Object.keys(data.groups).length) {
          groupPredictions = normalizeGroupPredictions(data.groups);
          localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        }
        if (data.group_rankings_submitted) {
          localStorage.setItem(GROUP_RANKINGS_SUBMITTED_KEY, 'true');
        }
        if (data.third_place && data.third_place.length) {
          manualThirdPlace = { confirmed: true, groups: data.third_place.slice() };
          saveManualThirdPlace();
        }
        if (data.bracket && data.bracket.length) {
          const bracketStore = data.bracket.map(m => ({
            home: (m.home && typeof m.home === 'object') ? m.home.name : m.home,
            away: (m.away && typeof m.away === 'object') ? m.away.name : m.away,
            winner: m.winner || null,
          }));
          localStorage.setItem('wc_bracket_state_official_slots_v1', JSON.stringify(bracketStore));
        }
        if (data.bracket_submitted) {
          localStorage.setItem(BRACKET_SUBMITTED_KEY, '1');
        } else if (data.bracket && data.bracket.length === 31 && data.bracket.every(m => m && m.winner)) {
          localStorage.setItem(BRACKET_SUBMITTED_KEY, '1');
        }
        if (window.bracketPredictor) {
          window.bracketPredictor.restoreBracketState();
        }
        refreshPredictionCenterIfVisible();
      }

      function wcPredictionsHasServerData(data) {
        if (!data) return false;
        return !!(
          (data.bracket && data.bracket.length) ||
          (data.matches && Object.keys(data.matches).length) ||
          (data.groups && Object.keys(data.groups).length) ||
          (data.awards && Object.keys(data.awards).length) ||
          (data.third_place && data.third_place.length)
        );
      }

      async function hydrateWcPredictionsForUser() {
        if (!state.user) return;
        const localPayload = collectWcPredictionPayload();
        const localHasData = wcPredictionsHasServerData(localPayload);
        try {
          if (localHasData) {
            const pushed = await syncWcPredictionsToApi({ silent: true });
            if (pushed) {
              refreshPredictionCenterIfVisible();
              return;
            }
          }
          const serverData = await apiRequest('/api/wc/predictions');
          if (wcPredictionsHasServerData(serverData)) {
            applyWcPredictionsFromApi(serverData);
          } else if (localHasData) {
            await syncWcPredictionsToApi({ silent: true });
          }
        } catch (err) {
          console.error('WC prediction load failed:', err);
          if (localHasData) {
            await syncWcPredictionsToApi({ silent: true });
          }
        } finally {
          if (window.bracketPredictor) {
            window.bracketPredictor.restoreBracketState({ render: !!bracketInitialized });
          }
        }
      }

      async function syncWcPredictionsToApi(options = {}) {
        const { silent = false, retried = false } = options;
        if (!state.user) return false;
        try {
          if (!silent) {
            await ensureCsrfToken({ forceRefresh: true });
          }
          const me = await apiRequest('/api/wc/predictions/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collectWcPredictionPayload()),
          }, 30000);
          if (me) {
            state.wcMe = me;
            updatePredictorProfileFromApi(me);
          }
          localStorage.setItem(WC_PREDICTIONS_SYNCED_AT_KEY, String(Date.now()));
          return true;
        } catch (err) {
          const msg = err && err.message ? String(err.message) : '';
          if (!retried && msg.includes('CSRF validation failed')) {
            clearCsrfTokenCache();
            await ensureCsrfToken({ forceRefresh: true });
            return syncWcPredictionsToApi({ silent, retried: true });
          }
          if (!retried && msg.includes('Could not validate credentials')) {
            const refreshed = await tryRefreshSession();
            if (refreshed) {
              return syncWcPredictionsToApi({ silent, retried: true });
            }
            forceLogout(null, false);
            if (!silent) {
              showToast('Your session has expired. Please log in again.', 'error');
            }
            return false;
          }
          console.error('WC prediction sync failed:', err);
          if (!silent) {
            showToast(msg || 'Could not save predictions to your account. Please try again.', 'error');
          }
          return false;
        }
      }

      function updatePredictorProfileFromApi(me) {
        const pts = me.total_points || 0;
        const tier = me.tier || 'Unranked';
        const tierClass = tier === 'Elite' ? 'wc-tier-elite' : (tier === 'Gold' ? 'wc-tier-gold' : 'wc-tier-gold');
        const ptsEl = document.getElementById('wc-profile-pts');
        const accEl = document.getElementById('wc-profile-accuracy');
        const tierEl = document.getElementById('wc-profile-tier');
        if (ptsEl) ptsEl.textContent = pts.toLocaleString();
        if (accEl) accEl.textContent = me.accuracy || '0%';
        if (tierEl) {
          tierEl.textContent = `Tier: ${tier}`;
          tierEl.className = `wc-tier-badge ${tierClass}`;
        }
      }

      // Returns the 8 confirmed group keys for the bracket, or null to fall back to auto top-8.
      function getConfirmedManualThirdPlace() {
        return (manualThirdPlace.confirmed && manualThirdPlace.groups.length === 8)
          ? manualThirdPlace.groups
          : null;
      }

      // The knockout bracket only shows teams once the user has fully predicted in
      // the Prediction Center: group rankings submitted AND the 8 third-place
      // qualifiers confirmed. OR if real standings are complete, auto-unlock.
      function arePredictionsComplete() {
        return true;
      }

      function getBracketUnlockMessage() {
        return '';
      }

      // Deterministic simulator for group stage stats based on team name and group key
      function getSimulatedGroupStats(teamName, rankIndex, groupKey) {
        const baseSeed = getSeed(teamName) + groupKey.charCodeAt(0);
        let pts, gd, gf;
        if (rankIndex === 0) {
          pts = (baseSeed % 2 === 0) ? 9 : 7;
          gd = (baseSeed % 3) + 3; // +3 to +5
          gf = gd + (baseSeed % 3) + 2; // 5 to 10
        } else if (rankIndex === 1) {
          pts = (baseSeed % 3) + 4; // 4, 5, or 6
          gd = (baseSeed % 2) + 1; // +1 or +2
          gf = gd + (baseSeed % 3) + 2; // 3 to 7
        } else if (rankIndex === 2) {
          pts = (baseSeed % 3) + 2; // 2, 3, or 4
          gd = (baseSeed % 3) - 1; // -1, 0, or +1
          gf = (baseSeed % 3) + 2; // 2, 3, or 4
        } else {
          pts = (baseSeed % 4 === 0) ? 1 : 0;
          gd = -((baseSeed % 3) + 2); // -2 to -4
          gf = (baseSeed % 3) + 1; // 1 to 3
        }
        return { p: 3, gd, pts, gf };
      }

      function updateGroupStandingsStats() {
        ensureValidGroupPredictions();
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          if (!group || !Array.isArray(group.teams)) return;
          group.teams.forEach((team, index) => {
            const stats = getSimulatedGroupStats(team.name, index, groupKey);
            team.p = stats.p;
            team.gd = stats.gd;
            team.pts = stats.pts;
            team.gf = stats.gf;
          });
        });
      }

      function getWDL(pts, baseSeed) {
        let w = 0, d = 0, l = 0;
        if (pts === 9) {
          w = 3; d = 0; l = 0;
        } else if (pts === 7) {
          w = 2; d = 1; l = 0;
        } else if (pts === 6) {
          w = 2; d = 0; l = 1;
        } else if (pts === 5) {
          w = 1; d = 2; l = 0;
        } else if (pts === 4) {
          w = 1; d = 1; l = 1;
        } else if (pts === 3) {
          if (baseSeed % 2 === 0) {
            w = 1; d = 0; l = 2;
          } else {
            w = 0; d = 3; l = 0;
          }
        } else if (pts === 2) {
          w = 0; d = 2; l = 1;
        } else if (pts === 1) {
          w = 0; d = 1; l = 2;
        } else if (pts === 0) {
          w = 0; d = 0; l = 3;
        }
        return { w, d, l };
      }

      function getBestThirdPlacedTeams() {
        ensureValidGroupPredictions();
        const thirds = [];
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          if (!group || !Array.isArray(group.teams)) return;
          const team = group.teams[2]; // The 3rd placed team is at index 2
          if (!team) return;
          
          const baseSeed = getSeed(team.name) + groupKey.charCodeAt(0);
          const pts = team.pts || 0;
          const gd = team.gd || 0;
          const gf = team.gf || 0;
          const ga = gf - gd;
          const { w, d, l } = getWDL(pts, baseSeed);
          
          // Get FIFA ranking
          const teamObjFromData = wcTeams().find(t => t.name === team.name) || null;
          const fifaRank = teamObjFromData ? teamObjFromData.ranking : 999;
          
          thirds.push({
            name: team.name,
            groupKey: groupKey,
            pts: pts,
            gd: gd,
            gf: gf,
            ga: ga,
            w: w,
            d: d,
            l: l,
            fifaRank: fifaRank,
            teamObj: team
          });
        });

        // Sort them according to official FIFA tiebreakers
        thirds.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          if (b.gf !== a.gf) return b.gf - a.gf;
          if (b.w !== a.w) return b.w - a.w;
          if (a.fifaRank !== b.fifaRank) return a.fifaRank - b.fifaRank;
          return getSeed(b.name) - getSeed(a.name);
        });

        return thirds;
      }

      function getRealBestThirdPlacedTeams() {
        if (!window.WC_STANDINGS || window.WC_STANDINGS.length === 0) {
          return getBestThirdPlacedTeams(); // Fallback to prediction-based
        }
        const thirds = [];
        window.WC_STANDINGS.forEach(group => {
          // In the real standings, the team at index 2 (position 3) is the third placed team!
          const row = group.table[2];
          if (!row) return;
          const teamName = row.team.shortName || row.team.name;
          const groupLetter = group.name.replace('Group ', '');
          
          // Get FIFA ranking
          const teamObjFromData = wcTeams().find(t => t.name === teamName) || null;
          const fifaRank = teamObjFromData ? teamObjFromData.ranking : 999;
          
          thirds.push({
            name: teamName,
            groupKey: groupLetter,
            pts: row.points || 0,
            gd: row.goalDifference || 0,
            gf: row.goalsFor || 0,
            ga: row.goalsAgainst || 0,
            w: row.won || 0,
            d: row.draw || 0,
            l: row.lost || 0,
            fifaRank: fifaRank
          });
        });
        
        // Sort them according to official FIFA tiebreakers
        thirds.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.gd !== a.gd) return b.gd - a.gd;
          if (b.gf !== a.gf) return b.gf - a.gf;
          if (b.w !== a.w) return b.w - a.w;
          if (a.fifaRank !== b.fifaRank) return a.fifaRank - b.fifaRank;
          return getSeed(b.name) - getSeed(a.name);
        });
        
        return thirds;
      }

      function renderBestThirdPlacedTable() {
        // 1. Predictions Tab Table
        const tbodyPred = document.getElementById('best-third-place-table-body');
        if (tbodyPred) {
          const thirds = getBestThirdPlacedTeams();
          const manualQual = getConfirmedManualThirdPlace();
          tbodyPred.innerHTML = '';
          thirds.forEach((item, idx) => {
            const rank = idx + 1;
            const isQualified = manualQual ? manualQual.includes(item.groupKey) : rank <= 8;
            const statusText = isQualified ? 'Qualified' : 'Eliminated';
            const statusStyle = isQualified 
              ? 'background:rgba(16,185,129,0.15); color:#10b981; font-weight:700; border-radius:4px; padding:0.2rem 0.5rem; font-size:0.75rem; display:inline-block;'
              : 'background:rgba(239,68,68,0.15); color:#ef4444; font-weight:700; border-radius:4px; padding:0.2rem 0.5rem; font-size:0.75rem; display:inline-block;';

            const row = document.createElement('tr');
            row.innerHTML = `
              <td style="text-align:center; font-weight:bold; color:${isQualified ? 'var(--gold)' : 'var(--text3)'}">${rank}</td>
              <td>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  ${getFlagImg(item.name)}
                  <span style="font-weight:600;">${item.name}</span>
                </div>
              </td>
              <td style="text-align:center; font-weight:700; color:var(--text2)">Group ${item.groupKey}</td>
              <td style="text-align:center;"><span style="${statusStyle}">${statusText}</span></td>
            `;
            tbodyPred.appendChild(row);
          });
        }

        // 2. Dashboard Tab Table
        const tbodyDash = document.getElementById('dashboard-best-third-place-table-body');
        if (tbodyDash) {
          const thirds = getRealBestThirdPlacedTeams();
          tbodyDash.innerHTML = '';
          thirds.forEach((item, idx) => {
            const rank = idx + 1;
            const isQualified = rank <= 8;
            const statusText = isQualified ? 'Qualified for Round of 32' : 'Eliminated';
            const statusStyle = isQualified 
              ? 'background:rgba(16,185,129,0.15); color:#10b981; font-weight:700; border-radius:4px; padding:0.25rem 0.75rem; font-size:0.75rem; display:inline-block; border: 1px solid rgba(16,185,129,0.3);'
              : 'background:rgba(239,68,68,0.15); color:#ef4444; font-weight:700; border-radius:4px; padding:0.25rem 0.75rem; font-size:0.75rem; display:inline-block; border: 1px solid rgba(239,68,68,0.3);';

            const row = document.createElement('tr');
            row.innerHTML = `
              <td style="text-align:center; font-weight:bold; color:${isQualified ? 'var(--gold)' : 'var(--text3)'}">
                <span class="wc-rank-badge" style="background:${isQualified ? 'var(--surface2)' : 'transparent'}; border: 1px solid ${isQualified ? 'var(--gold)' : 'var(--border)'}; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center;">${rank}</span>
              </td>
              <td style="text-align:left;">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  ${getFlagImg(item.name)}
                  <span style="font-weight:600;">${item.name}</span>
                </div>
              </td>
              <td style="text-align:center; font-weight:bold; color:var(--text2);">Group ${item.groupKey}</td>
              <td style="text-align:center;"><span style="${statusStyle}">${statusText}</span></td>
            `;
            tbodyDash.appendChild(row);
          });
        }
      }

      let standingsPollInterval = null;
      window.WC_STANDINGS = [];

      // Check if real group stage is complete (all 12 groups, all teams played 3 games)
      function hasRealGroupStageComplete() {
        if (!window.WC_STANDINGS || window.WC_STANDINGS.length < 12) return false;
        return window.WC_STANDINGS.every(group => {
          if (!group.table || group.table.length < 4) return false;
          return group.table.every(row => row.playedGames >= 3);
        });
      }

      // Get real standings as groupPredictions-compatible format
      function getRealGroupPredictions() {
        if (!window.WC_STANDINGS || window.WC_STANDINGS.length === 0) return null;
        const result = {};
        window.WC_STANDINGS.forEach(group => {
          const groupLetter = group.name.replace('Group ', '');
          result[groupLetter] = {
            name: group.name,
            teams: group.table.map(row => {
              const teamName = row.team.shortName || row.team.name;
              return {
                name: teamName,
                p: row.playedGames || 0,
                gd: row.goalDifference || 0,
                pts: row.points || 0,
                gf: row.goalsFor || 0
              };
            })
          };
        });
        return result;
      }

      // Get the best 8 third-placed group keys from real standings
      function getRealQualifiedThirdPlaceGroups() {
        const thirds = getRealBestThirdPlacedTeams();
        return thirds.slice(0, 8).map(t => t.groupKey).sort().join('');
      }

      async function fetchAndRenderStandings() {
        try {
          const res = await fetch(`${API_BASE_URL}/api/wc/standings`, { credentials: 'omit' });
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const data = await res.json();
          window.WC_STANDINGS = data.standings || [];
          renderGroupStandings();
          renderBestThirdPlacedTable();
          // Auto-populate bracket when group stage is complete
          if (hasRealGroupStageComplete() && window.bracketPredictor) {
            window.bracketPredictor.syncRound32Matchups({ persist: true });
            window.bracketPredictor.renderBracket();
            window.bracketPredictor.renderProgress();
            window.bracketPredictor.updateChampionDisplay();
            window.bracketPredictor.updateDownloadButton();
          }
        } catch (err) {
          console.error('Failed to fetch group standings:', err);
        }
      }

      function startStandingsPolling() {
        if (standingsPollInterval) return;
        fetchAndRenderStandings();
        standingsPollInterval = setInterval(fetchAndRenderStandings, 20000);
      }

      function stopStandingsPolling() {
        if (standingsPollInterval) {
          clearInterval(standingsPollInterval);
          standingsPollInterval = null;
        }
      }

      function onGroupStandingsChanged() {
        updateGroupStandingsStats();
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        localStorage.removeItem(GROUP_RANKINGS_SUBMITTED_KEY);
        // Standings changed → the 3rd-place teams may differ, so invalidate the
        // confirmed selection and hide the panel until rankings are re-submitted.
        manualThirdPlace.confirmed = false;
        saveManualThirdPlace();
        const panel = document.getElementById('third-place-selection-panel');
        if (panel) panel.style.display = 'none';
        renderGroupPredictions();
        renderGroupStandings();
        renderBestThirdPlacedTable();
        if (window.bracketPredictor) {
          window.bracketPredictor.syncRound32Matchups();
        }
        updatePredictorProfile();
        scheduleWcSync();
      }
      try {
        ensureValidGroupPredictions();
        updateGroupStandingsStats();
        renderGroupStandings();
        renderBestThirdPlacedTable();
      } catch (err) {
        console.error('Failed to initialize World Cup group data:', err);
        const fallbackGroups = wcGroups();
        if (Object.keys(fallbackGroups).length) {
          groupPredictions = JSON.parse(JSON.stringify(fallbackGroups));
          localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        }
      }
      // Render functions for Group Standings
      function renderGroupStandings() {
        const container = document.getElementById('wc-dashboard-groups');
        if (!container) return;

        // Use real standings if available
        if (window.WC_STANDINGS && window.WC_STANDINGS.length > 0) {
          container.innerHTML = '';
          window.WC_STANDINGS.forEach(group => {
            const card = document.createElement('div');
            card.className = 'wc-card';
            
            let maxPlayed = 0;
            group.table.forEach(t => {
              if (t.playedGames > maxPlayed) maxPlayed = t.playedGames;
            });
            const matchdayLabel = maxPlayed > 1 ? `Matchday ${maxPlayed}` : 'Matchday 2';

            let html = `
              <div class="wc-card-title">${group.name} <span style="font-size:0.75rem; color:var(--gold)">${matchdayLabel}</span></div>
              <table class="wc-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th style="text-align:center;">MP</th>
                    <th style="text-align:center;">W</th>
                    <th style="text-align:center;">D</th>
                    <th style="text-align:center;">L</th>
                    <th style="text-align:center;">GF</th>
                    <th style="text-align:center;">GA</th>
                    <th style="text-align:center;">GD</th>
                    <th style="text-align:center;">Pts</th>
                  </tr>
                </thead>
                <tbody>
            `;
            
            group.table.forEach(row => {
              const teamName = row.team.shortName || row.team.name;
              const gdSign = row.goalDifference > 0 ? '+' : '';
              html += `
                <tr>
                  <td>
                    <div class="wc-team" style="display:flex; align-items:center; gap:0.5rem;">
                      ${getFlagImg(teamName)}
                      <span>${teamName}</span>
                    </div>
                  </td>
                  <td style="text-align:center;">${row.playedGames}</td>
                  <td style="text-align:center;">${row.won}</td>
                  <td style="text-align:center;">${row.draw}</td>
                  <td style="text-align:center;">${row.lost}</td>
                  <td style="text-align:center;">${row.goalsFor}</td>
                  <td style="text-align:center;">${row.goalsAgainst}</td>
                  <td style="text-align:center;">${gdSign}${row.goalDifference}</td>
                  <td style="text-align:center; font-weight:bold;">${row.points}</td>
                </tr>
              `;
            });
            
            html += `
                </tbody>
              </table>
            `;
            card.innerHTML = html;
            container.appendChild(card);
          });
          return;
        }

        // Fallback: render default predicted/default layout
        ensureValidGroupPredictions();
        container.innerHTML = '';
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          if (!group || !Array.isArray(group.teams)) return;
          const card = document.createElement('div');
          card.className = 'wc-card';
          let html = `
            <div class="wc-card-title">${group.name} <span style="font-size:0.75rem; color:var(--gold)">Matchday 2</span></div>
            <table class="wc-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th style="text-align:center;">MP</th>
                  <th style="text-align:center;">W</th>
                  <th style="text-align:center;">D</th>
                  <th style="text-align:center;">L</th>
                  <th style="text-align:center;">GF</th>
                  <th style="text-align:center;">GA</th>
                  <th style="text-align:center;">GD</th>
                  <th style="text-align:center;">Pts</th>
                </tr>
              </thead>
              <tbody>
          `;
          group.teams.forEach(team => {
            html += `
              <tr>
                <td>
                  <div class="wc-team" style="display:flex; align-items:center; gap:0.5rem;">
                    ${getFlagImg(team.name)}
                    <span>${team.name}</span>
                  </div>
                </td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
                <td style="text-align:center;">0</td>
              </tr>
            `;
          });
          html += `
              </tbody>
            </table>
          `;
          card.innerHTML = html;
          container.appendChild(card);
        });
      }
      // Reorder logic for group predictions
      function renderGroupPredictions() {
        const container = document.getElementById('group-predictions-grid');
        if (!container) return;
        ensureValidGroupPredictions();
        const isGuest = !state.user;
        container.innerHTML = '';
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          if (!group || !Array.isArray(group.teams)) return;
          const card = document.createElement('div');
          card.className = 'wc-card';
          const title = document.createElement('div');
          title.className = 'wc-card-title';
          title.textContent = `${group.name} Prediction`;
          card.appendChild(title);
          const list = document.createElement('div');
          list.className = 'wc-reorder-list';
          list.id = `reorder-list-${groupKey}`;
          group.teams.forEach((team, index) => {
            const item = document.createElement('div');
            item.className = 'wc-reorder-item';
            item.draggable = !isGuest;
            item.dataset.teamName = team.name;
            item.dataset.groupKey = groupKey;
            item.dataset.index = index;
            if (!isGuest) {
              item.addEventListener('dragstart', handleDragStart);
              item.addEventListener('dragover', handleDragOver);
              item.addEventListener('drop', handleDrop);
              item.addEventListener('dragend', handleDragEnd);
            } else {
              item.style.cursor = 'pointer';
              item.addEventListener('click', () => requireLoginForPredictions());
            }
            let rankClass = 'q-fourth';
            let rankLabel = '4th';
            if (index === 0) { rankClass = 'q-first'; rankLabel = '1st'; }
            else if (index === 1) { rankClass = 'q-second'; rankLabel = '2nd'; }
            else if (index === 2) { rankClass = 'q-third'; rankLabel = '3rd'; }
            item.innerHTML = `
              <div class="wc-reorder-rank ${rankClass}">${rankLabel}</div>
              <div style="display:flex; align-items:center; gap:0.5rem; flex:1;">
                ${getFlagImg(team.name)}
                <span style="font-weight:600; font-size:0.9rem;">${team.name}</span>
              </div>
              <div class="wc-reorder-controls">
                <button class="wc-reorder-btn wc-move-up" title="Move Up">▲</button>
                <button class="wc-reorder-btn wc-move-down" title="Move Down">▼</button>
              </div>
            `;
            // Use closure-based event listeners instead of inline onclick
            // so buttons work even if window.moveTeam assignment hasn't run yet
            const upBtn = item.querySelector('.wc-move-up');
            const downBtn = item.querySelector('.wc-move-down');
            if (upBtn) {
              upBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isGuest) { requireLoginForPredictions(); return; }
                moveTeam(groupKey, index, -1);
              });
            }
            if (downBtn) {
              downBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (isGuest) { requireLoginForPredictions(); return; }
                moveTeam(groupKey, index, 1);
              });
            }
            list.appendChild(item);
          });
          card.appendChild(list);
          container.appendChild(card);
        });
      }
      let dragSourceItem = null;
      function handleDragStart(e) {
        if (!requireLoginForPredictions()) {
          e.preventDefault();
          return;
        }
        dragSourceItem = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        this.style.opacity = '0.5';
      }
      function handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        return false;
      }
      function hasBracketPredictions() {
        if (!window.bracketPredictor) return false;
        const bp = window.bracketPredictor;
        const overridesCount = bp.overrides ? Object.keys(bp.overrides).length : 0;
        const teamSlotsCount = bp.matches ? bp.matches.filter(m => m.home || m.away).length : 0;
        const winnersCount = bp.matches ? bp.matches.filter(m => m.winner !== null).length : 0;
        return overridesCount > 0 || teamSlotsCount > 0 || winnersCount > 0;
      }
      function clearBracketPredictions() {
        if (window.bracketPredictor) {
          window.bracketPredictor.overrides = {};
          if (typeof window.bracketPredictor.saveOverrides === 'function') {
            window.bracketPredictor.saveOverrides();
          }
          window.bracketPredictor.matches.forEach(m => {
            m.home = null;
            m.away = null;
            m.winner = null;
          });
          window.bracketPredictor.clearBracketSubmitted();
          window.bracketPredictor.saveBracket();
          window.bracketPredictor.updateDownloadButton();
        }
      }
      function handleDrop(e) {
        e.stopPropagation();
        if (!requireLoginForPredictions()) return false;
        if (dragSourceItem !== this && dragSourceItem.dataset.groupKey === this.dataset.groupKey) {
          if (hasBracketPredictions()) {
            const proceed = confirm("Changing group outcomes will reset your current manual bracket overrides and subsequent knockout predictions to align with the new standings. Do you want to proceed?");
            if (!proceed) return false;
            clearBracketPredictions();
          }
          const groupKey = this.dataset.groupKey;
          const fromIdx = parseInt(dragSourceItem.dataset.index);
          const toIdx = parseInt(this.dataset.index);
          const teams = groupPredictions[groupKey].teams;
          const temp = teams[fromIdx];
          teams.splice(fromIdx, 1);
          teams.splice(toIdx, 0, temp);
          // Persist BEFORE onGroupStandingsChanged so ensureValidGroupPredictions
          // won't overwrite the in-memory swap with stale localStorage data.
          localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
          onGroupStandingsChanged();
        }
        return false;
      }
      function handleDragEnd() {
        this.style.opacity = '1';
      }
      function moveTeam(groupKey, index, direction) {
        if (!requireLoginForPredictions()) return;
        const teams = groupPredictions[groupKey].teams;
        const targetIdx = index + direction;
        if (targetIdx < 0 || targetIdx >= teams.length) return;
        if (hasBracketPredictions()) {
          const proceed = confirm("Changing group outcomes will reset your current manual bracket overrides and subsequent knockout predictions to align with the new standings. Do you want to proceed?");
          if (!proceed) return;
          clearBracketPredictions();
        }
        const temp = teams[index];
        teams[index] = teams[targetIdx];
        teams[targetIdx] = temp;
        // Persist BEFORE onGroupStandingsChanged so ensureValidGroupPredictions
        // won't overwrite the in-memory swap with stale localStorage data.
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        onGroupStandingsChanged();
      }
      async function submitGroupPredictions() {
        if (!requireLoginForPredictions()) return;
        updateGroupStandingsStats();
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        localStorage.setItem(GROUP_RANKINGS_SUBMITTED_KEY, 'true');
        manualThirdPlace = { confirmed: false, groups: [] };
        saveManualThirdPlace();
        thirdPlaceDraft = [];
        if (window.bracketPredictor) {
          window.bracketPredictor.syncRound32Matchups();
          window.bracketPredictor.renderBracket();
        }
        openThirdPlaceSelection();
        const saved = await syncWcPredictionsToApi();
        updatePredictorProfile();
        if (saved) {
          showToast('Group rankings saved! Now choose the 8 third-place teams that advance.', 'success');
        }
        const panel = document.getElementById('third-place-selection-panel');
        if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Reset all World Cup predictions: group standings, third-place picks and the
      // knockout bracket — returning everything to its default, unpredicted state.
      async function resetPredictions() {
        if (!requireLoginForPredictions()) return;
        if (!confirm('Reset all your World Cup predictions? This clears your group rankings, third-place picks and the entire knockout bracket.')) return;

        groupPredictions = JSON.parse(JSON.stringify(wcGroups()));
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        localStorage.removeItem(GROUP_RANKINGS_SUBMITTED_KEY);

        matchPredictions = {};
        localStorage.setItem('wc_match_predictions', JSON.stringify(matchPredictions));
        awardPredictions = {};
        localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));

        manualThirdPlace = { confirmed: false, groups: [] };
        saveManualThirdPlace();
        thirdPlaceDraft = [];
        const panel = document.getElementById('third-place-selection-panel');
        if (panel) panel.style.display = 'none';

        if (window.bracketPredictor) {
          clearBracketPredictions();
          window.bracketPredictor.syncRound32Matchups();
          window.bracketPredictor.renderBracket();
        }

        updateGroupStandingsStats();
        renderGroupPredictions();
        renderGroupStandings();
        renderMatchPredictions();
        updateAwardsDisplay();
        renderBestThirdPlacedTable();
        updatePredictorProfile();
        const saved = await syncWcPredictionsToApi();
        if (saved) {
          showToast('All predictions have been reset.', 'success');
        }
      }

      // ── Interactive 3rd-place qualifier selection ──
      function openThirdPlaceSelection() {
        const panel = document.getElementById('third-place-selection-panel');
        if (!panel) return;
        panel.style.display = '';
        // Seed the draft from a previously confirmed selection, else the auto top-8.
        const valid = getBestThirdPlacedTeams().map(t => t.groupKey);
        if (manualThirdPlace.groups.length === 8 && manualThirdPlace.groups.every(g => valid.includes(g))) {
          thirdPlaceDraft = manualThirdPlace.groups.slice();
        } else {
          thirdPlaceDraft = valid.slice(0, 8);
        }
        renderThirdPlaceSelection();
      }

      function renderThirdPlaceSelection() {
        const grid = document.getElementById('third-place-grid');
        if (!grid) return;
        const thirds = getBestThirdPlacedTeams();
        grid.innerHTML = '';
        thirds.forEach(item => {
          const selected = thirdPlaceDraft.includes(item.groupKey);
          const card = document.createElement('div');
          card.className = 'tp-team-card' + (selected ? ' selected' : '');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-pressed', selected ? 'true' : 'false');
          card.onclick = () => toggleThirdPlaceTeam(item.groupKey);
          card.innerHTML = `
            ${getFlagImg(item.name)}
            <div style="display:flex;flex-direction:column;min-width:0;">
              <span class="tp-name">${item.name}</span>
              <span class="tp-group">Group ${item.groupKey}</span>
            </div>
            <span class="tp-check">${selected ? '✓' : ''}</span>
          `;
          grid.appendChild(card);
        });
        updateThirdPlaceCounter();
      }

      function toggleThirdPlaceTeam(groupKey) {
        if (!requireLoginForPredictions()) return;
        const idx = thirdPlaceDraft.indexOf(groupKey);
        const warning = document.getElementById('third-place-warning');
        if (idx > -1) {
          thirdPlaceDraft.splice(idx, 1);
          if (warning) warning.style.display = 'none';
        } else {
          if (thirdPlaceDraft.length >= 8) {
            if (warning) {
              warning.style.display = '';
              clearTimeout(warning._hideTimer);
              warning._hideTimer = setTimeout(() => { warning.style.display = 'none'; }, 2500);
            }
            return;
          }
          thirdPlaceDraft.push(groupKey);
        }
        renderThirdPlaceSelection();
      }

      function updateThirdPlaceCounter() {
        const counter = document.getElementById('third-place-counter');
        const btn = document.getElementById('confirm-third-place-btn');
        const count = thirdPlaceDraft.length;
        if (counter) {
          counter.textContent = `${count} / 8 selected`;
          counter.classList.toggle('complete', count === 8);
        }
        if (btn) btn.disabled = count !== 8 || !state.user;
      }

      async function confirmThirdPlaceQualifiers() {
        if (!requireLoginForPredictions()) return;
        if (thirdPlaceDraft.length !== 8) {
          showToast('Select exactly 8 third-place teams to continue.', 'error');
          return;
        }
        manualThirdPlace = { confirmed: true, groups: thirdPlaceDraft.slice() };
        saveManualThirdPlace();
        renderBestThirdPlacedTable();
        if (window.bracketPredictor) {
          window.bracketPredictor.syncRound32Matchups();
          window.bracketPredictor.renderBracket();
        }
        updatePredictorProfile();
        const saved = await syncWcPredictionsToApi();
        if (saved) {
          showToast('3rd place qualifiers confirmed! All 32 teams are set for the knockout bracket.', 'success');
        }
      }
      // Render upcoming match predictions
      function renderMatchPredictions() {
        const container = document.getElementById('wc-predictions-fixtures');
        if (!container) return;
        const fixtures = wcFixtures();
        const isGuest = !state.user;
        const inputAttrs = isGuest ? 'readonly onclick="requireLoginForPredictions()"' : '';
        container.innerHTML = '';
        if (!fixtures.length) {
          container.innerHTML = '<div style="padding:1.5rem;color:var(--text3);text-align:center">Match fixtures are loading…</div>';
          return;
        }
        fixtures.forEach(fixture => {
          const card = document.createElement('div');
          card.className = 'wc-pred-fixture-card';
          const pred = matchPredictions[fixture.id] || { homeScore: '', awayScore: '' };
          const hasPredicted = pred.homeScore !== '' && pred.awayScore !== '';
          const guestStyle = isGuest ? ' wc-pred-score-input--guest' : '';
          card.innerHTML = `
            <div class="wc-pred-fixture-meta">
              <span>${fixture.group}</span>
              <span>${fixture.date} • ${fixture.time}</span>
            </div>

            <div class="wc-pred-matchup">
              <div class="wc-pred-team wc-pred-team-home">
                <span class="wc-pred-flag">${getFlagImg(fixture.home)}</span>
                <span class="wc-pred-name" title="${fixture.home}">${fixture.home}</span>
              </div>
              <div class="wc-pred-scores">
                <input type="number" id="pred-home-${fixture.id}" class="wc-pred-score-input${guestStyle}" value="${pred.homeScore}" min="0" placeholder="-" ${inputAttrs}>
                <span class="wc-pred-vs">vs</span>
                <input type="number" id="pred-away-${fixture.id}" class="wc-pred-score-input${guestStyle}" value="${pred.awayScore}" min="0" placeholder="-" ${inputAttrs}>
              </div>
              <div class="wc-pred-team wc-pred-team-away">
                <span class="wc-pred-name" title="${fixture.away}">${fixture.away}</span>
                <span class="wc-pred-flag">${getFlagImg(fixture.away)}</span>
              </div>
            </div>

            <div class="wc-pred-venue">Venue: ${fixture.venue}</div>

            <div class="wc-pred-fixture-footer">
              <span id="pred-status-${fixture.id}" class="wc-pred-status${hasPredicted ? ' wc-pred-status--saved' : ''}">
                ${hasPredicted ? `Predicted: ${pred.homeScore} - ${pred.awayScore}` : 'Not Predicted'}
              </span>
              <button class="btn btn-ghost wc-pred-save-btn">${isGuest ? 'Log in to Predict' : 'Save Prediction'}</button>
            </div>
          `;
          const saveBtn = card.querySelector('.wc-pred-save-btn');
          if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              if (isGuest) { requireLoginForPredictions(); return; }
              saveMatchPrediction(fixture.id);
            });
          }
          container.appendChild(card);
        });
      }
      async function saveMatchPrediction(fixtureId) {
        if (!requireLoginForPredictions()) return;
        const homeVal = document.getElementById(`pred-home-${fixtureId}`).value;
        const awayVal = document.getElementById(`pred-away-${fixtureId}`).value;
        if (homeVal === '' || awayVal === '') {
          showToast('Please enter predicted goals for both teams!', 'error');
          return;
        }
        matchPredictions[fixtureId] = {
          homeScore: parseInt(homeVal),
          awayScore: parseInt(awayVal)
        };
        localStorage.setItem('wc_match_predictions', JSON.stringify(matchPredictions));
        const statusEl = document.getElementById(`pred-status-${fixtureId}`);
        if (statusEl) {
          statusEl.textContent = `Predicted: ${homeVal} - ${awayVal}`;
          statusEl.classList.add('wc-pred-status--saved');
        }
        updatePredictorProfile();
        const saved = await syncWcPredictionsToApi();
        if (saved) {
          showToast('Prediction saved successfully!', 'success');
        }
      }
      // Searchable Awards Modal System
      let currentModalAwardKey = null;
      let currentModalAwardTitle = '';
      let currentModalSearchQuery = '';
      let currentModalType = 'player';
      let currentModalFilterPosition = 'ALL';
      let currentModalFilterNation = 'ALL';
      let currentModalFilterClub = 'ALL';
      let currentModalSortBy = 'POPULARITY';
      function getPlayerGradient(position) {
        if (position === 'Forward') return 'linear-gradient(135deg, #ef4444, #f97316)';
        if (position === 'Midfielder') return 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
        if (position === 'Defender') return 'linear-gradient(135deg, #22c55e, #10b981)';
        return 'linear-gradient(135deg, #eab308, #ca8a04)';
      }
      function getEligiblePlayers() {
        const players = wcPlayers();
        if (currentModalAwardKey === 'golden-boot') {
          return players.filter(p => p.pos === 'Forward' || p.subPos === 'Attacking Midfielder');
        } else if (currentModalAwardKey === 'golden-glove') {
          return players.filter(p => p.pos === 'Goalkeeper');
        } else if (currentModalAwardKey === 'best-young') {
          return players.filter(p => p.age <= 22);
        }
        return players;
      }
      function openSelectorModal(awardKey, awardTitle, type) {
        if (!requireLoginForPredictions()) return;
        currentModalAwardKey = awardKey;
        currentModalAwardTitle = awardTitle;
        currentModalType = type;
        currentModalSearchQuery = '';
        currentModalFilterPosition = 'ALL';
        currentModalFilterNation = 'ALL';
        currentModalFilterClub = 'ALL';
        if (awardKey === 'golden-boot') {
          currentModalSortBy = 'GOALS';
        } else if (awardKey === 'golden-glove') {
          currentModalSortBy = 'CLEAN_SHEETS';
        } else if (awardKey === 'best-young') {
          currentModalSortBy = 'AGE';
        } else {
          currentModalSortBy = 'POPULARITY';
        }
        const modal = document.getElementById('wc-selector-modal');
        const title = document.getElementById('wc-modal-title');
        const subtitle = document.getElementById('wc-modal-subtitle');
        const searchInput = document.getElementById('wc-modal-search');
        if (!modal || !title || !searchInput) return;
        title.textContent = `Select ${awardTitle}`;
        subtitle.textContent = type === 'player' ? 'Choose from eligible players' : 'Choose from qualified nations';
        searchInput.value = '';
        searchInput.placeholder = type === 'player' ? 'Search player by name, team, club, position...' : 'Search country...';
        const clearBtn = document.getElementById('wc-modal-search-clear');
        if (clearBtn) clearBtn.style.display = 'none';
        const posGroup = document.getElementById('wc-filter-position-group');
        const clubGroup = document.getElementById('wc-filter-club-group');
        if (posGroup) posGroup.style.display = type === 'player' ? 'flex' : 'none';
        if (clubGroup) clubGroup.style.display = type === 'player' ? 'flex' : 'none';
        setupModalFilters();
        renderSelectorGrid();
        modal.style.display = 'flex';
      }
      function closeSelectorModal() {
        const modal = document.getElementById('wc-selector-modal');
        if (modal) modal.style.display = 'none';
      }
      function closeSelectorModalOutside(e) {
        if (e.target.id === 'wc-selector-modal') {
          closeSelectorModal();
        }
      }
      function filterSelectorItems(query) {
        currentModalSearchQuery = query;
        const clearBtn = document.getElementById('wc-modal-search-clear');
        if (clearBtn) {
          clearBtn.style.display = query.length > 0 ? 'inline' : 'none';
        }
        renderSelectorGrid();
      }
      function clearModalSearch() {
        const searchInput = document.getElementById('wc-modal-search');
        if (searchInput) {
          searchInput.value = '';
          filterSelectorItems('');
        }
      }
      function selectPositionFilter(pos, btn) {
        currentModalFilterPosition = pos;
        const container = document.getElementById('wc-modal-position-pills');
        if (container) {
          container.querySelectorAll('.wc-modal-pill').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');
        applyFilters();
      }
      function applyFilters() {
        const nationSelect = document.getElementById('wc-modal-filter-nation');
        const clubSelect = document.getElementById('wc-modal-filter-club');
        if (nationSelect) currentModalFilterNation = nationSelect.value;
        if (clubSelect) currentModalFilterClub = clubSelect.value;
        renderSelectorGrid();
      }
      function setupModalFilters() {
        const pillsContainer = document.getElementById('wc-modal-position-pills');
        if (pillsContainer) {
          if (currentModalType === 'team') {
            pillsContainer.innerHTML = '';
          } else {
            let positions = [];
            if (currentModalAwardKey === 'golden-boot') {
              positions = ['ALL', 'Forward', 'Midfielder'];
            } else if (currentModalAwardKey === 'golden-glove') {
              positions = ['Goalkeeper'];
            } else {
              positions = ['ALL', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
            }
            pillsContainer.innerHTML = positions.map(pos => {
              const label = pos === 'ALL' ? 'All' : pos;
              const activeClass = currentModalFilterPosition === pos ? 'wc-modal-pill active' : 'wc-modal-pill';
              return `<button class="${activeClass}" onclick="selectPositionFilter('${pos}', this)">${label}</button>`;
            }).join('');
          }
        }
        
        const nationSelect = document.getElementById('wc-modal-filter-nation');
        if (nationSelect) {
          let nations = [];
          if (currentModalType === 'team') {
            nations = wcTeams().map(t => t.name).sort();
          } else {
            const eligible = getEligiblePlayers();
            nations = [...new Set(eligible.map(p => p.team))].sort();
          }
          
          nationSelect.innerHTML = `<option value="ALL">All Nations</option>` + 
            nations.map(n => `<option value="${n}" ${currentModalFilterNation === n ? 'selected' : ''}>${n}</option>`).join('');
        }
        const clubSelect = document.getElementById('wc-modal-filter-club');
        if (clubSelect) {
          if (currentModalType === 'team') {
            clubSelect.innerHTML = `<option value="ALL">All Clubs</option>`;
          } else {
            const eligible = getEligiblePlayers();
            const clubs = [...new Set(eligible.map(p => p.club))].sort();
            clubSelect.innerHTML = `<option value="ALL">All Clubs</option>` + 
              clubs.map(c => `<option value="${c}" ${currentModalFilterClub === c ? 'selected' : ''}>${c}</option>`).join('');
          }
        }
        // Sort dropdown removed – default sort applied automatically in renderSelectorGrid
      }
      function renderSelectorGrid() {
        const grid = document.getElementById('wc-modal-grid');
        const emptyState = document.getElementById('wc-modal-empty');
        if (!grid || !emptyState) return;
        grid.innerHTML = '';
        emptyState.style.display = 'none';
        const query = currentModalSearchQuery.toLowerCase().trim();
        if (currentModalType === 'player') {
          let list = getEligiblePlayers();
          if (!wcPlayers().length) {
            emptyState.textContent = 'Player database is still loading. Please refresh and try again.';
            emptyState.style.display = 'block';
            return;
          }
          if (query.length > 0) {
            list = list.filter(p => 
              p.name.toLowerCase().includes(query) ||
              p.team.toLowerCase().includes(query) ||
              p.club.toLowerCase().includes(query) ||
              p.pos.toLowerCase().includes(query) ||
              p.subPos.toLowerCase().includes(query)
            );
          }
          if (currentModalFilterPosition !== 'ALL') {
            list = list.filter(p => p.pos === currentModalFilterPosition);
          }
          if (currentModalFilterNation !== 'ALL') {
            list = list.filter(p => p.team === currentModalFilterNation);
          }
          if (currentModalFilterClub !== 'ALL') {
            list = list.filter(p => p.club === currentModalFilterClub);
          }
          // Default sort: popularity first, form as tiebreaker
          list.sort((a, b) => {
            const popDiff = (b.popularity || 0) - (a.popularity || 0);
            if (popDiff !== 0) return popDiff;
            return (b.form || 0) - (a.form || 0);
          });
          if (list.length === 0) {
            emptyState.style.display = 'block';
            return;
          }
          list.forEach(p => {
            const initials = p.name.split(' ').map(n => n[0]).join('');
            const grad = getPlayerGradient(p.pos);
            const isFav = p.popularity >= 90;
            const favBadge = isFav ? `<div class="wc-card-fav-badge"><span style="color:var(--gold)">★</span> Favorite</div>` : '';
            
            let statsHtml = '';
            if (p.pos === 'Goalkeeper') {
              statsHtml = `
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Clean Sheets</div>
                  <div class="wc-card-stat-val">${p.cleanSheets || 0}</div>
                </div>
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Saves (Save %)</div>
                  <div class="wc-card-stat-val">${p.saves || 0} (${p.savePct || 0}%)</div>
                </div>
              `;
            } else {
              statsHtml = `
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Goals</div>
                  <div class="wc-card-stat-val">${p.goals || 0}</div>
                </div>
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Assists</div>
                  <div class="wc-card-stat-val">${p.assists || 0}</div>
                </div>
              `;
            }
            const card = document.createElement('div');
            card.className = `wc-modal-player-card ${isFav ? 'favorite' : ''}`;
            if (!state.user) {
              card.style.cursor = 'pointer';
              card.addEventListener('click', (e) => {
                if (e.target.closest('.wc-card-select-btn')) return;
                requireLoginForPredictions();
              });
            }
            card.innerHTML = `
              ${favBadge}
              <div class="wc-card-player-hero">
                <div class="wc-card-avatar-frame" style="background:${grad}">
                  <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; position:absolute; top:0; left:0; display:flex; align-items:center; justify-content:center;">
                    <span class="wc-card-avatar-initials">${initials}</span>
                    <img class="wc-card-avatar-img" data-player="${p.name}" src="" ${PLAYER_PHOTO_IMG_ATTRS}>
                  </div>
                  <div class="wc-card-avatar-pos">${p.pos[0]}</div>
                </div>
                <div class="wc-card-player-info">
                  <div class="wc-card-player-name" title="${p.name}">${p.name}</div>
                  <div class="wc-card-player-club" title="${p.club}">${p.club}</div>
                </div>
              </div>
              <div class="wc-card-player-nation">
                ${getFlagImg(p.team)}
                <span>${p.team}</span>
              </div>
              <div class="wc-card-stats-grid">
                ${statsHtml}
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Caps</div>
                  <div class="wc-card-stat-val">${p.caps || 0}</div>
                </div>
                <div class="wc-card-stat-box">
                  <div class="wc-card-stat-lbl">Market Value</div>
                  <div class="wc-card-stat-val">€${p.marketValue}M</div>
                </div>
              </div>
              <div class="wc-card-meta-row">
                <span>Age: <strong>${p.age}</strong></span>
                <span class="wc-card-form-badge">
                  <span>${p.formIndicator.split(' ')[0]}</span>
                  <span>Form: ${p.form.toFixed(1)}</span>
                </span>
              </div>
              <button class="wc-card-select-btn" onclick="${state.user ? `selectSelectorItemFromModal('${p.name.replace(/'/g, "\\'")}')` : 'requireLoginForPredictions()'}">${state.user ? 'Select Player' : 'Log in to Select'}</button>
            `;
            grid.appendChild(card);
          });
          // Asynchronously fetch and load player photos in the modal grid
          grid.querySelectorAll('.wc-card-avatar-img').forEach(img => {
            const playerName = img.getAttribute('data-player');
            getPlayerPhoto(playerName, (url) => {
              if (url) {
                img.src = url;
              }
            });
          });
        } else {
          let list = [...wcTeams()];
          if (query.length > 0) {
            list = list.filter(t => t.name.toLowerCase().includes(query) || t.confederation.toLowerCase().includes(query));
          }
          if (currentModalFilterNation !== 'ALL') {
            list = list.filter(t => t.name === currentModalFilterNation);
          }
          // Default sort: FIFA Ranking
          list.sort((a, b) => a.ranking - b.ranking);
          if (list.length === 0) {
            emptyState.style.display = 'block';
            return;
          }
          list.forEach(t => {
            const card = document.createElement('div');
            card.className = 'wc-modal-team-card';
            if (!state.user) {
              card.style.cursor = 'pointer';
              card.addEventListener('click', (e) => {
                if (e.target.closest('.wc-card-select-btn')) return;
                requireLoginForPredictions();
              });
            }
            card.innerHTML = `
              <div class="wc-card-flag-lg">${getFlagImg(t.name)}</div>
              <div class="wc-card-team-name">${t.name}</div>
              <div class="wc-card-team-confed">${t.confederation}</div>
              
              <div class="wc-card-team-stats">
                <div>
                  <div style="font-size:0.6rem; color:var(--text3); text-transform:uppercase;">FIFA Rank</div>
                  <div style="font-weight:700; font-size:0.95rem; color:var(--gold);">#${t.ranking}</div>
                </div>
              </div>
              <div class="wc-card-team-recent" title="${t.recent}">
                ${t.recent}
              </div>
              <button class="wc-card-select-btn" style="width:100%; margin-top:auto;" onclick="${state.user ? `selectSelectorItemFromModal('${t.name.replace(/'/g, "\\'")}')` : 'requireLoginForPredictions()'}">${state.user ? 'Select Team' : 'Log in to Select'}</button>
            `;
            grid.appendChild(card);
          });
        }
      }
      async function selectSelectorItemFromModal(name) {
        if (!requireLoginForPredictions()) return;
        if (currentModalType === 'team') {
          awardPredictions[currentModalAwardKey] = name;
        } else {
          const player = wcPlayers().find(p => p.name === name);
          if (player) {
            awardPredictions[currentModalAwardKey] = player;
          }
        }
        localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));
        updateAwardsDisplay();
        closeSelectorModal();
        showToast(`Selected ${name} for ${currentModalAwardTitle}. Click Submit Player Predictions to save.`, 'success');
      }

      async function submitAwardPredictions() {
        if (!requireLoginForPredictions()) return;
        if (!Object.keys(awardPredictions).length) {
          showToast('Select at least one player or award prediction first.', 'info');
          return;
        }
        localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));
        const saved = await syncWcPredictionsToApi();
        updatePredictorProfile();
        if (saved) {
          showToast('Player and award predictions saved!', 'success');
        }
      }

      async function resetAwardPredictions() {
        if (!requireLoginForPredictions()) return;
        if (!Object.keys(awardPredictions).length) {
          showToast('No player or award predictions to reset.', 'info');
          return;
        }
        if (!confirm('Reset all your player and award predictions?')) return;
        awardPredictions = {};
        localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));
        updateAwardsDisplay();
        updatePredictorProfile();
        const saved = await syncWcPredictionsToApi();
        if (saved) {
          showToast('Player and award predictions reset.', 'success');
        }
      }

      function updateAwardsDisplay() {
        renderAwardsGrid();
      }

      const WC_TROPHY_IMG = 'world-cup-trophy.png';

      function wcTrophyIconMarkup(extraClass = '') {
        const cls = ['wc-trophy-icon', extraClass].filter(Boolean).join(' ');
        return `<img src="${WC_TROPHY_IMG}" alt="" class="${cls}" draggable="false">`;
      }

      const AWARD_ICON_RENDERERS = {
        'golden-boot'() {
          return '<img src="golden-boot.png" alt="" class="wc-award-icon-img wc-golden-boot-img" draggable="false">';
        },
        'golden-ball'() {
          return '<img src="golden-ball.png" alt="" class="wc-award-icon-img wc-golden-ball-img" draggable="false">';
        },
        'golden-glove'() {
          return '<img src="golden-glove.png" alt="" class="wc-award-icon-img wc-golden-glove-img" draggable="false">';
        },
        'best-young'() {
          return '<img src="best-young.png" alt="" class="wc-award-icon-img wc-best-young-img" draggable="false">';
        },
        'world-champion'() {
          return wcTrophyIconMarkup('wc-award-icon-img wc-world-cup-trophy-img');
        },
      };

      function awardIconMarkup(award, uid) {
        const renderer = award.iconType && AWARD_ICON_RENDERERS[award.iconType];
        if (renderer) return renderer(uid);
        return award.iconHtml || award.icon;
      }

      function awardIconClass(award, baseClass) {
        return (award.iconHtml || award.iconType) ? `${baseClass} ${baseClass}--custom` : baseClass;
      }

      function renderAwardsGrid() {
        const grid = document.getElementById('wc-awards-grid');
        if (!grid) return;
        const awardsConfig = [
          {
            key: 'golden-boot',
            title: 'Golden Boot',
            subtitle: 'Top Goalscorer',
            iconType: 'golden-boot',
            desc: 'Attacking players (forwards, strikers, wingers, attacking mids) participating in the tournament.',
            type: 'player'
          },
          {
            key: 'golden-ball',
            title: 'Golden Ball',
            subtitle: 'Player of the Tournament',
            iconType: 'golden-ball',
            desc: 'Best player of the tournament, open to all players regardless of position.',
            type: 'player'
          },
          {
            key: 'golden-glove',
            title: 'Golden Glove',
            subtitle: 'Best Goalkeeper',
            iconType: 'golden-glove',
            desc: 'Outstanding goalkeeper of the tournament, restricted to goalkeepers.',
            type: 'player'
          },
          {
            key: 'best-young',
            title: 'Best Young Player',
            subtitle: 'U-22 Star of the Tournament',
            iconType: 'best-young',
            desc: 'Best performing young player under FIFA age requirements (age 22 or under).',
            type: 'player'
          },
          {
            key: 'world-champion',
            title: 'World Champion',
            subtitle: 'Tournament Winner',
            iconType: 'world-champion',
            desc: 'Select the nation you predict will lift the FIFA World Cup 2026 trophy.',
            type: 'team'
          }
        ];
        grid.innerHTML = awardsConfig.map(award => {
          const pred = resolveAwardPrediction(award.key, awardPredictions[award.key]);
          const isSelected = !!pred;
          const cardClass = isSelected ? 'wc-award-card selected' : 'wc-award-card';
          let selectionHtml = '';
          if (isSelected) {
            if (award.type === 'team') {
              const teamName = typeof pred === 'string' ? pred : pred.name;
              const teamObj = wcTeams().find(t => t.name === teamName) || { name: teamName, ranking: 'N/A', confederation: 'N/A', recent: 'N/A' };
              selectionHtml = `
                <div class="wc-award-selected-team-card">
                  <div class="wc-selected-team-flag">${getFlagImg(teamObj.name)}</div>
                  <div class="wc-selected-team-details">
                    <div class="wc-selected-team-name">${teamObj.name}</div>
                    <div class="wc-selected-team-meta">
                      <span>Rank: #${teamObj.ranking}</span>
                      <span>•</span>
                      <span>${teamObj.confederation}</span>
                    </div>
                    <div class="wc-selected-team-performance" title="${teamObj.recent}">${teamObj.recent}</div>
                  </div>
                </div>
              `;
            } else if (typeof pred === 'object' && pred.name) {
              const initials = pred.name.split(' ').map(n => n[0]).join('');
              const grad = getPlayerGradient(pred.pos);
              selectionHtml = `
                <div class="wc-award-selected-player-card">
                  <div class="wc-selected-player-badge" style="background:${grad}; position:relative;">
                    <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; position:absolute; top:0; left:0; display:flex; align-items:center; justify-content:center;">
                      <span class="wc-selected-player-initials">${initials}</span>
                      <img class="wc-selected-player-img" data-player="${pred.name}" src="" ${PLAYER_PHOTO_IMG_ATTRS}>
                    </div>
                  </div>
                  <div class="wc-selected-player-details">
                    <div class="wc-selected-player-name">${pred.name}</div>
                    <div class="wc-selected-player-meta">
                      ${getFlagImg(pred.team)}
                      <span>${pred.team}</span>
                      <span>•</span>
                      <span>${pred.pos}</span>
                    </div>
                    <div class="wc-selected-player-stats">Stats: ${pred.stats || ''}</div>
                    <div style="font-size:0.65rem; color:var(--success); font-weight:600; margin-top:0.15rem;">
                      Age: ${pred.age} • ${pred.formIndicator || '⭐ Stable'}
                    </div>
                  </div>
                </div>
              `;
            } else {
              const name = typeof pred === 'string' ? pred : 'Selected';
              selectionHtml = `
                <div class="${awardIconClass(award, 'wc-award-icon-placeholder')}">${awardIconMarkup(award, award.key + '-sel')}</div>
                <p style="font-size:0.85rem;color:var(--text);font-weight:600;margin-bottom:0.5rem">${name}</p>
              `;
            }
          } else {
            selectionHtml = `
              <div class="${awardIconClass(award, 'wc-award-icon-placeholder')}">${awardIconMarkup(award, award.key + '-ph')}</div>
              <p style="font-size:0.75rem; color:var(--text2); margin-bottom:1.5rem; line-height:1.4;">${award.desc}</p>
            `;
          }
          const buttonText = isSelected ? 'Change Selection' : 'Select Prediction';
          const buttonClass = isSelected ? 'btn btn-ghost' : 'btn btn-primary';
          return `
            <div class="${cardClass}">
              <div style="display:flex; align-items:center; gap:0.75rem; width:100%; margin-bottom:1.25rem;">
                <div class="${awardIconClass(award, 'wc-award-badge')}">${awardIconMarkup(award, award.key + '-badge')}</div>
                <div class="wc-award-header-info">
                  <span class="wc-award-title-sm">${award.title}</span>
                  <span class="wc-award-sub-sm">${award.subtitle}</span>
                </div>
              </div>
              
              <div style="width:100%; flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                ${selectionHtml}
              </div>
              
              <button class="${buttonClass}" style="width:100%; margin-top:1.25rem; justify-content:center;" onclick="openSelectorModal('${award.key}', '${award.title}', '${award.type}')">
                ${buttonText}
              </button>
            </div>
          `;
        }).join('');
        // Asynchronously fetch and load selected player photos on the dashboard
        grid.querySelectorAll('.wc-selected-player-img').forEach(img => {
          const playerName = img.getAttribute('data-player');
          getPlayerPhoto(playerName, (url) => {
            if (url) {
              img.src = url;
            }
          });
        });
      }
      function updatePredictorProfile() {
        if (!state.user) {
          updatePredictorProfileFromApi({ total_points: 0, accuracy: '0%', tier: 'Unranked' });
          return;
        }
        if (state.wcMe) updatePredictorProfileFromApi(state.wcMe);
        apiRequest('/api/wc/me')
          .then(me => {
            state.wcMe = me;
            updatePredictorProfileFromApi(me);
          })
          .catch(() => {});
      }
      // Bracket Predictor Class — Symmetric Template
      class BracketPredictor {
        constructor() {
          // 31 matches: 0-15 R32, 16-23 R16, 24-27 QF, 28-29 SF, 30 Final (no third-place)
          this.rounds = [
            { name: 'Round of 32', key: 'r32', matchCount: 16, startIdx: 0 },
            { name: 'Round of 16', key: 'r16', matchCount: 8, startIdx: 16 },
            { name: 'Quarter-Finals', key: 'qf', matchCount: 4, startIdx: 24 },
            { name: 'Semi-Finals', key: 'sf', matchCount: 2, startIdx: 28 },
            { name: 'Final', key: 'final', matchCount: 1, startIdx: 30 }
          ];
          this.totalMatches = 31;
          this.matches = Array.from({ length: this.totalMatches }, (_, i) => ({
            id: i, home: null, away: null, winner: null
          }));
          this.activeDropdown = null;
          this.storageKey = 'wc_bracket_state_official_slots_v1';
          this.submittedKey = BRACKET_SUBMITTED_KEY;
        }

        isBracketComplete() {
          return this.matches.every(m => !!m.winner);
        }

        isBracketSubmitted() {
          if (localStorage.getItem(this.submittedKey) !== '1') return false;
          if (this.isBracketComplete()) return true;
          return bracketStorageHasCompleteWinners();
        }

        markBracketSubmitted() {
          localStorage.setItem(this.submittedKey, '1');
        }

        clearBracketSubmitted() {
          localStorage.removeItem(this.submittedKey);
        }

        _requireBracketAuth() {
          if (state.user) return true;
          showToast('Please log in to use the Knockout Bracket Predictor.', 'warning');
          openModal('login');
          return false;
        }

        // ── Slot designation for R32 matchups ──
        getSlotDesignation(matchId, side) {
          const mapping = {
            '0-home': '2A', '0-away': '2B',
            '1-home': '1E', '1-away': '3@1E',
            '2-home': '1F', '2-away': '2C',
            '3-home': '1C', '3-away': '2F',
            '4-home': '1I', '4-away': '3@1I',
            '5-home': '2E', '5-away': '2I',
            '6-home': '1A', '6-away': '3@1A',
            '7-home': '1L', '7-away': '3@1L',
            '8-home': '1D', '8-away': '3@1D',
            '9-home': '1G', '9-away': '3@1G',
            '10-home': '2K', '10-away': '2L',
            '11-home': '1H', '11-away': '2J',
            '12-home': '1B', '12-away': '3@1B',
            '13-home': '1J', '13-away': '2H',
            '14-home': '1K', '14-away': '3@1K',
            '15-home': '2D', '15-away': '2G'
          };
          return mapping[`${matchId}-${side}`] || 'TBD';
        }

        getTeamByDesignation(code) {
          if (!code) return null;
          code = this.resolveSlotDesignation(code);
          if (!code) return null;
          const groupKey = code.substring(1);
          const rank = parseInt(code.substring(0, 1)) - 1;
          // Prefer real standings data when group stage is complete
          if (hasRealGroupStageComplete()) {
            const realGroups = getRealGroupPredictions();
            if (realGroups && realGroups[groupKey]) {
              return realGroups[groupKey].teams[rank] || null;
            }
          }
          const group = groupPredictions[groupKey];
          return group ? group.teams[rank] : null;
        }

        getThirdPlaceSlotOrder() {
          return ['1A', '1B', '1D', '1E', '1G', '1I', '1K', '1L'];
        }

        getThirdPlaceMapping() {
          if (this._thirdPlaceMapping) return this._thirdPlaceMapping;
          const compact = 'ABCDEFGH:HGBCAFDE|ABCDEFGI:CGBDAFEI|ABCDEFGJ:CGBDAFEJ|ABCDEFGK:CGBDAFEK|ABCDEFGL:CGBDAFLE|ABCDEFHI:HEBCAFDI|ABCDEFHJ:HJBCAFDE|ABCDEFHK:HEBCAFDK|ABCDEFHL:HFBCADLE|ABCDEFIJ:CJBDAFEI|ABCDEFIK:CEBDAFIK|ABCDEFIL:CEBDAFLI|ABCDEFJK:CJBDAFEK|ABCDEFJL:CJBDAFLE|ABCDEFKL:CEBDAFLK|ABCDEGHI:HGBCADEI|ABCDEGHJ:HGBCADEJ|ABCDEGHK:HGBCADEK|ABCDEGHL:HGBCADLE|ABCDEGIJ:EGBCADIJ|ABCDEGIK:EGBCADIK|ABCDEGIL:EGBCADLI|ABCDEGJK:EGBCADJK|ABCDEGJL:EGBCADLJ|ABCDEGKL:EGBCADLK|ABCDEHIJ:HJBCADEI|ABCDEHIK:HEBCADIK|ABCDEHIL:HEBCADLI|ABCDEHJK:HJBCADEK|ABCDEHJL:HJBCADLE|ABCDEHKL:HEBCADLK|ABCDEIJK:EJBCADIK|ABCDEIJL:EJBCADLI|ABCDEIKL:EIBCADLK|ABCDEJKL:EJBCADLK|ABCDFGHI:HGBCAFDI|ABCDFGHJ:HGBCAFDJ|ABCDFGHK:HGBCAFDK|ABCDFGHL:CGBDAFLH|ABCDFGIJ:CGBDAFIJ|ABCDFGIK:CGBDAFIK|ABCDFGIL:CGBDAFLI|ABCDFGJK:CGBDAFJK|ABCDFGJL:CGBDAFLJ|ABCDFGKL:CGBDAFLK|ABCDFHIJ:HJBCAFDI|ABCDFHIK:HFBCADIK|ABCDFHIL:HFBCADLI|ABCDFHJK:HJBCAFDK|ABCDFHJL:CJBDAFLH|ABCDFHKL:HFBCADLK|ABCDFIJK:CJBDAFIK|ABCDFIJL:CJBDAFLI|ABCDFIKL:CIBDAFLK|ABCDFJKL:CJBDAFLK|ABCDGHIJ:HGBCADIJ|ABCDGHIK:HGBCADIK|ABCDGHIL:HGBCADLI|ABCDGHJK:HGBCADJK|ABCDGHJL:HGBCADLJ|ABCDGHKL:HGBCADLK|ABCDGIJK:CJBDAGIK|ABCDGIJL:CJBDAGLI|ABCDGIKL:IGBCADLK|ABCDGJKL:CJBDAGLK|ABCDHIJK:HJBCADIK|ABCDHIJL:HJBCADLI|ABCDHIKL:HIBCADLK|ABCDHJKL:HJBCADLK|ABCDIJKL:IJBCADLK|ABCEFGHI:HGBCAFEI|ABCEFGHJ:HGBCAFEJ|ABCEFGHK:HGBCAFEK|ABCEFGHL:HGBCAFLE|ABCEFGIJ:EGBCAFIJ|ABCEFGIK:EGBCAFIK|ABCEFGIL:EGBCAFLI|ABCEFGJK:EGBCAFJK|ABCEFGJL:EGBCAFLJ|ABCEFGKL:EGBCAFLK|ABCEFHIJ:HJBCAFEI|ABCEFHIK:HEBCAFIK|ABCEFHIL:HEBCAFLI|ABCEFHJK:HJBCAFEK|ABCEFHJL:HJBCAFLE|ABCEFHKL:HEBCAFLK|ABCEFIJK:EJBCAFIK|ABCEFIJL:EJBCAFLI|ABCEFIKL:EIBCAFLK|ABCEFJKL:EJBCAFLK|ABCEGHIJ:HJBCAGEI|ABCEGHIK:EGBCAHIK|ABCEGHIL:EGBCAHLI|ABCEGHJK:HJBCAGEK|ABCEGHJL:HJBCAGLE|ABCEGHKL:EGBCAHLK|ABCEGIJK:EJBCAGIK|ABCEGIJL:EJBCAGLI|ABCEGIKL:EGBAICLK|ABCEGJKL:EJBCAGLK|ABCEHIJK:EJBCAHIK|ABCEHIJL:EJBCAHLI|ABCEHIKL:EIBCAHLK|ABCEHJKL:EJBCAHLK|ABCEIJKL:EJBAICLK|ABCFGHIJ:HGBCAFIJ|ABCFGHIK:HGBCAFIK|ABCFGHIL:HGBCAFLI|ABCFGHJK:HGBCAFJK|ABCFGHJL:HGBCAFLJ|ABCFGHKL:HGBCAFLK|ABCFGIJK:CJBFAGIK|ABCFGIJL:CJBFAGLI|ABCFGIKL:IGBCAFLK|ABCFGJKL:CJBFAGLK|ABCFHIJK:HJBCAFIK|ABCFHIJL:HJBCAFLI|ABCFHIKL:HIBCAFLK|ABCFHJKL:HJBCAFLK|ABCFIJKL:IJBCAFLK|ABCGHIJK:HJBCAGIK|ABCGHIJL:HJBCAGLI|ABCGHIKL:IGBCAHLK|ABCGHJKL:HJBCAGLK|ABCGIJKL:IJBCAGLK|ABCHIJKL:IJBCAHLK|ABDEFGHI:HGBDAFEI|ABDEFGHJ:HGBDAFEJ|ABDEFGHK:HGBDAFEK|ABDEFGHL:HGBDAFLE|ABDEFGIJ:EGBDAFIJ|ABDEFGIK:EGBDAFIK|ABDEFGIL:EGBDAFLI|ABDEFGJK:EGBDAFJK|ABDEFGJL:EGBDAFLJ|ABDEFGKL:EGBDAFLK|ABDEFHIJ:HJBDAFEI|ABDEFHIK:HEBDAFIK|ABDEFHIL:HEBDAFLI|ABDEFHJK:HJBDAFEK|ABDEFHJL:HJBDAFLE|ABDEFHKL:HEBDAFLK|ABDEFIJK:EJBDAFIK|ABDEFIJL:EJBDAFLI|ABDEFIKL:EIBDAFLK|ABDEFJKL:EJBDAFLK|ABDEGHIJ:HJBDAGEI|ABDEGHIK:EGBDAHIK|ABDEGHIL:EGBDAHLI|ABDEGHJK:HJBDAGEK|ABDEGHJL:HJBDAGLE|ABDEGHKL:EGBDAHLK|ABDEGIJK:EJBDAGIK|ABDEGIJL:EJBDAGLI|ABDEGIKL:EGBAIDLK|ABDEGJKL:EJBDAGLK|ABDEHIJK:EJBDAHIK|ABDEHIJL:EJBDAHLI|ABDEHIKL:EIBDAHLK|ABDEHJKL:EJBDAHLK|ABDEIJKL:EJBAIDLK|ABDFGHIJ:HGBDAFIJ|ABDFGHIK:HGBDAFIK|ABDFGHIL:HGBDAFLI|ABDFGHJK:HGBDAFJK|ABDFGHJL:HGBDAFLJ|ABDFGHKL:HGBDAFLK|ABDFGIJK:FJBDAGIK|ABDFGIJL:FJBDAGLI|ABDFGIKL:IGBDAFLK|ABDFGJKL:FJBDAGLK|ABDFHIJK:HJBDAFIK|ABDFHIJL:HJBDAFLI|ABDFHIKL:HIBDAFLK|ABDFHJKL:HJBDAFLK|ABDFIJKL:IJBDAFLK|ABDGHIJK:HJBDAGIK|ABDGHIJL:HJBDAGLI|ABDGHIKL:IGBDAHLK|ABDGHJKL:HJBDAGLK|ABDGIJKL:IJBDAGLK|ABDHIJKL:IJBDAHLK|ABEFGHIJ:HJBFAGEI|ABEFGHIK:EGBFAHIK|ABEFGHIL:EGBFAHLI|ABEFGHJK:HJBFAGEK|ABEFGHJL:HJBFAGLE|ABEFGHKL:EGBFAHLK|ABEFGIJK:EJBFAGIK|ABEFGIJL:EJBFAGLI|ABEFGIKL:EGBAIFLK|ABEFGJKL:EJBFAGLK|ABEFHIJK:EJBFAHIK|ABEFHIJL:EJBFAHLI|ABEFHIKL:EIBFAHLK|ABEFHJKL:EJBFAHLK|ABEFIJKL:EJBAIFLK|ABEGHIJK:EJBAHGIK|ABEGHIJL:EJBAHGLI|ABEGHIKL:EGBAIHLK|ABEGHJKL:EJBAHGLK|ABEGIJKL:EJBAIGLK|ABEHIJKL:EJBAIHLK|ABFGHIJK:HJBFAGIK|ABFGHIJL:HJBFAGLI|ABFGHIKL:HGBAIFLK|ABFGHJKL:HJBFAGLK|ABFGIJKL:IJBFAGLK|ABFHIJKL:HJBAIFLK|ABGHIJKL:HJBAIGLK|ACDEFGHI:HGECAFDI|ACDEFGHJ:HGJCAFDE|ACDEFGHK:HGECAFDK|ACDEFGHL:HGFCADLE|ACDEFGIJ:CGJDAFEI|ACDEFGIK:CGEDAFIK|ACDEFGIL:CGEDAFLI|ACDEFGJK:CGJDAFEK|ACDEFGJL:CGJDAFLE|ACDEFGKL:CGEDAFLK|ACDEFHIJ:HJECAFDI|ACDEFHIK:HEFCADIK|ACDEFHIL:HEFCADLI|ACDEFHJK:HJECAFDK|ACDEFHJL:HJFCADLE|ACDEFHKL:HEFCADLK|ACDEFIJK:CJEDAFIK|ACDEFIJL:CJEDAFLI|ACDEFIKL:CEIDAFLK|ACDEFJKL:CJEDAFLK|ACDEGHIJ:HGJCADEI|ACDEGHIK:HGECADIK|ACDEGHIL:HGECADLI|ACDEGHJK:HGJCADEK|ACDEGHJL:HGJCADLE|ACDEGHKL:HGECADLK|ACDEGIJK:EGJCADIK|ACDEGIJL:EGJCADLI|ACDEGIKL:EGICADLK|ACDEGJKL:EGJCADLK|ACDEHIJK:HJECADIK|ACDEHIJL:HJECADLI|ACDEHIKL:HEICADLK|ACDEHJKL:HJECADLK|ACDEIJKL:EJICADLK|ACDFGHIJ:HGJCAFDI|ACDFGHIK:HGFCADIK|ACDFGHIL:HGFCADLI|ACDFGHJK:HGJCAFDK|ACDFGHJL:CGJDAFLH|ACDFGHKL:HGFCADLK|ACDFGIJK:CGJDAFIK|ACDFGIJL:CGJDAFLI|ACDFGIKL:CGIDAFLK|ACDFGJKL:CGJDAFLK|ACDFHIJK:HJFCADIK|ACDFHIJL:HJFCADLI|ACDFHIKL:HFICADLK|ACDFHJKL:HJFCADLK|ACDFIJKL:CJIDAFLK|ACDGHIJK:HGJCADIK|ACDGHIJL:HGJCADLI|ACDGHIKL:HGICADLK|ACDGHJKL:HGJCADLK|ACDGIJKL:IGJCADLK|ACDHIJKL:HJICADLK|ACEFGHIJ:HGJCAFEI|ACEFGHIK:HGECAFIK|ACEFGHIL:HGECAFLI|ACEFGHJK:HGJCAFEK|ACEFGHJL:HGJCAFLE|ACEFGHKL:HGECAFLK|ACEFGIJK:EGJCAFIK|ACEFGIJL:EGJCAFLI|ACEFGIKL:EGICAFLK|ACEFGJKL:EGJCAFLK|ACEFHIJK:HJECAFIK|ACEFHIJL:HJECAFLI|ACEFHIKL:HEICAFLK|ACEFHJKL:HJECAFLK|ACEFIJKL:EJICAFLK|ACEGHIJK:EGJCAHIK|ACEGHIJL:EGJCAHLI|ACEGHIKL:EGICAHLK|ACEGHJKL:EGJCAHLK|ACEGIJKL:EJICAGLK|ACEHIJKL:EJICAHLK|ACFGHIJK:HGJCAFIK|ACFGHIJL:HGJCAFLI|ACFGHIKL:HGICAFLK|ACFGHJKL:HGJCAFLK|ACFGIJKL:IGJCAFLK|ACFHIJKL:HJICAFLK|ACGHIJKL:HJICAGLK|ADEFGHIJ:HGJDAFEI|ADEFGHIK:HGEDAFIK|ADEFGHIL:HGEDAFLI|ADEFGHJK:HGJDAFEK|ADEFGHJL:HGJDAFLE|ADEFGHKL:HGEDAFLK|ADEFGIJK:EGJDAFIK|ADEFGIJL:EGJDAFLI|ADEFGIKL:EGIDAFLK|ADEFGJKL:EGJDAFLK|ADEFHIJK:HJEDAFIK|ADEFHIJL:HJEDAFLI|ADEFHIKL:HEIDAFLK|ADEFHJKL:HJEDAFLK|ADEFIJKL:EJIDAFLK|ADEGHIJK:EGJDAHIK|ADEGHIJL:EGJDAHLI|ADEGHIKL:EGIDAHLK|ADEGHJKL:EGJDAHLK|ADEGIJKL:EJIDAGLK|ADEHIJKL:EJIDAHLK|ADFGHIJK:HGJDAFIK|ADFGHIJL:HGJDAFLI|ADFGHIKL:HGIDAFLK|ADFGHJKL:HGJDAFLK|ADFGIJKL:IGJDAFLK|ADFHIJKL:HJIDAFLK|ADGHIJKL:HJIDAGLK|AEFGHIJK:EGJFAHIK|AEFGHIJL:EGJFAHLI|AEFGHIKL:EGIFAHLK|AEFGHJKL:EGJFAHLK|AEFGIJKL:EJIFAGLK|AEFHIJKL:EJIFAHLK|AEGHIJKL:EJIAHGLK|AFGHIJKL:HJIFAGLK|BCDEFGHI:CGBDHFEI|BCDEFGHJ:HGBCJFDE|BCDEFGHK:CGBDHFEK|BCDEFGHL:CGBDHFLE|BCDEFGIJ:CGBDJFEI|BCDEFGIK:CGBDEFIK|BCDEFGIL:CGBDEFLI|BCDEFGJK:CGBDJFEK|BCDEFGJL:CGBDJFLE|BCDEFGKL:CGBDEFLK|BCDEFHIJ:CJBDHFEI|BCDEFHIK:CEBDHFIK|BCDEFHIL:CEBDHFLI|BCDEFHJK:CJBDHFEK|BCDEFHJL:CJBDHFLE|BCDEFHKL:CEBDHFLK|BCDEFIJK:CJBDEFIK|BCDEFIJL:CJBDEFLI|BCDEFIKL:CEBDIFLK|BCDEFJKL:CJBDEFLK|BCDEGHIJ:HGBCJDEI|BCDEGHIK:EGBCHDIK|BCDEGHIL:EGBCHDLI|BCDEGHJK:HGBCJDEK|BCDEGHJL:HGBCJDLE|BCDEGHKL:EGBCHDLK|BCDEGIJK:EGBCJDIK|BCDEGIJL:EGBCJDLI|BCDEGIKL:EGBCIDLK|BCDEGJKL:EGBCJDLK|BCDEHIJK:EJBCHDIK|BCDEHIJL:EJBCHDLI|BCDEHIKL:EIBCHDLK|BCDEHJKL:EJBCHDLK|BCDEIJKL:EJBCIDLK|BCDFGHIJ:HGBCJFDI|BCDFGHIK:CGBDHFIK|BCDFGHIL:CGBDHFLI|BCDFGHJK:HGBCJFDK|BCDFGHJL:CGBDHFLJ|BCDFGHKL:CGBDHFLK|BCDFGIJK:CGBDJFIK|BCDFGIJL:CGBDJFLI|BCDFGIKL:CGBDIFLK|BCDFGJKL:CGBDJFLK|BCDFHIJK:CJBDHFIK|BCDFHIJL:CJBDHFLI|BCDFHIKL:CIBDHFLK|BCDFHJKL:CJBDHFLK|BCDFIJKL:CJBDIFLK|BCDGHIJK:HGBCJDIK|BCDGHIJL:HGBCJDLI|BCDGHIKL:HGBCIDLK|BCDGHJKL:HGBCJDLK|BCDGIJKL:IGBCJDLK|BCDHIJKL:HJBCIDLK|BCEFGHIJ:HGBCJFEI|BCEFGHIK:EGBCHFIK|BCEFGHIL:EGBCHFLI|BCEFGHJK:HGBCJFEK|BCEFGHJL:HGBCJFLE|BCEFGHKL:EGBCHFLK|BCEFGIJK:EGBCJFIK|BCEFGIJL:EGBCJFLI|BCEFGIKL:EGBCIFLK|BCEFGJKL:EGBCJFLK|BCEFHIJK:EJBCHFIK|BCEFHIJL:EJBCHFLI|BCEFHIKL:EIBCHFLK|BCEFHJKL:EJBCHFLK|BCEFIJKL:EJBCIFLK|BCEGHIJK:EJBCHGIK|BCEGHIJL:EJBCHGLI|BCEGHIKL:EGBCIHLK|BCEGHJKL:EJBCHGLK|BCEGIJKL:EJBCIGLK|BCEHIJKL:EJBCIHLK|BCFGHIJK:HGBCJFIK|BCFGHIJL:HGBCJFLI|BCFGHIKL:HGBCIFLK|BCFGHJKL:HGBCJFLK|BCFGIJKL:IGBCJFLK|BCFHIJKL:HJBCIFLK|BCGHIJKL:HJBCIGLK|BDEFGHIJ:HGBDJFEI|BDEFGHIK:EGBDHFIK|BDEFGHIL:EGBDHFLI|BDEFGHJK:HGBDJFEK|BDEFGHJL:HGBDJFLE|BDEFGHKL:EGBDHFLK|BDEFGIJK:EGBDJFIK|BDEFGIJL:EGBDJFLI|BDEFGIKL:EGBDIFLK|BDEFGJKL:EGBDJFLK|BDEFHIJK:EJBDHFIK|BDEFHIJL:EJBDHFLI|BDEFHIKL:EIBDHFLK|BDEFHJKL:EJBDHFLK|BDEFIJKL:EJBDIFLK|BDEGHIJK:EJBDHGIK|BDEGHIJL:EJBDHGLI|BDEGHIKL:EGBDIHLK|BDEGHJKL:EJBDHGLK|BDEGIJKL:EJBDIGLK|BDEHIJKL:EJBDIHLK|BDFGHIJK:HGBDJFIK|BDFGHIJL:HGBDJFLI|BDFGHIKL:HGBDIFLK|BDFGHJKL:HGBDJFLK|BDFGIJKL:IGBDJFLK|BDFHIJKL:HJBDIFLK|BDGHIJKL:HJBDIGLK|BEFGHIJK:EJBFHGIK|BEFGHIJL:EJBFHGLI|BEFGHIKL:EGBFIHLK|BEFGHJKL:EJBFHGLK|BEFGIJKL:EJBFIGLK|BEFHIJKL:EJBFIHLK|BEGHIJKL:EJIBHGLK|BFGHIJKL:HJBFIGLK|CDEFGHIJ:CGJDHFEI|CDEFGHIK:CGEDHFIK|CDEFGHIL:CGEDHFLI|CDEFGHJK:CGJDHFEK|CDEFGHJL:CGJDHFLE|CDEFGHKL:CGEDHFLK|CDEFGIJK:CGEDJFIK|CDEFGIJL:CGEDJFLI|CDEFGIKL:CGEDIFLK|CDEFGJKL:CGEDJFLK|CDEFHIJK:CJEDHFIK|CDEFHIJL:CJEDHFLI|CDEFHIKL:CEIDHFLK|CDEFHJKL:CJEDHFLK|CDEFIJKL:CJEDIFLK|CDEGHIJK:EGJCHDIK|CDEGHIJL:EGJCHDLI|CDEGHIKL:EGICHDLK|CDEGHJKL:EGJCHDLK|CDEGIJKL:EGICJDLK|CDEHIJKL:EJICHDLK|CDFGHIJK:CGJDHFIK|CDFGHIJL:CGJDHFLI|CDFGHIKL:CGIDHFLK|CDFGHJKL:CGJDHFLK|CDFGIJKL:CGIDJFLK|CDFHIJKL:CJIDHFLK|CDGHIJKL:HGICJDLK|CEFGHIJK:EGJCHFIK|CEFGHIJL:EGJCHFLI|CEFGHIKL:EGICHFLK|CEFGHJKL:EGJCHFLK|CEFGIJKL:EGICJFLK|CEFHIJKL:EJICHFLK|CEGHIJKL:EJICHGLK|CFGHIJKL:HGICJFLK|DEFGHIJK:EGJDHFIK|DEFGHIJL:EGJDHFLI|DEFGHIKL:EGIDHFLK|DEFGHJKL:EGJDHFLK|DEFGIJKL:EGIDJFLK|DEFHIJKL:EJIDHFLK|DEGHIJKL:EJIDHGLK|DFGHIJKL:HGIDJFLK|EFGHIJKL:EJIFHGLK';
          this._thirdPlaceMapping = {};
          compact.split('|').forEach(row => {
            const [combo, values] = row.split(':');
            this._thirdPlaceMapping[combo] = values.split('');
          });
          return this._thirdPlaceMapping;
        }

        getQualifiedThirdPlaceGroups() {
          // Use real standings when group stage is complete
          if (hasRealGroupStageComplete()) {
            return getRealQualifiedThirdPlaceGroups();
          }
          // Use the user's confirmed manual selection when available, else auto top-8.
          const manual = getConfirmedManualThirdPlace();
          if (manual) return manual.slice().sort().join('');
          return getBestThirdPlacedTeams().slice(0, 8).map(item => item.groupKey).sort().join('');
        }

        getThirdPlaceGroupForSlot(slotCode) {
          const combo = this.getQualifiedThirdPlaceGroups();
          const values = this.getThirdPlaceMapping()[combo];
          const idx = this.getThirdPlaceSlotOrder().indexOf(slotCode);
          return values && idx !== -1 ? values[idx] : null;
        }

        resolveSlotDesignation(code) {
          if (!code || !code.startsWith('3@')) return code;
          const groupKey = this.getThirdPlaceGroupForSlot(code.substring(2));
          return groupKey ? `3${groupKey}` : null;
        }

        getSlotLabel(code) {
          if (!code) return 'TBD';
          const resolved = this.resolveSlotDesignation(code);
          const labelCode = resolved || code;
          if (labelCode.startsWith('3@')) return `Qualified 3rd for ${labelCode.substring(2)}`;
          const rank = labelCode[0] === '1' ? 'Winner' : labelCode[0] === '2' ? 'Runner-up' : '3rd place';
          return `${rank} Group ${labelCode.substring(1)}`;
        }

        getUsedR32TeamNames(matchId, side) {
          const used = new Set();
          this.matches.slice(0, 16).forEach((m, idx) => {
            ['home', 'away'].forEach(slotSide => {
              if (idx === matchId && slotSide === side) return;
              if (m[slotSide] && m[slotSide].name) used.add(m[slotSide].name);
            });
          });
          return used;
        }

        getEligibleTeamsForSlot(matchId, side) {
          const code = this.getSlotDesignation(matchId, side);
          const resolved = this.resolveSlotDesignation(code);
          const team = resolved ? this.getTeamByDesignation(resolved) : null;
          if (!team || !team.name) return [];
          if (this.getUsedR32TeamNames(matchId, side).has(team.name)) return [];
          return [team];
        }

        getSlotGroupKeys(matchId, side) {
          const code = this.resolveSlotDesignation(this.getSlotDesignation(matchId, side));
          if (!code) return [];
          const groupKey = code.substring(1);
          return groupPredictions[groupKey] ? [groupKey] : Object.keys(groupPredictions).sort();
        }

        getSlotPlaceholder(matchId, side) {
          const code = this.getSlotDesignation(matchId, side);
          return this.getSlotLabel(code);
        }

        getAllQualifiedTeams() {
          const teams = [];
          Object.keys(groupPredictions).forEach(g => {
            groupPredictions[g].teams.forEach(t => {
              if (t && t.name) teams.push(t);
            });
          });
          return teams;
        }

        // ── INIT ──
        init() {
          this.restoreBracketState({ render: true });

          document.removeEventListener('click', this.boundCloseDropdowns);
          this.boundCloseDropdowns = (e) => {
            if (this.activeDropdown) {
              const inDropdown = this.activeDropdown.contains(e.target);
              const inSlot = e.target.closest('.bp-slot');
              if (!inDropdown && !inSlot) {
                this.closeAllDropdowns();
              }
            }
          };
          document.addEventListener('click', this.boundCloseDropdowns);

          // Add resize listener for absolute positioning and connectors
          window.removeEventListener('resize', this.boundResize);
          this.boundResize = () => this.alignMatchesAndDrawConnectors();
          window.addEventListener('resize', this.boundResize);
        }

        // ── PERSISTENCE ──
        saveBracket() {
          const data = this.matches.map(m => ({
            home: m.home ? m.home.name : null,
            away: m.away ? m.away.name : null,
            winner: m.winner
          }));
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        }

        findTeamByName(name) {
          if (!name) return null;
          for (const g in groupPredictions) {
            const found = groupPredictions[g].teams.find(t => t && t.name === name);
            if (found) return found;
          }
          const found = wcTeams().find(t => t.name === name);
          if (found) return found;
          return { name };
        }

        loadSavedBracket() {
          const saved = localStorage.getItem(this.storageKey);
          if (!saved) return;
          try {
            const data = JSON.parse(saved);
            if (!Array.isArray(data)) return;

            this.matches.forEach(m => { m.winner = null; });
            for (let i = 16; i < this.totalMatches; i++) {
              this.matches[i].home = null;
              this.matches[i].away = null;
            }

            data.forEach((d, i) => {
              if (i >= this.totalMatches || !d) return;
              // Only load home/away for matches >= 16 (later rounds)
              // because matches 0-15 are always synced to official fixtures!
              if (i >= 16) {
                const m = this.matches[i];
                if (d.home) m.home = this.findTeamByName(d.home);
                if (d.away) m.away = this.findTeamByName(d.away);
              }
            });

            for (let i = 0; i < data.length && i < this.totalMatches; i++) {
              const d = data[i];
              if (!d || !d.winner) continue;
              const m = this.matches[i];
              const winnerTeam = m[d.winner];
              if (!winnerTeam) continue;
              m.winner = d.winner;
              this.propagateWinner(i, winnerTeam, false);
            }
          } catch (e) { console.error('Bracket load error:', e); }
        }

        restoreBracketState(options = {}) {
          const { render = true } = options;
          this.syncRound32Matchups({ persist: false });
          this.loadSavedBracket();
          if (render) {
            this.renderBracket();
            this.renderProgress();
            this.updateChampionDisplay();
          }
          this.updateDownloadButton();
        }

        // ── Official R32 fixtures from real group stage results ──
        getOfficialR32Fixtures() {
          return [
            { home: 'South Korea', away: 'Canada' },
            { home: 'Germany', away: 'Brazil' },
            { home: 'Japan', away: 'Morocco' },
            { home: 'Scotland', away: 'Netherlands' },
            { home: 'France', away: 'Sweden' },
            { home: 'Ivory Coast', away: 'Norway' },
            { home: 'Mexico', away: 'Spain' },
            { home: 'England', away: 'Senegal' },
            { home: 'United States', away: 'Qatar' },
            { home: 'New Zealand', away: 'Czechia' },
            { home: 'Portugal', away: 'Panama' },
            { home: 'Cape Verde', away: 'Jordan' },
            { home: 'Switzerland', away: 'Egypt' },
            { home: 'Argentina', away: 'Uruguay' },
            { home: 'Colombia', away: 'Curaçao' },
            { home: 'Türkiye', away: 'Belgium' }
          ];
        }

        // ── SYNC R32 slot labels from group predictions ──
        syncRound32Matchups(options = {}) {
          if (typeof options === 'boolean') {
            options = { forceDesignated: options };
          }
          const persist = options.persist !== false;
          this._savedDesignations = {};

          const officialFixtures = this.getOfficialR32Fixtures();
          for (let i = 0; i < 16; i++) {
            const fixture = officialFixtures[i];
            const m = this.matches[i];
            const newHome = { name: fixture.home };
            const newAway = { name: fixture.away };

            if (!m.home || m.home.name !== newHome.name) {
              m.home = newHome;
              if (m.winner) this.clearDownstream(i);
            }
            if (!m.away || m.away.name !== newAway.name) {
              m.away = newAway;
              if (m.winner) this.clearDownstream(i);
            }

            // Default Winner for Match 1: South Korea vs Canada (Canada won 1-0)
            if (i === 0 && !m.winner) {
              m.winner = 'away';
              this.propagateWinner(0, newAway, false);
            }
          }
          if (persist) this.saveBracket();
        }

        // ── MATCH DESTINATION MAPPING ──
        getDestination(matchId) {
          if (matchId >= 0 && matchId <= 15)
            return { id: 16 + Math.floor(matchId / 2), side: matchId % 2 === 0 ? 'home' : 'away' };
          if (matchId >= 16 && matchId <= 23)
            return { id: 24 + Math.floor((matchId - 16) / 2), side: (matchId - 16) % 2 === 0 ? 'home' : 'away' };
          if (matchId >= 24 && matchId <= 27)
            return { id: 28 + Math.floor((matchId - 24) / 2), side: (matchId - 24) % 2 === 0 ? 'home' : 'away' };
          if (matchId === 28 || matchId === 29)
            return { id: 30, side: matchId === 28 ? 'home' : 'away' };
          return null;
        }

        // ── SELECT WINNER ──
        selectWinner(matchId, side) {
          if (!this._requireBracketAuth()) return;
          if (!arePredictionsComplete()) {
            showToast(getBracketUnlockMessage(), 'warning');
            return;
          }
          if (matchId === 0) {
            showToast("Match 1 (South Korea vs Canada) is already completed. The score 0 - 1 is official.", "info");
            return;
          }
          const m = this.matches[matchId];
          if (!m.home || !m.away) return;

          // Toggle off if already picked
          if (m.winner === side) {
            this.clearDownstream(matchId);
            this.refreshBracketAfterChange(matchId);
            this.renderProgress();
            this.updateChampionDisplay();
            this.saveBracket();
            return;
          }

          m.winner = side;
          const winnerTeam = m[side];
          this.propagateWinner(matchId, winnerTeam, false);
          this.refreshBracketAfterChange(matchId);
          this.updateChampionDisplay();
          this.renderProgress();
          this.saveBracket();
        }

        propagateWinner(matchId, team, render = true) {
          if (matchId === 30) {
            // Final — no downstream propagation
            if (render) this.updateChampionDisplay();
            return;
          }
          const dest = this.getDestination(matchId);
          if (!dest) return;
          const destM = this.matches[dest.id];
          if (!destM[dest.side] || destM[dest.side].name !== team.name) {
            destM[dest.side] = team;
            this.clearDownstream(dest.id);
          }
        }

        clearDownstream(matchId) {
          const m = this.matches[matchId];
          m.winner = null;
          if (matchId === 30) return;
          const dest = this.getDestination(matchId);
          if (!dest) return;
          const destM = this.matches[dest.id];
          if (destM[dest.side]) {
            destM[dest.side] = null;
            this.clearDownstream(dest.id);
          }
        }

        // ── SELECT TEAM FOR SLOT (R32 dropdown) ──
        selectTeamForSlot(matchId, side, team) {
          if (!this._requireBracketAuth()) return;
          if (matchId < 16 && !arePredictionsComplete()) {
            showToast('Complete your predictions in the Prediction Center (group rankings + confirm the 8 third-place qualifiers) to unlock the knockout bracket.', 'error');
            return;
          }
          const eligible = this.getEligibleTeamsForSlot(matchId, side);
          if (!eligible.some(t => t.name === team.name)) {
            showToast('That team is not eligible for this Round of 32 slot.', 'error');
            return;
          }
          const m = this.matches[matchId];
          m[side] = team;
          this.clearDownstream(matchId);
          this.closeAllDropdowns();
          this.refreshBracketAfterChange(matchId);
          this.renderProgress();
          this.saveBracket();
        }

        getBracketChainFrom(matchId) {
          const ids = [];
          const visited = new Set();
          const walk = (id) => {
            if (id == null || id > 30 || visited.has(id)) return;
            visited.add(id);
            ids.push(id);
            const dest = this.getDestination(id);
            if (dest) walk(dest.id);
          };
          walk(matchId);
          return ids;
        }

        replaceSlotInMatch(matchId, side) {
          const matchEl = document.getElementById(`bp-match-${matchId}`);
          if (!matchEl) return false;
          const oldSlot = matchEl.querySelector(`.bp-slot[data-side="${side}"]`);
          if (!oldSlot) return false;
          oldSlot.replaceWith(this.buildSlot(matchId, side));
          return true;
        }

        refreshMatchElement(matchId) {
          const matchEl = document.getElementById(`bp-match-${matchId}`);
          if (!matchEl) return false;
          const m = this.matches[matchId];
          matchEl.classList.toggle('complete', !!m.winner);
          return this.replaceSlotInMatch(matchId, 'home') && this.replaceSlotInMatch(matchId, 'away');
        }

        scheduleBracketAlign() {
          if (this._alignFrame) cancelAnimationFrame(this._alignFrame);
          this._alignFrame = requestAnimationFrame(() => {
            this.alignMatchesAndDrawConnectors();
            this._alignFrame = null;
          });
        }

        refreshBracketAfterChange(matchId) {
          const chain = this.getBracketChainFrom(matchId);
          let needsFullRender = false;
          chain.forEach(id => {
            if (!this.refreshMatchElement(id)) needsFullRender = true;
          });
          if (needsFullRender) {
            this.renderBracket();
            return;
          }
          this.updateInteractiveState();
          this.scheduleBracketAlign();
        }

        // ── DROPDOWN ──
        toggleDropdown(slotEl, matchId, side) {
          if (!this._requireBracketAuth()) return;
          if (matchId < 16 && !arePredictionsComplete()) {
            showToast('Complete your predictions in the Prediction Center (group rankings + confirm the 8 third-place qualifiers) to unlock the knockout bracket.', 'error');
            return;
          }
          this.closeAllDropdowns();

          const dropdown = document.createElement('div');
          dropdown.className = 'bp-dropdown';

          const search = document.createElement('input');
          search.className = 'bp-dropdown-search';
          search.placeholder = 'Search team...';
          search.type = 'text';
          search.onclick = (e) => e.stopPropagation();
          search.oninput = (e) => {
            const q = e.target.value.toLowerCase().trim();
            dropdown.querySelectorAll('.bp-dropdown-item, .bp-dropdown-group-header').forEach(item => {
              if (item.classList.contains('bp-dropdown-group-header')) {
                item.style.display = '';
              } else {
                item.style.display = item.dataset.search && item.dataset.search.toLowerCase().includes(q) ? 'flex' : 'none';
              }
            });
          };
          dropdown.appendChild(search);

          const itemsContainer = document.createElement('div');
          itemsContainer.style.flex = '1';
          itemsContainer.style.minHeight = '0';
          itemsContainer.style.overflowY = 'auto';

          // Clear option
          const m = this.matches[matchId];
          if (m[side]) {
            const clearItem = document.createElement('div');
            clearItem.className = 'bp-dropdown-item';
            clearItem.style.color = 'var(--error, #ef4444)';
            clearItem.style.fontWeight = '600';
            clearItem.dataset.search = 'clear';
            clearItem.innerHTML = '✕ Clear Slot';
            clearItem.onclick = (e) => {
              e.stopPropagation();
              m[side] = null;
              if (this._userOverrides) this._userOverrides.delete(`${matchId}-${side}`);
              this.clearDownstream(matchId);
              this.closeAllDropdowns();
              this.refreshBracketAfterChange(matchId);
              this.renderProgress();
              this.saveBracket();
            };
            itemsContainer.appendChild(clearItem);
          }

          const posLabels = ['1st', '2nd', '3rd', '4th'];
          const posColors = ['#10b981', '#3b82f6', '#f59e0b', '#6b7280'];

          const eligibleTeams = this.getEligibleTeamsForSlot(matchId, side);
          const header = document.createElement('div');
          header.className = 'bp-dropdown-group-header';
          header.style.cssText = 'padding:0.35rem 0.75rem; font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--text3); background:var(--surface2); border-bottom:1px solid var(--border); position:sticky; top:0;';
          header.textContent = this.getSlotLabel(this.getSlotDesignation(matchId, side));
          itemsContainer.appendChild(header);

          if (!eligibleTeams.length) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'bp-dropdown-item disabled';
            emptyItem.dataset.search = 'no eligible team';
            emptyItem.textContent = 'No eligible team available';
            itemsContainer.appendChild(emptyItem);
          }

          eligibleTeams.forEach(t => {
            if (!t || !t.name) return;
            const resolvedCode = this.resolveSlotDesignation(this.getSlotDesignation(matchId, side));
            const idx = resolvedCode ? parseInt(resolvedCode[0], 10) - 1 : 0;
            const groupKey = resolvedCode ? resolvedCode.substring(1) : '';
            const group = groupPredictions[groupKey];
            const item = document.createElement('div');
            item.className = 'bp-dropdown-item';
            item.dataset.search = `${t.name} ${group?.name || ''} group ${groupKey}`.toLowerCase();
            const isCurrentTeam = m[side] && m[side].name === t.name;
            if (isCurrentTeam) item.style.background = 'var(--surface3)';

            const posBadge = `<span style="font-size:0.6rem;font-weight:700;color:${posColors[idx] || '#6b7280'};background:rgba(0,0,0,0.3);border:1px solid ${posColors[idx] || '#6b7280'}40;border-radius:3px;padding:0.1rem 0.35rem;flex-shrink:0;">${posLabels[idx] || idx + 1}</span>`;
            const pts = t.pts !== undefined ? `<span style="font-size:0.62rem;color:var(--text3);margin-left:auto;">${t.pts}pts</span>` : '';

            item.innerHTML = `${getFlagImg(t.name)}<span style="font-size:0.78rem;font-weight:600;color:var(--text);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.name}</span>${posBadge}${pts}`;
            item.style.cssText += 'gap:0.4rem;';
            item.onclick = (e) => { e.stopPropagation(); this.selectTeamForSlot(matchId, side, t); };
            itemsContainer.appendChild(item);
          });

          dropdown.appendChild(itemsContainer);

          // Portal to body so overflow-x:auto on the bracket wrapper can't clip it
          document.body.appendChild(dropdown);
          this.activeDropdown = dropdown;
          this._activeSlotEl = slotEl;

          // Compute position after inserting (so offsetHeight is available)
          const positionDropdown = () => {
            const rect = slotEl.getBoundingClientRect();
            const ddH = dropdown.offsetHeight || 300;
            const ddW = dropdown.offsetWidth || 250;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Prefer below; flip above if not enough room
            let top = rect.bottom + 4;
            if (top + ddH > vh) top = Math.max(4, rect.top - ddH - 4);

            // Prefer left-aligned; flip left if overflows right edge
            let left = rect.left;
            if (left + ddW > vw) left = Math.max(4, rect.right - ddW);

            dropdown.style.top = top + 'px';
            dropdown.style.left = left + 'px';
          };
          positionDropdown();
          this._dropdownPositioner = positionDropdown;
          // Only reposition on window resize, NOT on scroll
          // (scroll inside the dropdown must not be intercepted)
          window.addEventListener('resize', positionDropdown, { passive: true });

          setTimeout(() => search.focus(), 50);
        }

        closeAllDropdowns() {
          if (this.activeDropdown) {
            this.activeDropdown.remove();
            this.activeDropdown = null;
            this._activeSlotEl = null;
          }
          if (this._dropdownPositioner) {
            window.removeEventListener('resize', this._dropdownPositioner);
            this._dropdownPositioner = null;
          }
        }

        // ── RENDER SYMMETRIC BRACKET ──
        renderBracket() {
          const leftEl = document.getElementById('bp-half-left');
          const rightEl = document.getElementById('bp-half-right');
          const finalEl = document.getElementById('bp-final-col');
          if (!leftEl || !rightEl || !finalEl) return;

          // LEFT: R32(0-7) → R16(16-19) → QF(24-25) → SF(28)
          leftEl.innerHTML = '';
          leftEl.appendChild(this.buildRoundCol('Round of 32', [0,1,2,3,4,5,6,7]));
          leftEl.appendChild(this.buildRoundCol('Round of 16', [16,17,18,19]));
          leftEl.appendChild(this.buildRoundCol('Quarter-Finals', [24,25]));
          leftEl.appendChild(this.buildRoundCol('Semi-Finals', [28]));

          // RIGHT: SF(29) ← QF(26-27) ← R16(20-23) ← R32(8-15)
          rightEl.innerHTML = '';
          rightEl.appendChild(this.buildRoundCol('Semi-Finals', [29]));
          rightEl.appendChild(this.buildRoundCol('Quarter-Finals', [26,27]));
          rightEl.appendChild(this.buildRoundCol('Round of 16', [20,21,22,23]));
          rightEl.appendChild(this.buildRoundCol('Round of 32', [8,9,10,11,12,13,14,15]));

          // CENTER: Final
          finalEl.innerHTML = '';
          finalEl.appendChild(this.buildRoundCol('Final', [30]));

          this.updateInteractiveState();
          this.updateChampionDisplay();
          this.updateBracketLockNotice();

          this.scheduleBracketAlign();
        }

        buildRoundCol(title, matchIds) {
          const col = document.createElement('div');
          col.className = 'bp-round';

          const titleEl = document.createElement('div');
          titleEl.className = 'bp-round-title';
          titleEl.textContent = title;
          // Store the round key for progress highlighting
          const roundDef = this.rounds.find(r => r.name === title);
          if (roundDef) titleEl.id = `bp-title-${roundDef.key}`;
          col.appendChild(titleEl);

          const matchesContainer = document.createElement('div');
          matchesContainer.className = 'bp-round-matches';
          if (title === 'Round of 32') {
            matchesContainer.classList.add('r32-matches');
          }
          col.appendChild(matchesContainer);

          matchIds.forEach(id => {
            const m = this.matches[id];
            const matchEl = document.createElement('div');
            matchEl.className = 'bp-match';
            matchEl.id = `bp-match-${id}`;
            if (m.winner) matchEl.classList.add('complete');

            // Label
            const label = document.createElement('div');
            label.className = 'bp-match-label';
            label.textContent = `M${id + 1}`;
            matchEl.appendChild(label);

            // Home slot
            matchEl.appendChild(this.buildSlot(id, 'home'));
            // VS divider
            const vs = document.createElement('div');
            vs.className = 'bp-slot-vs';
            vs.textContent = id === 0 ? '0 - 1' : 'VS';
            matchEl.appendChild(vs);
            // Away slot
            matchEl.appendChild(this.buildSlot(id, 'away'));

            matchesContainer.appendChild(matchEl);
          });

          return col;
        }

        updateBracketLockNotice() {
          const notice = document.getElementById('bp-lock-notice');
          if (!notice) return;
          const locked = !arePredictionsComplete();
          notice.style.display = locked ? '' : 'none';
          if (locked) {
            notice.textContent = getBracketUnlockMessage();
          }
        }

        buildSlot(matchId, side) {
          const predictionsLocked = !arePredictionsComplete();
          const m = this.matches[matchId];
          const team = predictionsLocked ? null : m[side];
          const slot = document.createElement('div');
          slot.className = 'bp-slot';
          slot.dataset.matchId = matchId;
          slot.dataset.side = side;

          if (predictionsLocked) {
            slot.classList.add('locked', 'empty');
            slot.title = getBracketUnlockMessage();
            const placeholder = document.createElement('span');
            placeholder.className = 'bp-slot-placeholder';
            placeholder.textContent = 'TBD';
            slot.appendChild(placeholder);
            slot.onclick = (e) => {
              e.stopPropagation();
              showToast(getBracketUnlockMessage(), 'warning');
            };
            return slot;
          }

          if (team) {
            if (m.winner === side) slot.classList.add('winner');

            const flag = document.createElement('span');
            flag.className = 'bp-slot-flag';
            flag.innerHTML = getFlagImg(team.name);
            slot.appendChild(flag);

            const name = document.createElement('span');
            name.className = 'bp-slot-name';
            name.textContent = team.name;
            slot.appendChild(name);

            if (matchId === 0) {
              slot.title = "Official Result: South Korea 0 - 1 Canada";
            }

            // Click slot body selects winner
            slot.onclick = (e) => {
              e.stopPropagation();
              if (matchId === 0) {
                showToast("Match 1 (South Korea vs Canada) is already completed. The score 0 - 1 is official.", "info");
                return;
              }
              if (m.home && m.away) {
                this.selectWinner(matchId, side);
              }
            };
          } else {
            slot.classList.add('empty');
            const placeholder = document.createElement('span');
            placeholder.className = 'bp-slot-placeholder';
            if (matchId < 16) {
              placeholder.textContent = this.getSlotPlaceholder(matchId, side);
            } else {
              const depId = this.getDependentMatchId(matchId, side);
              placeholder.textContent = depId !== null ? `Winner M${depId + 1}` : 'TBD';
              // Lock if dependent match not yet decided
              const depMatch = depId !== null ? this.matches[depId] : null;
              if (!depMatch || !depMatch.winner) slot.classList.add('locked');
            }
            slot.appendChild(placeholder);

            slot.onclick = (e) => {
              e.stopPropagation();
            };
          }

          return slot;
        }

        getDependentMatchId(matchId, side) {
          if (matchId >= 16 && matchId <= 23) {
            const base = (matchId - 16) * 2;
            return side === 'home' ? base : base + 1;
          }
          if (matchId >= 24 && matchId <= 27) {
            const base = 16 + (matchId - 24) * 2;
            return side === 'home' ? base : base + 1;
          }
          if (matchId >= 28 && matchId <= 29) {
            const base = 24 + (matchId - 28) * 2;
            return side === 'home' ? base : base + 1;
          }
          if (matchId === 30) {
            return side === 'home' ? 28 : 29;
          }
          return null;
        }

        getSourceMatches(matchId) {
          if (matchId >= 16 && matchId <= 23) {
            const base = (matchId - 16) * 2;
            return [base, base + 1];
          }
          if (matchId >= 24 && matchId <= 27) {
            const base = 16 + (matchId - 24) * 2;
            return [base, base + 1];
          }
          if (matchId >= 28 && matchId <= 29) {
            const base = 24 + (matchId - 28) * 2;
            return [base, base + 1];
          }
          if (matchId === 30) {
            return [28, 29];
          }
          return null;
        }

        alignMatchesAndDrawConnectors() {
          const wrapper = document.getElementById('bp-bracket-wrapper');
          if (!wrapper) return;

          const wrapperRect = wrapper.getBoundingClientRect();

          const alignLaterRound = (id) => {
            const mEl = document.getElementById(`bp-match-${id}`);
            const sources = this.getSourceMatches(id);
            if (!mEl || !sources) return;

            const s1El = document.getElementById(`bp-match-${sources[0]}`);
            const s2El = document.getElementById(`bp-match-${sources[1]}`);
            if (s1El && s2El) {
              const s1Rect = s1El.getBoundingClientRect();
              const s2Rect = s2El.getBoundingClientRect();
              const mParentRect = mEl.parentElement.getBoundingClientRect();

              const s1CenterY = s1Rect.top - wrapperRect.top + wrapper.scrollTop + s1Rect.height / 2;
              const s2CenterY = s2Rect.top - wrapperRect.top + wrapper.scrollTop + s2Rect.height / 2;
              const centerY = (s1CenterY + s2CenterY) / 2;

              const mParentTop = mParentRect.top - wrapperRect.top + wrapper.scrollTop;

              mEl.style.position = 'absolute';
              mEl.style.top = (centerY - mEl.offsetHeight / 2 - mParentTop) + 'px';
              mEl.style.left = '4px';
              mEl.style.right = '4px';
            }
          };

          // 1. Position matches in later rounds absolute based on vertical centering of their source matches
          
          // Round of 16 (matches 16-23)
          for (let id = 16; id <= 23; id++) {
            alignLaterRound(id);
          }

          // Quarter-Finals (matches 24-27)
          for (let id = 24; id <= 27; id++) {
            alignLaterRound(id);
          }

          // Semi-Finals (matches 28 and 29)
          for (let id = 28; id <= 29; id++) {
            alignLaterRound(id);
          }

          // Final (match 30)
          alignLaterRound(30);

          // 2. Draw SVG connector lines
          this.drawSVGConnectors();
        }

        drawSVGConnectors() {
          const wrapper = document.getElementById('bp-bracket-wrapper');
          if (!wrapper) return;

          let svg = document.getElementById('bp-svg-connectors');
          if (svg) {
            svg.remove();
          }

          svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.id = 'bp-svg-connectors';
          svg.style.position = 'absolute';
          svg.style.top = '0';
          svg.style.left = '0';
          svg.style.width = wrapper.scrollWidth + 'px';
          svg.style.height = wrapper.scrollHeight + 'px';
          svg.style.pointerEvents = 'none';
          svg.style.zIndex = '1';
          wrapper.appendChild(svg);

          const wrapperRect = wrapper.getBoundingClientRect();
          const scrollLeft = wrapper.scrollLeft;
          const scrollTop = wrapper.scrollTop;

          const drawConnectorPath = (s1Id, s2Id, targetId, side) => {
            const s1El = document.getElementById(`bp-match-${s1Id}`);
            const s2El = s2Id !== null ? document.getElementById(`bp-match-${s2Id}`) : null;
            const tEl = document.getElementById(`bp-match-${targetId}`);
            if (!s1El || !tEl) return;

            const s1Rect = s1El.getBoundingClientRect();
            const tRect = tEl.getBoundingClientRect();

            const s1Right = s1Rect.right - wrapperRect.left + scrollLeft;
            const s1Left = s1Rect.left - wrapperRect.left + scrollLeft;
            const s1CenterY = s1Rect.top - wrapperRect.top + scrollTop + s1Rect.height / 2;

            const tRight = tRect.right - wrapperRect.left + scrollLeft;
            const tLeft = tRect.left - wrapperRect.left + scrollLeft;
            const tCenterY = tRect.top - wrapperRect.top + scrollTop + tRect.height / 2;

            const lineOffset = 12;

            let pathData = '';

            if (side === 'left') {
              if (!s2El) return;
              const s2Rect = s2El.getBoundingClientRect();
              const s2Right = s2Rect.right - wrapperRect.left + scrollLeft;
              const s2CenterY = s2Rect.top - wrapperRect.top + scrollTop + s2Rect.height / 2;

              const xStart1 = s1Right;
              const xStart2 = s2Right;
              const xEnd = tLeft;
              const xMid = xStart1 + lineOffset;

              pathData = `
                M ${xStart1} ${s1CenterY}
                H ${xMid}
                M ${xStart2} ${s2CenterY}
                H ${xMid}
                V ${s1CenterY}
                M ${xMid} ${tCenterY}
                H ${xEnd}
              `.trim();
            } else if (side === 'right') {
              if (!s2El) return;
              const s2Rect = s2El.getBoundingClientRect();
              const s2Left = s2Rect.left - wrapperRect.left + scrollLeft;
              const s2CenterY = s2Rect.top - wrapperRect.top + scrollTop + s2Rect.height / 2;

              const xStart1 = s1Left;
              const xStart2 = s2Left;
              const xEnd = tRight;
              const xMid = xStart1 - lineOffset;

              pathData = `
                M ${xStart1} ${s1CenterY}
                H ${xMid}
                M ${xStart2} ${s2CenterY}
                H ${xMid}
                V ${s1CenterY}
                M ${xMid} ${tCenterY}
                H ${xEnd}
              `.trim();
            } else if (side === 'final-left') {
              const xStart = s1Right;
              const xEnd = tLeft;
              const xMid = xStart + lineOffset;
              pathData = `
                M ${xStart} ${s1CenterY}
                H ${xMid}
                V ${tCenterY}
                H ${xEnd}
              `.trim();
            } else if (side === 'final-right') {
              const xStart = s1Left;
              const xEnd = tRight;
              const xMid = xStart - lineOffset;
              pathData = `
                M ${xStart} ${s1CenterY}
                H ${xMid}
                V ${tCenterY}
                H ${xEnd}
              `.trim();
            }

            if (pathData) {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('stroke', 'var(--border)');
              path.setAttribute('stroke-width', '1.5');
              path.setAttribute('fill', 'none');
              path.setAttribute('shape-rendering', 'crispEdges');
              svg.appendChild(path);
            }
          };

          // 1. Left half connectors
          drawConnectorPath(0, 1, 16, 'left');
          drawConnectorPath(2, 3, 17, 'left');
          drawConnectorPath(4, 5, 18, 'left');
          drawConnectorPath(6, 7, 19, 'left');
          drawConnectorPath(16, 17, 24, 'left');
          drawConnectorPath(18, 19, 25, 'left');
          drawConnectorPath(24, 25, 28, 'left');

          // 2. Right half connectors
          drawConnectorPath(8, 9, 20, 'right');
          drawConnectorPath(10, 11, 21, 'right');
          drawConnectorPath(12, 13, 22, 'right');
          drawConnectorPath(14, 15, 23, 'right');
          drawConnectorPath(20, 21, 26, 'right');
          drawConnectorPath(22, 23, 27, 'right');
          drawConnectorPath(26, 27, 29, 'right');

          // 3. Final connectors (M28 -> M31, M29 -> M31)
          drawConnectorPath(28, null, 30, 'final-left');
          drawConnectorPath(29, null, 30, 'final-right');
        }

        // ── INTERACTIVE STATE ──
        updateInteractiveState() {
          this.rounds.forEach(round => {
            const titleEl = document.getElementById(`bp-title-${round.key}`);
            if (!titleEl) return;
            const prevRound = this.rounds[this.rounds.indexOf(round) - 1];
            const prevDone = !prevRound || this.isRoundComplete(prevRound.key);
            titleEl.classList.remove('active-round');
            if (prevDone && !this.isRoundComplete(round.key)) {
              titleEl.classList.add('active-round');
            }
          });
        }

        // ── PROGRESS ──
        renderProgress() {
          const container = document.getElementById('bp-progress');
          if (!container) return;
          container.innerHTML = '';
          this.rounds.forEach(r => {
            const step = document.createElement('div');
            step.className = 'bp-progress-step';
            step.id = `bp-step-${r.key}`;
            step.textContent = r.name;
            const done = this.isRoundComplete(r.key);
            if (done) step.classList.add('done');
            else {
              const prevR = this.rounds[this.rounds.indexOf(r) - 1];
              if (!prevR || this.isRoundComplete(prevR.key)) step.classList.add('current');
            }
            container.appendChild(step);
          });
        }

        isRoundComplete(key) {
          const r = this.rounds.find(d => d.key === key);
          if (!r) return false;
          for (let i = r.startIdx; i < r.startIdx + r.matchCount; i++) {
            if (!this.matches[i].winner) return false;
          }
          return true;
        }

        // ── CHAMPION (match 31 / index 30 only) ──
        updateChampionDisplay() {
          const champBox = document.getElementById('bp-champion-box');
          const champFlag = document.getElementById('bp-champ-flag');
          const champName = document.getElementById('bp-champ-name');
          if (!champBox || !champFlag || !champName) return;

          const finalM = this.matches[30];
          const champ = finalM.winner ? finalM[finalM.winner] : null;

          if (champ) {
            champBox.classList.add('crowned');
            champFlag.innerHTML = getFlagImg(champ.name);
            champName.textContent = champ.name;
            champName.style.color = '';
          } else {
            champBox.classList.remove('crowned');
            champBox.className = 'bp-champion';
            champFlag.innerHTML = wcTrophyIconMarkup('bp-champion-trophy');
            champName.textContent = 'SELECT YOUR CHAMPION';
            champName.style.color = 'var(--text3)';
          }
          this.updateDownloadButton();
        }

        updateDownloadButton() {
          const btn = document.getElementById('bp-download-pdf');
          if (!btn) return;
          const submitted = this.isBracketSubmitted() && this.isBracketComplete();
          btn.disabled = !submitted;
          btn.title = submitted ? '' : 'Submit your complete bracket prediction first to download.';
        }

        _preparePdfCapture(root) {
          if (!root) return;
          root.querySelectorAll('img').forEach(img => { img.crossOrigin = 'anonymous'; });
        }

        async _loadPdfLogoImage() {
          if (this._pdfLogoImage) return this._pdfLogoImage;
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              this._pdfLogoImage = img;
              resolve(img);
            };
            img.onerror = () => reject(new Error('Logo load failed'));
            img.src = 'logo_hd.png';
          });
        }

        _getPdfUsername() {
          const name = state.user && state.user.username ? String(state.user.username).trim() : '';
          return name || 'Player';
        }

        _getPdfCaptureScale() {
          const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          return isMobile ? 1 : 1.25;
        }

        _fitCanvasToMaxSize(sourceCanvas, maxW = 1800, maxH = 2600) {
          const ratio = Math.min(maxW / sourceCanvas.width, maxH / sourceCanvas.height, 1);
          if (ratio >= 1) return sourceCanvas;
          const w = Math.round(sourceCanvas.width * ratio);
          const h = Math.round(sourceCanvas.height * ratio);
          const out = document.createElement('canvas');
          out.width = w;
          out.height = h;
          const ctx = out.getContext('2d');
          ctx.fillStyle = '#0f1115';
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(sourceCanvas, 0, 0, w, h);
          return out;
        }

        _canvasToJpegImage(canvas, quality = 0.76) {
          return {
            data: canvas.toDataURL('image/jpeg', quality),
            width: canvas.width,
            height: canvas.height,
            format: 'JPEG'
          };
        }

        async _buildBracketCompositeImage(wrapper, champBox, hasChampion, captureScale) {
          const bracketCanvas = await html2canvas(wrapper, {
            width: wrapper.scrollWidth,
            height: wrapper.scrollHeight,
            scale: captureScale,
            useCORS: true,
            logging: false,
            backgroundColor: '#0f1115',
          });

          let champCanvas = null;
          if (hasChampion && champBox) {
            champCanvas = await html2canvas(champBox, {
              scale: 1,
              useCORS: true,
              logging: false,
              backgroundColor: '#0f1115',
            });
          }

          let logoImg = null;
          try {
            logoImg = await this._loadPdfLogoImage();
          } catch (e) {
            console.warn('PDF logo unavailable:', e);
          }

          const headerH = Math.round(54 * captureScale);
          const footerH = Math.round(36 * captureScale);
          const gap = Math.round(20 * captureScale);
          const contentW = bracketCanvas.width;
          const champW = champCanvas ? champCanvas.width : 0;
          const champH = champCanvas ? champCanvas.height : 0;
          const totalW = Math.max(contentW, champW);
          const bodyH = bracketCanvas.height + (champCanvas ? gap + champH : 0);
          const totalH = headerH + bodyH + footerH;

          const composite = document.createElement('canvas');
          composite.width = totalW;
          composite.height = totalH;
          const ctx = composite.getContext('2d');
          ctx.fillStyle = '#0f1115';
          ctx.fillRect(0, 0, totalW, totalH);

          const username = this._getPdfUsername();
          const headerPad = Math.round(14 * captureScale);

          if (logoImg) {
            const logoH = Math.round(34 * captureScale);
            const logoW = Math.round(logoH * (logoImg.width / logoImg.height));
            const logoX = headerPad;
            const logoY = Math.round(10 * captureScale);
            ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
          }

          const titleMaxW = totalW - (headerPad * 2 + Math.round(120 * captureScale));
          ctx.textAlign = 'center';
          ctx.fillStyle = '#d4af37';
          ctx.font = `bold ${Math.round(18 * captureScale)}px Arial, sans-serif`;
          ctx.fillText('Footy-Trivia — World Cup 2026 Knockout Bracket', totalW / 2, Math.round(22 * captureScale), titleMaxW);

          ctx.fillStyle = '#9ca3af';
          ctx.font = `${Math.round(11 * captureScale)}px Arial, sans-serif`;
          ctx.fillText('Round of 32 through Final — full prediction route', totalW / 2, Math.round(38 * captureScale), titleMaxW);

          ctx.textAlign = 'right';
          ctx.fillStyle = '#9ca3af';
          ctx.font = `${Math.round(9 * captureScale)}px Arial, sans-serif`;
          ctx.fillText('Predicted by', totalW - headerPad, Math.round(14 * captureScale));
          ctx.fillStyle = '#d4af37';
          ctx.font = `bold ${Math.round(13 * captureScale)}px Arial, sans-serif`;
          ctx.fillText(username, totalW - headerPad, Math.round(28 * captureScale));
          ctx.textAlign = 'center';

          const bracketX = (totalW - bracketCanvas.width) / 2;
          const bracketY = headerH;

          if (logoImg) {
            ctx.save();
            ctx.globalAlpha = 0.09;
            const wmSize = Math.min(totalW, bodyH) * 0.38;
            const wmW = wmSize;
            const wmH = wmSize * (logoImg.height / logoImg.width);
            const wmX = (totalW - wmW) / 2;
            const wmY = bracketY + (bodyH - wmH) / 2;
            ctx.drawImage(logoImg, wmX, wmY, wmW, wmH);
            ctx.restore();
          }

          ctx.drawImage(bracketCanvas, bracketX, bracketY);

          if (champCanvas) {
            const champX = (totalW - champCanvas.width) / 2;
            ctx.drawImage(champCanvas, champX, bracketY + bracketCanvas.height + gap);
          }

          const footerY = headerH + bodyH;
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
          ctx.lineWidth = Math.max(1, Math.round(captureScale));
          ctx.beginPath();
          ctx.moveTo(Math.round(24 * captureScale), footerY + Math.round(6 * captureScale));
          ctx.lineTo(totalW - Math.round(24 * captureScale), footerY + Math.round(6 * captureScale));
          ctx.stroke();

          ctx.fillStyle = '#9ca3af';
          ctx.font = `${Math.round(10 * captureScale)}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('Create your own bracket at', totalW / 2, footerY + Math.round(20 * captureScale));

          ctx.fillStyle = '#d4af37';
          ctx.font = `bold ${Math.round(13 * captureScale)}px Arial, sans-serif`;
          ctx.fillText(FT_SITE_URL, totalW / 2, footerY + Math.round(34 * captureScale));

          return composite;
        }

        _addPdfBranding(pdf, pageW, pageH, logoImg) {
          const footerLabelY = pageH - 6;
          const footerUrlY = pageH - 2.5;

          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(156, 163, 175);
          pdf.text('Create your own bracket at', pageW / 2, footerLabelY, { align: 'center' });

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(212, 175, 55);
          pdf.textWithLink(FT_SITE_URL, pageW / 2, footerUrlY, { align: 'center', url: FT_SITE_URL });

          if (!logoImg) return;

          const logoAspect = logoImg.width / logoImg.height;
          const wmH = Math.min(pageW, pageH) * 0.42;
          const wmW = wmH * logoAspect;
          const wmX = (pageW - wmW) / 2;
          const wmY = (pageH - wmH) / 2;

          try {
            const logoData = this._pdfLogoDataUrl || (() => {
              const c = document.createElement('canvas');
              c.width = logoImg.width;
              c.height = logoImg.height;
              const cctx = c.getContext('2d');
              cctx.drawImage(logoImg, 0, 0);
              return c.toDataURL('image/png');
            })();
            this._pdfLogoDataUrl = logoData;

            if (typeof pdf.GState === 'function') {
              pdf.saveGraphicsState();
              pdf.setGState(new pdf.GState({ opacity: 0.08 }));
              pdf.addImage(logoData, 'PNG', wmX, wmY, wmW, wmH);
              pdf.restoreGraphicsState();
            } else {
              pdf.addImage(logoData, 'PNG', wmX, wmY, wmW, wmH);
            }
          } catch (e) {
            console.warn('PDF watermark skipped:', e);
          }
        }

        _savePdfFile(pdf, filename) {
          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

          if (isIOS) {
            window.open(url, '_blank');
            showToast('PDF opened — use Share → Save to Files to keep it.', 'info');
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            return;
          }

          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 2000);
        }

        async downloadPdf() {
          if (!this._requireBracketAuth()) return;
          if (!this.isBracketSubmitted() || !this.isBracketComplete()) {
            showToast('Submit your complete bracket prediction before downloading.', 'warning');
            return;
          }
          if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            showToast('PDF libraries failed to load. Please refresh the page.', 'error');
            return;
          }

          const exportArea = document.getElementById('bp-export-area');
          const wrapper = document.getElementById('bp-bracket-wrapper');
          const champBox = document.getElementById('bp-champion-box');
          if (!exportArea || !wrapper) return;

          const hasChampion = !!this.matches[30].winner;
          const champion = hasChampion ? this.matches[30][this.matches[30].winner] : null;
          showToast('Generating PDF...', 'info');

          const savedWrapperOverflow = wrapper.style.overflow;
          const savedWrapperWidth = wrapper.style.width;
          const savedWrapperHeight = wrapper.style.height;
          const savedExportOverflow = exportArea.style.overflow;
          const savedExportWidth = exportArea.style.width;

          this.closeAllDropdowns();
          exportArea.classList.add('bp-export-capturing');

          this._preparePdfCapture(wrapper);
          if (hasChampion && champBox) this._preparePdfCapture(champBox);

          wrapper.style.overflow = 'visible';
          wrapper.style.width = wrapper.scrollWidth + 'px';
          wrapper.style.height = wrapper.scrollHeight + 'px';
          exportArea.style.overflow = 'visible';
          exportArea.style.width = wrapper.scrollWidth + 'px';

          await new Promise(r => setTimeout(r, 50));
          this.alignMatchesAndDrawConnectors();
          await new Promise(r => setTimeout(r, 100));

          try {
            const captureScale = this._getPdfCaptureScale();
            const compositeCanvas = await this._buildBracketCompositeImage(
              wrapper, champBox, hasChampion, captureScale
            );
            const fittedCanvas = this._fitCanvasToMaxSize(compositeCanvas, 1800, 2600);
            const exportImage = this._canvasToJpegImage(fittedCanvas, 0.76);

            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
            const pageW = pdf.internal.pageSize.getWidth();
            const pageH = pdf.internal.pageSize.getHeight();
            const margin = 4;
            const footerReserve = 11;
            const availW = pageW - margin * 2;
            const availH = pageH - margin * 2 - footerReserve;

            let drawW = availW;
            let drawH = (exportImage.height / exportImage.width) * drawW;
            if (drawH > availH) {
              drawH = availH;
              drawW = (exportImage.width / exportImage.height) * drawH;
            }
            const drawX = (pageW - drawW) / 2;
            const drawY = margin + (availH - drawH) / 2;

            pdf.addImage(exportImage.data, exportImage.format, drawX, drawY, drawW, drawH);

            let logoImg = null;
            try {
              logoImg = await this._loadPdfLogoImage();
            } catch (e) {
              console.warn('PDF logo unavailable:', e);
            }
            this._addPdfBranding(pdf, pageW, pageH, logoImg);

            const slug = hasChampion
              ? champion.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              : 'full-bracket';
            const filename = `footytrivia-bracket-2026-${slug}.pdf`;
            this._savePdfFile(pdf, filename);
            showToast('Single-page bracket PDF ready!', 'success');
          } catch (err) {
            console.error('PDF export failed:', err);
            showToast('Failed to generate PDF. Please try again.', 'error');
          } finally {
            wrapper.style.overflow = savedWrapperOverflow;
            wrapper.style.width = savedWrapperWidth;
            wrapper.style.height = savedWrapperHeight;
            exportArea.style.overflow = savedExportOverflow;
            exportArea.style.width = savedExportWidth;
            exportArea.classList.remove('bp-export-capturing');
            this.alignMatchesAndDrawConnectors();
          }
        }

        // ── RESET ──
        reset() {
          if (!this._requireBracketAuth()) return;
          if (!confirm('Reset the entire knockout bracket?')) return;
          this.matches.forEach(m => { m.home = null; m.away = null; m.winner = null; });
          localStorage.removeItem(this.storageKey);
          localStorage.removeItem('wc_bracket_state_manual_groups');
          localStorage.removeItem('wc_bracket_state');
          this.clearBracketSubmitted();
          this.syncRound32Matchups();
          this.renderBracket();
          this.renderProgress();
          this.updateChampionDisplay();
          this.updateDownloadButton();
          showToast('Bracket reset successfully.', 'success');
        }

        async submit() {
          if (!this._requireBracketAuth()) return;
          const incomplete = this.matches.find(m => !m.winner);
          if (incomplete) {
            showToast('Please complete all fixture predictions before submitting!', 'error');
            return;
          }
          const champion = this.matches[30][this.matches[30].winner];
          this.markBracketSubmitted();
          this.saveBracket();
          const saved = await syncWcPredictionsToApi();
          updatePredictorProfile();
          this.updateDownloadButton();
          if (saved) {
            showToast(`Bracket submitted! Predicted champion: ${champion.name}`, 'success');
          } else {
            showToast('Bracket saved locally but could not sync to your account. Please try again.', 'error');
          }
        }
      }
      // Analytics State variables
      let filteredPlayers = [];
      let analyticsSortCol = 'rating';
      let analyticsSortAsc = false;
      let activeVisTab = 'scatter'; // 'scatter' or 'teams'
      let canvasMouseHandlerSet = false;
      let hoveredPlayer = null;

      function getSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
      }

      function getDeterministicVal(seed, min, max, decimalPlaces = 0) {
        const val = min + (seed % 1000) / 1000 * (max - min);
        if (decimalPlaces === 0) {
          return Math.round(val);
        }
        return parseFloat(val.toFixed(decimalPlaces));
      }

      function findWcPlayer(scorerName, teamName) {
        if (!scorerName) return null;
        const clean = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const scorerClean = clean(scorerName);
        const scorerWords = scorerClean.split(/\s+/);
        
        let bestMatch = null;
        let bestScore = 0;
        
        window.WC_PLAYERS.forEach(p => {
          if (p.team !== teamName) return;
          
          const pClean = clean(p.name);
          const pWords = pClean.split(/\s+/);
          
          if (pClean === scorerClean) {
            bestMatch = p;
            bestScore = 999;
            return;
          }
          
          let score = 0;
          scorerWords.forEach(sw => {
            if (pClean.includes(sw)) score += 2;
          });
          pWords.forEach(pw => {
            if (scorerClean.includes(pw)) score += 2;
          });
          
          if (score > bestScore) {
            bestScore = score;
            bestMatch = p;
          }
        });
        
        return bestMatch;
      }

      function enrichPlayerStats() {
        if (!window.WC_PLAYERS) return;

        const REAL_STATS = {
          "balogun": { goals: 2 },
          "kai havertz": { goals: 2 },
          "ayari": { goals: 2 },
          "diallo": { goals: 1 },
          "summerville": { goals: 1 },
          "kamada": { goals: 1 },
          "jamal musiala": { goals: 1 },
          "mcginn": { goals: 1 },
          "quinones": { goals: 1 },
          "nakamura": { goals: 1 },
          "svanberg": { goals: 1 },
          "mauricio": { goals: 1 },
          "brown": { goals: 1 },
          "irankunda": { goals: 1 },
          "rekik": { goals: 1 },
          "isak": { assists: 2 },
          "kimmich": { assists: 2 },
          "gravenberch": { assists: 2 },
          "freeman": { assists: 1 },
          "brahim diaz": { assists: 1 },
          "brahim daz": { assists: 1 },
          "christian pulisic": { assists: 1 },
          "lira": { assists: 1 },
          "florian wirtz": { assists: 1 },
          "mejbri": { assists: 1 },
          "hwang": { assists: 1 },
          "ogawa": { assists: 1 },
          "okon-engstler": { assists: 1 },
          "alvarado": { assists: 1 },
          "gyokeres": { assists: 1 },
          "hickey": { yellowCards: 1 },
          "casemiro": { yellowCards: 1 },
          "gomez": { yellowCards: 1 },
          "curtis": { yellowCards: 1 },
          "jassem gaber": { yellowCards: 1 },
          "alonso": { yellowCards: 1 },
          "mclean": { yellowCards: 1 },
          "de fougerolles": { yellowCards: 1 },
          "mahmoud abunada": { yellowCards: 1 },
          "van de ven": { yellowCards: 1 },
          "pedri": { yellowCards: 1 },
          "khedira": { yellowCards: 1 },
          "roger": { yellowCards: 1 },
          "mokoena": { yellowCards: 1 },
          "adams": { yellowCards: 1 },
          "montes": { redCards: 1 },
          "zwane": { redCards: 1 },
          "sithole": { redCards: 1 }
        };

        const normalizeName = (s) => s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 -]/g, "").toLowerCase() : "";
        
        const mapTeamName = (t, tla) => {
          if (tla === 'USA' || t === 'USA' || t === 'United States') return 'United States';
          if (tla === 'KOR' || t === 'Korea Republic' || t === 'South Korea') return 'South Korea';
          if (tla === 'BIH' || t === 'Bosnia-Herzegovina' || t === 'Bosnia-H.' || t === 'Bosnia & Herzegovina') return 'Bosnia & Herzegovina';
          if (tla === 'CZE' || t === 'Czechia') return 'Czechia';
          if (tla === 'CAN' || t === 'Canada') return 'Canada';
          if (tla === 'PAR' || t === 'Paraguay') return 'Paraguay';
          if (tla === 'TUR' || t === 'Turkey' || t === 'Türkiye' || t === 'Trkiye') return 'Trkiye';
          if (tla === 'CIV' || t === "Côte d'Ivoire" || t === 'Ivory Coast') return 'Ivory Coast';
          if (tla === 'COD' || t === 'Congo DR' || t === 'DR Congo') return 'DR Congo';
          return t;
        };

        // 1. Compile current tournament stats for each team from window.WC_STANDINGS
        const teamStats = {};
        
        // Initialize all player teams to 0 stats
        window.WC_PLAYERS.forEach(p => {
          if (!teamStats[p.team]) {
            teamStats[p.team] = {
              played: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              cleanSheets: 0
            };
          }
        });
        
        if (window.WC_STANDINGS && window.WC_STANDINGS.length > 0) {
          window.WC_STANDINGS.forEach(group => {
            if (group.table) {
              group.table.forEach(row => {
                const teamName = row.team.shortName || row.team.name;
                const normName = mapTeamName(teamName, row.team.tla);
                if (teamStats[normName]) {
                  teamStats[normName].played = row.playedGames || 0;
                  teamStats[normName].goalsFor = row.goalsFor || 0;
                  teamStats[normName].goalsAgainst = row.goalsAgainst || 0;
                  
                  // Estimate clean sheets:
                  let cs = 0;
                  const P = row.playedGames || 0;
                  const GA = row.goalsAgainst || 0;
                  if (P > 0) {
                    if (GA === 0) {
                      cs = P;
                    } else {
                      const seed = getSeed(normName);
                      // cs must be between 0 and P - 1 since GA > 0
                      cs = Math.max(0, Math.min(P - 1, getDeterministicVal(seed, 0, P - 1)));
                    }
                  }
                  teamStats[normName].cleanSheets = cs;
                }
              });
            }
          });
        }

        // 2. Parse today's live/finished matches from window.WC_TODAY_MATCHES
        // to pre-assign goals and track teams that are actively playing.
        const preAssignedGoals = {};
        const teamsActiveToday = new Set();
        
        if (window.WC_TODAY_MATCHES && window.WC_TODAY_MATCHES.length > 0) {
          window.WC_TODAY_MATCHES.forEach(m => {
            const homeT = m.homeTeam ? (m.homeTeam.shortName || m.homeTeam.name) : '';
            const awayT = m.awayTeam ? (m.awayTeam.shortName || m.awayTeam.name) : '';
            const normHome = mapTeamName(homeT, m.homeTeam ? m.homeTeam.tla : undefined);
            const normAway = mapTeamName(awayT, m.awayTeam ? m.awayTeam.tla : undefined);
            
            if (normHome) teamsActiveToday.add(normHome);
            if (normAway) teamsActiveToday.add(normAway);
            
            if (m.goals && m.goals.length > 0) {
              m.goals.forEach(g => {
                const scorerName = g.scorer;
                const scorerTeam = g.team === 'home' ? normHome : normAway;
                const player = findWcPlayer(scorerName, scorerTeam);
                if (player) {
                  preAssignedGoals[player.name] = (preAssignedGoals[player.name] || 0) + 1;
                }
              });
            }
          });
        }

        // 3. For each team, distribute their tournament goals (and pre-assigned goals)
        // and calculate other player stats.
        // To do this cleanly, we'll group players by team.
        const playersByTeam = {};
        window.WC_PLAYERS.forEach(p => {
          if (!playersByTeam[p.team]) {
            playersByTeam[p.team] = [];
          }
          playersByTeam[p.team].push(p);
        });

        Object.keys(playersByTeam).forEach(teamName => {
          const stats = teamStats[teamName] || { played: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 };
          const P = stats.played;
          const GF = stats.goalsFor;
          const GA = stats.goalsAgainst;
          const CS = stats.cleanSheets;
          
          const teamPlayers = playersByTeam[teamName];
          
          // Identify Goalkeepers
          const goalkeepers = teamPlayers.filter(p => p.pos === 'Goalkeeper');
          // Start by finding the primary goalkeeper (highest popularity)
          let primaryGK = null;
          if (goalkeepers.length > 0) {
            primaryGK = goalkeepers.reduce((prev, curr) => ((prev.popularity || 0) > (curr.popularity || 0)) ? prev : curr);
          }
          
          // First pass: Reset stats, determine appearances and matches started
          teamPlayers.forEach(p => {
            const seed = getSeed(p.name);
            const isGK = p.pos === 'Goalkeeper';
            const isDF = p.pos === 'Defender';
            const isMF = p.pos === 'Midfielder';
            const isFW = p.pos === 'Forward';
            
            const normKey = normalizeName(p.name);
            const real = REAL_STATS[normKey] || {};
            
            p.goals = real.goals !== undefined ? real.goals : (preAssignedGoals[p.name] || 0);
            p.assists = real.assists !== undefined ? real.assists : 0;
            
            if (P === 0) {
              // No matches played yet
              p.appearances = 0;
              p.matchesStarted = 0;
              p.minutesPlayed = 0;
              p.rating = 0.0;
              p.cleanSheets = 0;
              p.saves = 0;
              p.shots = 0;
              p.shotsOnTarget = 0;
              p.keyPasses = 0;
              p.chancesCreated = 0;
              p.passAccuracy = 0;
              p.successfulDribbles = 0;
              p.tackles = 0;
              p.interceptions = 0;
              p.clearances = 0;
              p.penaltiesScored = 0;
              p.penaltiesMissed = 0;
              p.freeKickGoals = 0;
              p.ownGoals = 0;
              p.yellowCards = 0;
              p.redCards = 0;
              p.foulsCommitted = 0;
              p.foulsWon = 0;
              p.offsides = 0;
              p.crossesCompleted = 0;
              p.aerialDuelsWon = 0;
              p.possessionWon = 0;
              p.distanceCovered = 0;
              return;
            }
            
            // Determine appearances:
            let app = 0;
            let started = 0;
            
            if (isGK) {
              if (p === primaryGK) {
                app = P;
                started = P;
              } else {
                app = 0;
                started = 0;
              }
            } else {
              // Outfield players
              const pop = p.popularity || 70;
              if (pop >= 88) {
                // Key player
                app = P;
                started = P;
              } else if (pop >= 75) {
                // Regular player
                app = getDeterministicVal(seed, Math.ceil(P * 0.4), P);
                started = getDeterministicVal(seed + 1, Math.max(0, app - 1), app);
              } else {
                // Squad player
                app = getDeterministicVal(seed, 0, Math.floor(P * 0.3));
                started = getDeterministicVal(seed + 1, 0, Math.floor(app * 0.5));
              }
            }
            
            p.appearances = app;
            p.matchesStarted = started;
            p.minutesPlayed = started * 90 + (app - started) * getDeterministicVal(seed + 2, 15, 30);
            
            // Clean Sheets
            if (isGK && p === primaryGK) {
              p.cleanSheets = CS;
            } else if (isDF && app > 0) {
              p.cleanSheets = Math.min(app, CS);
            } else {
              p.cleanSheets = 0;
            }
            
            // Saves (only primary Goalkeeper)
            if (isGK && p === primaryGK) {
              p.saves = Math.round(GA * 0.8 + getDeterministicVal(seed + 3, 1, 3) * P);
            } else {
              p.saves = 0;
            }
            
            // Scale other performance metrics by appearances
            if (app > 0) {
              if (isFW) {
                p.shots = app * getDeterministicVal(seed + 4, 2, 4);
                p.shotsOnTarget = Math.round(p.shots * getDeterministicVal(seed + 5, 0.4, 0.6, 2));
                p.keyPasses = app * getDeterministicVal(seed + 6, 1, 2);
                p.chancesCreated = Math.round(p.keyPasses * getDeterministicVal(seed + 7, 1.0, 1.3, 2));
                p.successfulDribbles = app * getDeterministicVal(seed + 8, 2, 4);
                p.tackles = app * getDeterministicVal(seed + 9, 0, 1);
                p.interceptions = 0;
                p.clearances = 0;
                p.offsides = getDeterministicVal(seed + 10, 1, 2) * app;
                p.crossesCompleted = getDeterministicVal(seed + 11, 0, 2) * app;
              } else if (isMF) {
                p.shots = app * getDeterministicVal(seed + 4, 1, 2);
                p.shotsOnTarget = Math.round(p.shots * getDeterministicVal(seed + 5, 0.3, 0.5, 2));
                p.keyPasses = app * getDeterministicVal(seed + 6, 2, 4);
                p.chancesCreated = Math.round(p.keyPasses * getDeterministicVal(seed + 7, 1.1, 1.4, 2));
                p.successfulDribbles = app * getDeterministicVal(seed + 8, 1, 3);
                p.tackles = app * getDeterministicVal(seed + 9, 1, 2);
                p.interceptions = app * getDeterministicVal(seed + 12, 1, 2);
                p.clearances = 0;
                p.offsides = 0;
                p.crossesCompleted = getDeterministicVal(seed + 11, 1, 3) * app;
              } else if (isDF) {
                p.shots = app > 1 ? getDeterministicVal(seed + 4, 0, 1) : 0;
                p.shotsOnTarget = 0;
                p.keyPasses = 0;
                p.chancesCreated = 0;
                p.successfulDribbles = 0;
                p.tackles = app * getDeterministicVal(seed + 9, 2, 4);
                p.interceptions = app * getDeterministicVal(seed + 12, 2, 4);
                p.clearances = app * getDeterministicVal(seed + 13, 3, 6);
                p.offsides = 0;
                p.crossesCompleted = 0;
              } else {
                p.shots = 0;
                p.shotsOnTarget = 0;
                p.keyPasses = 0;
                p.chancesCreated = 0;
                p.successfulDribbles = 0;
                p.tackles = 0;
                p.interceptions = 0;
                p.clearances = 0;
                p.offsides = 0;
                p.crossesCompleted = 0;
              }
              
              if (isGK) p.passAccuracy = getDeterministicVal(seed + 14, 60, 78);
              else if (isDF) p.passAccuracy = getDeterministicVal(seed + 14, 85, 94);
              else if (isMF) p.passAccuracy = getDeterministicVal(seed + 14, 82, 92);
              else p.passAccuracy = getDeterministicVal(seed + 14, 70, 85);
              
              p.yellowCards = real.yellowCards !== undefined ? real.yellowCards : 0;
              p.redCards = real.redCards !== undefined ? real.redCards : 0;
              p.ownGoals = (seed % 101 === 0 && app > 1) ? 1 : 0;
              
              p.foulsCommitted = app * getDeterministicVal(seed + 16, 1, 2);
              p.foulsWon = app * getDeterministicVal(seed + 17, 1, 3);
              p.aerialDuelsWon = app * getDeterministicVal(seed + 18, 1, 4);
              p.possessionWon = app * getDeterministicVal(seed + 19, 2, 6);
              p.distanceCovered = parseFloat((p.minutesPlayed * 0.11).toFixed(1));
            }
          });
          
          // Real-world statistics are mapped directly from REAL_STATS, no deterministic distribution needed.
          
          // Fix performance metrics logical consistency
          teamPlayers.forEach(p => {
            if (p.appearances > 0) {
              p.shotsOnTarget = Math.max(p.shotsOnTarget || 0, p.goals || 0);
              p.shots = Math.max(p.shots || 0, p.shotsOnTarget || 0);
              p.keyPasses = Math.max(p.keyPasses || 0, p.assists || 0);
              p.chancesCreated = Math.max(p.chancesCreated || 0, p.keyPasses || 0);
            }
          });

          // Calculate rating and update penalty stats
          teamPlayers.forEach(p => {
            if (p.appearances > 0) {
              const seed = getSeed(p.name);
              // Base form rating
              let r = p.form || getDeterministicVal(seed, 6.2, 7.8, 1);
              
              // Boost rating for goals, assists, clean sheets, saves
              r += p.goals * 0.4;
              r += p.assists * 0.3;
              if (p.pos === 'Goalkeeper') {
                r += p.cleanSheets * 0.5;
                r += Math.min(1.5, p.saves * 0.05);
              } else if (p.pos === 'Defender') {
                r += p.cleanSheets * 0.3;
              }
              
              // Penalize cards
              if (p.redCards > 0) r -= 1.5;
              else if (p.yellowCards > 0) r -= 0.3 * p.yellowCards;
              
              p.rating = parseFloat(Math.min(9.9, Math.max(5.0, r)).toFixed(1));
              
              // Penalties & Free Kicks: keep them consistent with goals scored
              if (p.goals > 0) {
                p.penaltiesScored = (seed % 7 === 0) ? Math.min(p.goals, 1) : 0;
                p.freeKickGoals = (seed % 11 === 0 && p.goals > p.penaltiesScored) ? 1 : 0;
              } else {
                p.penaltiesScored = 0;
                p.freeKickGoals = 0;
              }
              p.penaltiesMissed = (seed % 17 === 0 && p.penaltiesScored > 0) ? 1 : 0;
            } else {
              p.rating = 0.0;
              p.penaltiesScored = 0;
              p.freeKickGoals = 0;
              p.penaltiesMissed = 0;
            }
          });
        });
      }

      function populateTeamDropdown() {
        const teamSelect = document.getElementById('wc-analytics-team');
        if (!teamSelect) return;
        
        const groupVal = document.getElementById('wc-analytics-group').value;
        teamSelect.innerHTML = '<option value="all">All Teams</option>';
        
        let teams = [];
        if (groupVal === 'all') {
          Object.values(window.WC_GROUPS).forEach(grp => {
            grp.teams.forEach(t => teams.push(t));
          });
        } else if (window.WC_GROUPS[groupVal]) {
          teams = window.WC_GROUPS[groupVal].teams;
        }
        
        teams.sort((a,b) => a.name.localeCompare(b.name));
        
        teams.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.name;
          opt.textContent = t.name;
          teamSelect.appendChild(opt);
        });
      }

      async function initAnalyticsTab() {
        populateTeamDropdown();
        
        document.getElementById('wc-analytics-search').value = '';
        hideAnalyticsSearchSuggestions();
        document.getElementById('wc-analytics-group').value = 'all';
        document.getElementById('wc-analytics-team').value = 'all';
        document.getElementById('wc-analytics-position').value = 'all';
        document.getElementById('wc-analytics-stage').value = 'all';
        
        // Initial render with currently cached/local data
        filterAnalyticsData();
        setupCanvasInteraction();

        // Dynamically fetch live tournament stats if they are empty
        try {
          const promises = [];
          if (!window.WC_STANDINGS || window.WC_STANDINGS.length === 0) {
            promises.push(
              fetch(`${API_BASE_URL}/api/wc/standings`, { credentials: 'omit' })
                .then(r => r.json())
                .then(d => { window.WC_STANDINGS = d.standings || []; })
            );
          }
          if (!window.WC_TODAY_MATCHES || window.WC_TODAY_MATCHES.length === 0) {
            promises.push(
              fetch(`${API_BASE_URL}/api/wc/matches`, { credentials: 'omit' })
                .then(r => r.json())
                .then(d => { window.WC_TODAY_MATCHES = d.matches || []; })
            );
          }
          if (promises.length > 0) {
            await Promise.all(promises);
            populateTeamDropdown();
            filterAnalyticsData();
          }
        } catch (err) {
          console.error('Failed to pre-fetch standings/matches for analytics:', err);
        }
      }

      function onGroupFilterChange() {
        populateTeamDropdown();
        filterAnalyticsData();
      }

      function filterAnalyticsData() {
        const search = document.getElementById('wc-analytics-search').value.toLowerCase();
        const group = document.getElementById('wc-analytics-group').value;
        const team = document.getElementById('wc-analytics-team').value;
        const position = document.getElementById('wc-analytics-position').value;
        const stage = document.getElementById('wc-analytics-stage').value;
        
        enrichPlayerStats();
        
        filteredPlayers = window.WC_PLAYERS.filter(p => {
          if (search && !p.name.toLowerCase().includes(search)) return false;
          if (position !== 'all' && p.pos !== position) return false;
          if (team !== 'all' && p.team !== team) return false;
          
          if (group !== 'all' && team === 'all') {
            const grpTeams = window.WC_GROUPS[group].teams.map(t => t.name);
            if (!grpTeams.includes(p.team)) return false;
          }
          
          const seed = getSeed(p.name);
          if (stage === 'group' && (seed % 3 === 0)) return false;
          if (stage === 'knockout' && (seed % 3 !== 0)) return false;
          
          return true;
        });
        
        sortAnalyticsDataArray(analyticsSortCol, false);
        updateOverviewStats();
        updateAdvancedLeaderboards();
        drawAnalyticsChart();
      }

      function getShortPlayerName(name) {
        const parts = name.trim().split(/\s+/);
        return parts.length > 1 ? parts[parts.length - 1] : name;
      }

      function onAnalyticsSearchInput() {
        updateAnalyticsSearchSuggestions();
        filterAnalyticsData();
      }

      function updateAnalyticsSearchSuggestions() {
        const input = document.getElementById('wc-analytics-search');
        const list = document.getElementById('wc-analytics-search-suggestions');
        if (!input || !list) return;

        const q = input.value.trim().toLowerCase();
        if (!q) {
          list.innerHTML = '';
          list.style.display = 'none';
          return;
        }

        enrichPlayerStats();
        const matches = window.WC_PLAYERS.filter(p =>
          p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
        ).slice(0, 8);

        if (matches.length === 0) {
          list.innerHTML = '<div class="wc-search-suggestion-empty">No players found</div>';
        } else {
          list.innerHTML = matches.map(p => `
            <button type="button" class="wc-search-suggestion" onmousedown="selectAnalyticsPlayer('${p.name.replace(/'/g, "\\'")}')">
              <span class="wc-search-suggestion-name">${p.name}</span>
              <span class="wc-search-suggestion-team">${p.team}</span>
            </button>
          `).join('');
        }
        list.style.display = 'block';
      }

      function hideAnalyticsSearchSuggestions() {
        setTimeout(() => {
          const list = document.getElementById('wc-analytics-search-suggestions');
          if (list) list.style.display = 'none';
        }, 150);
      }

      function selectAnalyticsPlayer(name) {
        const input = document.getElementById('wc-analytics-search');
        if (input) input.value = name;
        hideAnalyticsSearchSuggestions();
        filterAnalyticsData();
        hoveredPlayer = filteredPlayers.find(p => p.name === name) || null;
        drawAnalyticsChart();
      }

      function sortAnalyticsDataArray(colName, toggle = true) {
        if (toggle) {
          if (analyticsSortCol === colName) {
            analyticsSortAsc = !analyticsSortAsc;
          } else {
            analyticsSortCol = colName;
            analyticsSortAsc = false;
          }
        }
        
        filteredPlayers.sort((a, b) => {
          let valA = a[colName];
          let valB = b[colName];
          
          if (colName === 'rating') {
            valA = a.rating;
            valB = b.rating;
          }
          
          if (typeof valA === 'string') {
            return analyticsSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
          } else {
            valA = valA || 0;
            valB = valB || 0;
            return analyticsSortAsc ? valA - valB : valB - valA;
          }
        });
      }

      function updateOverviewStats() {
        let totalGoals = 0;
        let totalCleanSheets = 0;
        let totalYellow = 0;
        let totalRed = 0;
        let ratingSum = 0;
        let totalMins = 0;
        
        filteredPlayers.forEach(p => {
          totalGoals += p.goals || 0;
          totalCleanSheets += p.cleanSheets || 0;
          totalYellow += p.yellowCards || 0;
          totalRed += p.redCards || 0;
          ratingSum += p.rating || 0;
          totalMins += p.minutesPlayed || 0;
        });
        
        const count = filteredPlayers.length || 1;
        const avgRating = ratingSum / count;
        const matchesCount = Math.max(12, Math.round(totalMins / 220)) || 12;
        
        const tourneyGoalsTotal = document.getElementById('tourney-goals-total');
        if (tourneyGoalsTotal) tourneyGoalsTotal.textContent = totalGoals;
        
        const tourneyMatchesTotal = document.getElementById('tourney-matches-total');
        if (tourneyMatchesTotal) tourneyMatchesTotal.textContent = matchesCount;
        
        const tourneyGoalsAvg = document.getElementById('tourney-goals-avg');
        if (tourneyGoalsAvg) tourneyGoalsAvg.textContent = (totalGoals / matchesCount).toFixed(2);
        
        const tourneyCleanSheets = document.getElementById('tourney-clean-sheets');
        if (tourneyCleanSheets) tourneyCleanSheets.textContent = totalCleanSheets;
        
        const tourneyYellowCards = document.getElementById('tourney-yellow-cards');
        if (tourneyYellowCards) tourneyYellowCards.textContent = totalYellow + ' 🟨';
        
        const tourneyRedCards = document.getElementById('tourney-red-cards');
        if (tourneyRedCards) tourneyRedCards.textContent = totalRed + ' 🟥';
        
        const tourneyAvgRating = document.getElementById('tourney-avg-rating');
        if (tourneyAvgRating) tourneyAvgRating.textContent = avgRating.toFixed(2);
      }

      function updateAdvancedLeaderboards() {
        const grid = document.getElementById('advanced-leaderboards-grid');
        if (!grid) return;
        
        const categories = [
          { title: '⚽ Golden Boot', key: 'goals', color: 'var(--gold)', unit: 'goals' },
          { title: '🎯 Assists', key: 'assists', color: 'var(--accent)', unit: 'assists' },
          { title: '🛡️ Clean Sheets', key: 'cleanSheets', color: 'var(--green)', unit: 'CS' },
          { title: '🪄 Key Passes', key: 'keyPasses', color: 'var(--gold)', unit: 'passes' },
          { title: '🧤 Saves', key: 'saves', color: 'var(--accent)', unit: 'saves' },
          { title: '🟨 Yellow Cards', key: 'yellowCards', color: '#facc15', unit: 'cards' },
          { title: '🟥 Red Cards', key: 'redCards', color: '#ef4444', unit: 'cards' },
          { title: '🥅 Own Goals', key: 'ownGoals', color: 'var(--text2)', unit: 'own goals' }
        ];
        
        grid.innerHTML = '';
        
        categories.forEach(cat => {
          // Sort with tournament tie breakers
          const sorted = [...filteredPlayers].sort((a, b) => {
            const valA = a[cat.key] || 0;
            const valB = b[cat.key] || 0;
            if (valB !== valA) return valB - valA;
            
            // Tie breakers
            if (cat.key === 'goals') {
              const assistsA = a.assists || 0;
              const assistsB = b.assists || 0;
              if (assistsB !== assistsA) return assistsB - assistsA;
              return (a.minutesPlayed || 0) - (b.minutesPlayed || 0);
            }
            if (cat.key === 'assists') {
              const goalsA = a.goals || 0;
              const goalsB = b.goals || 0;
              if (goalsB !== goalsA) return goalsB - goalsA;
              return (a.minutesPlayed || 0) - (b.minutesPlayed || 0);
            }
            return (a.minutesPlayed || 0) - (b.minutesPlayed || 0);
          });
          
          const top5 = sorted.slice(0, 5);
          
          const card = document.createElement('div');
          card.className = 'wc-card';
          card.style.padding = '0.75rem';
          card.style.background = 'rgba(255,255,255,0.02)';
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.gap = '0.25rem';
          
          let rowsHtml = '';
          if (top5.length === 0) {
            rowsHtml = '<div style="color:var(--text3);font-size:0.75rem;padding:1.5rem 0;text-align:center;">No data</div>';
          } else {
            top5.forEach((p, idx) => {
              const val = p[cat.key] || 0;
              const initials = p.name ? p.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';
              const flag = getFlagImg(p.team);
              const rank = idx + 1;
              const posAbbr = p.pos === 'Goalkeeper' ? 'GK' : p.pos === 'Defender' ? 'DF' : p.pos === 'Midfielder' ? 'MF' : 'FW';
              
              rowsHtml += `
                <div class="wc-leaderboard-row" onclick="openPlayerProfileModal('${p.name.replace(/'/g, "\\'")}')">
                  <div class="wc-leaderboard-player">
                    <span class="wc-leaderboard-rank rank-${rank}">${rank}</span>
                    <div class="wc-leaderboard-avatar-frame">
                      <span class="wc-leaderboard-avatar-initials">${initials}</span>
                      <img class="wc-leaderboard-avatar-img" data-player="${p.name.replace(/'/g, "\\'")}" src="" style="display:none;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';">
                    </div>
                    <div class="wc-leaderboard-meta">
                      <div class="wc-leaderboard-name" title="${p.name}">${p.name}</div>
                      <div class="wc-leaderboard-sub">
                        ${flag}
                        <span class="wc-leaderboard-pos-badge">${posAbbr}</span>
                        <span class="wc-leaderboard-team" title="${p.team}">${p.team}</span>
                      </div>
                    </div>
                  </div>
                  <div class="wc-leaderboard-stats">
                    <div class="wc-leaderboard-playtime">
                      <div class="wc-leaderboard-stat-item">${p.appearances || 0}<span class="lbl">MP</span></div>
                      <div class="wc-leaderboard-stat-item">${p.minutesPlayed || 0}<span class="lbl">m</span></div>
                    </div>
                    <div class="wc-leaderboard-value-badge" style="background:${cat.color}15; border:1px solid ${cat.color}30; color:${cat.color}">
                      <span>${val}</span>
                    </div>
                  </div>
                </div>
              `;
            });
          }
          
          card.innerHTML = `
            <div style="font-family:var(--font-display);font-size:0.8rem;font-weight:800;color:var(--text);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:0.4rem;">${cat.title}</div>
            <div style="display:flex;flex-direction:column;flex:1;">
              ${rowsHtml}
            </div>
          `;
          grid.appendChild(card);
        });

        // Asynchronously load player images for the leaderboards
        grid.querySelectorAll('.wc-leaderboard-avatar-img').forEach(img => {
          const playerName = img.getAttribute('data-player');
          getPlayerPhoto(playerName, (url) => {
            if (url) {
              img.src = url;
            }
          });
        });
      }

      function openPlayerProfileModal(playerName) {
        const player = window.WC_PLAYERS.find(p => p.name === playerName);
        if (!player) return;
        
        enrichPlayerStats();
        
        const flagHtml = getLeaderboardFlagImg(player.team);
        
        const nameEl = document.getElementById('profile-modal-name');
        if (nameEl) nameEl.textContent = player.name;
        
        const flagEl = document.getElementById('profile-modal-flag');
        if (flagEl) flagEl.innerHTML = flagHtml;
        
        const clubEl = document.getElementById('profile-modal-club');
        if (clubEl) clubEl.textContent = `${player.club || 'National Team'} | ${player.subPos || player.pos}`;
        
        const ratingEl = document.getElementById('profile-modal-rating');
        if (ratingEl) ratingEl.textContent = player.rating.toFixed(1);
        
        const formEl = document.getElementById('profile-modal-form');
        if (formEl) formEl.textContent = player.formIndicator || '🔥 In Form';
        
        const valEl = document.getElementById('profile-modal-val');
        if (valEl) valEl.textContent = player.marketValue ? `€${player.marketValue}M` : 'N/A';
        
        const ageEl = document.getElementById('profile-modal-age');
        if (ageEl) ageEl.textContent = `Age: ${player.age || 'N/A'}`;
        
        const attrContainer = document.getElementById('profile-modal-attributes');
        if (attrContainer) {
          attrContainer.innerHTML = '';
          
          let attrs = [];
          if (player.pos === 'Forward') {
            attrs = [
              { name: 'Pace', val: getDeterministicVal(getSeed(player.name) + 30, 80, 97) },
              { name: 'Shooting', val: getDeterministicVal(getSeed(player.name) + 31, 82, 98) },
              { name: 'Passing', val: getDeterministicVal(getSeed(player.name) + 32, 70, 92) },
              { name: 'Dribbling', val: getDeterministicVal(getSeed(player.name) + 33, 80, 98) },
              { name: 'Defending', val: getDeterministicVal(getSeed(player.name) + 34, 30, 55) },
              { name: 'Physical', val: getDeterministicVal(getSeed(player.name) + 35, 65, 88) }
            ];
          } else if (player.pos === 'Midfielder') {
            attrs = [
              { name: 'Pace', val: getDeterministicVal(getSeed(player.name) + 30, 70, 88) },
              { name: 'Shooting', val: getDeterministicVal(getSeed(player.name) + 31, 68, 86) },
              { name: 'Passing', val: getDeterministicVal(getSeed(player.name) + 32, 82, 98) },
              { name: 'Dribbling', val: getDeterministicVal(getSeed(player.name) + 33, 80, 94) },
              { name: 'Defending', val: getDeterministicVal(getSeed(player.name) + 34, 60, 82) },
              { name: 'Physical', val: getDeterministicVal(getSeed(player.name) + 35, 70, 90) }
            ];
          } else if (player.pos === 'Defender') {
            attrs = [
              { name: 'Pace', val: getDeterministicVal(getSeed(player.name) + 30, 72, 89) },
              { name: 'Shooting', val: getDeterministicVal(getSeed(player.name) + 31, 40, 65) },
              { name: 'Passing', val: getDeterministicVal(getSeed(player.name) + 32, 65, 85) },
              { name: 'Dribbling', val: getDeterministicVal(getSeed(player.name) + 33, 60, 80) },
              { name: 'Defending', val: getDeterministicVal(getSeed(player.name) + 34, 84, 98) },
              { name: 'Physical', val: getDeterministicVal(getSeed(player.name) + 35, 80, 96) }
            ];
          } else {
            attrs = [
              { name: 'Diving', val: getDeterministicVal(getSeed(player.name) + 30, 82, 96) },
              { name: 'Handling', val: getDeterministicVal(getSeed(player.name) + 31, 80, 95) },
              { name: 'Kicking', val: getDeterministicVal(getSeed(player.name) + 32, 70, 90) },
              { name: 'Reflexes', val: getDeterministicVal(getSeed(player.name) + 33, 85, 98) },
              { name: 'Speed', val: getDeterministicVal(getSeed(player.name) + 34, 45, 68) },
              { name: 'Positioning', val: getDeterministicVal(getSeed(player.name) + 35, 82, 96) }
            ];
          }
          
          attrs.forEach(attr => {
            const bar = document.createElement('div');
            bar.style.marginBottom = '0.5rem';
            bar.innerHTML = `
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:0.15rem;">
                <span style="color:var(--text2);font-weight:600;">${attr.name}</span>
                <span style="font-weight:700;color:var(--gold);">${attr.val}</span>
              </div>
              <div style="width:100%;height:6px;background:var(--surface3);border-radius:3px;overflow:hidden;">
                <div style="width:${attr.val}%;height:100%;background:linear-gradient(to right, var(--gold), var(--accent));border-radius:3px;"></div>
              </div>
            `;
            attrContainer.appendChild(bar);
          });
        }
        
        const detailedStatsEl = document.getElementById('profile-modal-detailed-stats');
        if (detailedStatsEl) {
          detailedStatsEl.innerHTML = '';
          
          const statsToShow = [
            { label: 'Appearances', val: player.appearances },
            { label: 'Starts', val: player.matchesStarted },
            { label: 'Minutes Played', val: player.minutesPlayed },
            { label: 'Goals', val: player.goals },
            { label: 'Assists', val: player.assists },
            { label: 'Shots', val: player.shots },
            { label: 'Shots on Target', val: player.shotsOnTarget },
            { label: 'Key Passes', val: player.keyPasses },
            { label: 'Chances Created', val: player.chancesCreated },
            { label: 'Pass Accuracy', val: `${player.passAccuracy}%` },
            { label: 'Successful Dribbles', val: player.successfulDribbles },
            { label: 'Tackles', val: player.tackles },
            { label: 'Interceptions', val: player.interceptions },
            { label: 'Clearances', val: player.clearances },
            { label: 'Saves', val: player.saves },
            { label: 'Clean Sheets', val: player.cleanSheets },
            { label: 'Penalties Scored', val: player.penaltiesScored },
            { label: 'Penalties Missed', val: player.penaltiesMissed },
            { label: 'Free Kick Goals', val: player.freeKickGoals },
            { label: 'Own Goals', val: player.ownGoals },
            { label: 'Yellow Cards', val: player.yellowCards },
            { label: 'Red Cards', val: player.redCards },
            { label: 'Fouls Committed', val: player.foulsCommitted },
            { label: 'Fouls Won', val: player.foulsWon },
            { label: 'Offsides', val: player.offsides },
            { label: 'Crosses Completed', val: player.crossesCompleted },
            { label: 'Aerial Duels Won', val: player.aerialDuelsWon },
            { label: 'Possession Won', val: player.possessionWon },
            { label: 'Distance Covered', val: `${player.distanceCovered} km` }
          ];
          
          statsToShow.forEach(stat => {
            const item = document.createElement('div');
            item.style.background = 'rgba(255,255,255,0.02)';
            item.style.padding = '0.5rem';
            item.style.borderRadius = 'var(--r)';
            item.style.border = '1px solid var(--border2)';
            item.innerHTML = `
              <div style="font-size:0.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.02em;margin-bottom:0.15rem;">${stat.label}</div>
              <div style="font-size:0.95rem;font-weight:800;color:var(--text);font-family:var(--font-display);">${stat.val}</div>
            `;
            detailedStatsEl.appendChild(item);
          });
        }
        
        const modal = document.getElementById('player-profile-modal');
        if (modal) modal.style.display = 'flex';
      }

      function closePlayerProfileModal() {
        const modal = document.getElementById('player-profile-modal');
        if (modal) modal.style.display = 'none';
      }

      function drawAnalyticsChart() {
        const canvas = document.getElementById('wc-analytics-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        
        if (filteredPlayers.length === 0) {
          ctx.fillStyle = '#9ca3af';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('No data available with current filters', w / 2, h / 2);
          return;
        }

        if (activeVisTab === 'scatter') {
          drawScatterPlot(ctx, w, h);
        } else {
          drawTeamStatsVis(ctx, w, h);
        }
      }

      function drawScatterPlot(ctx, w, h) {
        const xMetric = document.getElementById('scatter-x-axis').value;
        const yMetric = document.getElementById('scatter-y-axis').value;
        
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        filteredPlayers.forEach(p => {
          const vx = p[xMetric] || 0;
          const vy = p[yMetric] || 0;
          if (vx < minX) minX = vx;
          if (vx > maxX) maxX = vx;
          if (vy < minY) minY = vy;
          if (vy > maxY) maxY = vy;
        });
        
        if (minX === maxX) { minX -= 1; maxX += 1; }
        if (minY === maxY) { minY -= 1; maxY += 1; }
        if (xMetric === 'rating') { maxX = Math.max(maxX, 10.0); minX = Math.min(minX, 6.0); }
        if (yMetric === 'rating') { maxY = Math.max(maxY, 10.0); minY = Math.min(minY, 6.0); }
        
        const xRange = maxX - minX;
        const yRange = maxY - minY;
        minX -= xRange * 0.05;
        maxX += xRange * 0.05;
        minY -= yRange * 0.05;
        maxY += yRange * 0.05;
        
        const padXRange = maxX - minX;
        const padYRange = maxY - minY;
        
        const marginLeft = 55;
        const marginRight = 15;
        const marginTop = 20;
        const marginBottom = 40;
        const searchQuery = (document.getElementById('wc-analytics-search')?.value || '').trim().toLowerCase();
        const useFullNames = searchQuery.length > 0 && filteredPlayers.length <= 12;
        
        const plotW = w - marginLeft - marginRight;
        const plotH = h - marginTop - marginBottom;
        
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        
        const numTicksX = 5;
        for (let i = 0; i <= numTicksX; i++) {
          const val = minX + (padXRange * (i / numTicksX));
          const px = marginLeft + (i / numTicksX) * plotW;
          
          ctx.beginPath();
          ctx.moveTo(px, marginTop);
          ctx.lineTo(px, h - marginBottom);
          ctx.stroke();
          
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(val.toFixed(xMetric === 'rating' ? 1 : 0), px, h - marginBottom + 15);
        }
        
        const numTicksY = 5;
        for (let i = 0; i <= numTicksY; i++) {
          const val = minY + (padYRange * (i / numTicksY));
          const py = h - marginBottom - (i / numTicksY) * plotH;
          
          ctx.beginPath();
          ctx.moveTo(marginLeft, py);
          ctx.lineTo(w - marginRight, py);
          ctx.stroke();
          
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(val.toFixed(yMetric === 'rating' ? 1 : 0), marginLeft - 8, py + 3);
        }
        
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.strokeRect(marginLeft, marginTop, plotW, plotH);
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(getMetricLabel(xMetric), marginLeft + plotW/2, h - 8);
        
        ctx.save();
        ctx.translate(14, marginTop + plotH/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText(getMetricLabel(yMetric), 0, 0);
        ctx.restore();
        
        filteredPlayers.forEach(p => {
          const vx = p[xMetric] || 0;
          const vy = p[yMetric] || 0;
          
          const px = marginLeft + ((vx - minX) / padXRange) * plotW;
          const py = h - marginBottom - ((vy - minY) / padYRange) * plotH;
          
          p.chartX = px;
          p.chartY = py;
          
          let color = '#ef4444';
          if (p.pos === 'Midfielder') color = '#3b82f6';
          else if (p.pos === 'Defender') color = '#10b981';
          else if (p.pos === 'Goalkeeper') color = '#eab308';
          
          const isHovered = hoveredPlayer && hoveredPlayer.name === p.name;
          
          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 9 : 5.5, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          
          ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)';
          ctx.lineWidth = isHovered ? 2.5 : 1;
          ctx.stroke();
          
          if (isHovered) {
            ctx.beginPath();
            ctx.arc(px, py, 14, 0, Math.PI * 2);
            ctx.strokeStyle = color + '44';
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          {
            const label = isHovered || useFullNames ? p.name : getShortPlayerName(p.name);
            const labelX = px + (isHovered ? 10 : 7);
            const labelY = py + (isHovered ? 4 : 3);
            ctx.font = isHovered ? 'bold 10px var(--font-ui), sans-serif' : '9px var(--font-ui), sans-serif';
            const textW = ctx.measureText(label).width;

            ctx.fillStyle = 'rgba(15, 16, 19, 0.75)';
            ctx.fillRect(labelX - 2, labelY - 9, textW + 4, 12);

            ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(229, 231, 235, 0.9)';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, labelX, labelY - 3);
          }
        });
      }

      function drawTeamStatsVis(ctx, w, h) {
        const teamAggregates = {};
        
        filteredPlayers.forEach(p => {
          if (!teamAggregates[p.team]) {
            teamAggregates[p.team] = { team: p.team, ratingSum: 0, count: 0, goals: 0, assists: 0 };
          }
          teamAggregates[p.team].ratingSum += p.rating;
          teamAggregates[p.team].count++;
          teamAggregates[p.team].goals += p.goals || 0;
          teamAggregates[p.team].assists += p.assists || 0;
        });
        
        const teamsList = Object.values(teamAggregates).map(item => {
          return {
            team: item.team,
            rating: item.ratingSum / item.count,
            goals: item.goals,
            assists: item.assists
          };
        });
        
        teamsList.sort((a,b) => b.goals - a.goals || b.rating - a.rating);
        const displayTeams = teamsList.slice(0, 8);
        
        const marginLeft = 100;
        const marginRight = 80;
        const marginTop = 30;
        const marginBottom = 30;
        
        const plotW = w - marginLeft - marginRight;
        const plotH = h - marginTop - marginBottom;
        
        let maxGoals = 1;
        displayTeams.forEach(item => {
          if (item.goals > maxGoals) maxGoals = item.goals;
        });
        
        const barHeight = Math.min(20, plotH / (displayTeams.length || 1) - 6);
        const gap = (plotH - (barHeight * displayTeams.length)) / (displayTeams.length + 1 || 1);
        
        window.teamVisBars = [];
        
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const val = Math.round(maxGoals * (i / 5));
          const px = marginLeft + (i / 5) * plotW;
          
          ctx.beginPath();
          ctx.moveTo(px, marginTop - 5);
          ctx.lineTo(px, h - marginBottom);
          ctx.stroke();
          
          ctx.fillStyle = '#6b7280';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(val, px, h - marginBottom + 14);
        }
        
        displayTeams.forEach((item, index) => {
          const py = marginTop + gap + index * (barHeight + gap);
          const barW = (item.goals / maxGoals) * plotW;
          
          const isHovered = hoveredPlayer && hoveredPlayer.team === item.team;
          
          window.teamVisBars.push({
            x: marginLeft,
            y: py,
            w: barW || 10,
            h: barHeight,
            data: item
          });
          
          ctx.fillStyle = isHovered ? '#ffffff' : '#9ca3af';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(item.team, marginLeft - 8, py + barHeight/2 + 4);
          
          const gradient = ctx.createLinearGradient(marginLeft, py, marginLeft + barW, py);
          gradient.addColorStop(0, '#d97706');
          gradient.addColorStop(1, '#f59e0b');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(marginLeft, py, barW, barHeight, 3);
          ctx.fill();
          
          if (isHovered) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          
          ctx.fillStyle = isHovered ? '#ffffff' : '#e5e7eb';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${item.goals} Goals`, marginLeft + barW + 6, py + barHeight/2 + 4);
        });
        
        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Total Goals Scored by Team (Top 8 Teams)', marginLeft + plotW/2, marginTop - 15);
      }

      function switchVisTab(tabId) {
        activeVisTab = tabId;
        document.getElementById('btn-chart-scatter').classList.toggle('active', tabId === 'scatter');
        document.getElementById('btn-chart-teams').classList.toggle('active', tabId === 'teams');
        document.getElementById('vis-scatter-controls').style.display = tabId === 'scatter' ? 'flex' : 'none';
        hoveredPlayer = null;
        drawAnalyticsChart();
      }

      function updateScatterPlot() {
        drawAnalyticsChart();
      }

      function setupCanvasInteraction() {
        if (canvasMouseHandlerSet) return;
        const canvas = document.getElementById('wc-analytics-chart');
        if (!canvas) return;
        
        const tooltip = document.getElementById('chart-tooltip');
        
        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) * (canvas.width / rect.width);
          const y = (e.clientY - rect.top) * (canvas.height / rect.height);
          
          let found = null;
          
          if (activeVisTab === 'scatter') {
            let minDistance = 10;
            filteredPlayers.forEach(p => {
              if (p.chartX === undefined || p.chartY === undefined) return;
              const dist = Math.hypot(p.chartX - x, p.chartY - y);
              if (dist < minDistance) {
                minDistance = dist;
                found = p;
              }
            });
          } else if (activeVisTab === 'teams') {
            if (window.teamVisBars) {
              window.teamVisBars.forEach(bar => {
                if (x >= bar.x && x <= bar.x + bar.w && y >= bar.y && y <= bar.y + bar.h) {
                  found = bar.data;
                }
              });
            }
          }
          
          if (found !== hoveredPlayer) {
            hoveredPlayer = found;
            drawAnalyticsChart();
          }
          
          if (hoveredPlayer) {
            canvas.style.cursor = 'pointer';
            tooltip.style.opacity = '1';
            
            tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
            tooltip.style.top = (e.clientY - rect.top - 15) + 'px';
            
            if (activeVisTab === 'scatter') {
              const xMetric = document.getElementById('scatter-x-axis').value;
              const yMetric = document.getElementById('scatter-y-axis').value;
              
              tooltip.innerHTML = `
                <div style="font-weight:700;color:var(--gold);margin-bottom:0.25rem">${escapeHtml(hoveredPlayer.name)}</div>
                <div style="font-size:0.7rem;color:var(--text3);margin-bottom:0.25rem">${escapeHtml(hoveredPlayer.team)} | ${escapeHtml(hoveredPlayer.pos)}</div>
                <div>${getMetricLabel(xMetric)}: <strong>${hoveredPlayer[xMetric]}</strong></div>
                <div>${getMetricLabel(yMetric)}: <strong>${hoveredPlayer[yMetric]}</strong></div>
              `;
            } else {
              tooltip.innerHTML = `
                <div style="font-weight:700;color:var(--gold);margin-bottom:0.25rem">${escapeHtml(hoveredPlayer.team)}</div>
                <div>Average Player Rating: <strong>${hoveredPlayer.rating.toFixed(2)}</strong></div>
                <div>Total Goals: <strong>${hoveredPlayer.goals}</strong></div>
                <div>Total Assists: <strong>${hoveredPlayer.assists}</strong></div>
              `;
            }
          } else {
            canvas.style.cursor = 'crosshair';
            tooltip.style.opacity = '0';
          }
        });
        
        canvas.addEventListener('mouseleave', () => {
          hoveredPlayer = null;
          tooltip.style.opacity = '0';
          drawAnalyticsChart();
        });
        
        canvas.addEventListener('click', () => {
          if (activeVisTab === 'scatter' && hoveredPlayer) {
            openPlayerProfileModal(hoveredPlayer.name);
          }
        });
        
        canvasMouseHandlerSet = true;
      }

      function getMetricLabel(metric) {
        const labels = {
          rating: 'Rating',
          minutesPlayed: 'Minutes Played',
          shots: 'Shots',
          keyPasses: 'Key Passes',
          distanceCovered: 'Distance Covered (km)',
          goals: 'Goals',
          assists: 'Assists',
          shotsOnTarget: 'Shots on Target',
          chancesCreated: 'Chances Created'
        };
        return labels[metric] || metric;
      }

      window.switchVisTab = switchVisTab;
      window.updateScatterPlot = updateScatterPlot;
      window.onGroupFilterChange = onGroupFilterChange;
      window.filterAnalyticsData = filterAnalyticsData;
      window.onAnalyticsSearchInput = onAnalyticsSearchInput;
      window.hideAnalyticsSearchSuggestions = hideAnalyticsSearchSuggestions;
      window.selectAnalyticsPlayer = selectAnalyticsPlayer;
      window.openPlayerProfileModal = openPlayerProfileModal;
      window.closePlayerProfileModal = closePlayerProfileModal;
      window.initAnalyticsTab = initAnalyticsTab;
      window.switchWCTab = switchWCTab;
      window.renderWCLeaderboard = renderWCLeaderboard;
      window.requireLoginForPredictions = requireLoginForPredictions;
      window.moveTeam = moveTeam;
      window.saveMatchPrediction = saveMatchPrediction;
      window.submitGroupPredictions = submitGroupPredictions;
      window.resetPredictions = resetPredictions;
      window.confirmThirdPlaceQualifiers = confirmThirdPlaceQualifiers;
      window.submitAwardPredictions = submitAwardPredictions;
      window.resetAwardPredictions = resetAwardPredictions;
      window.closeSelectorModalOutside = closeSelectorModalOutside;
      window.closeSelectorModal = closeSelectorModal;
      window.openSelectorModal = openSelectorModal;
      window.filterSelectorItems = filterSelectorItems;
      window.clearModalSearch = clearModalSearch;
      window.applyFilters = applyFilters;
      window.selectSelectorItemFromModal = selectSelectorItemFromModal;
      window.selectPositionFilter = selectPositionFilter;
      window.toggleThirdPlaceTeam = toggleThirdPlaceTeam;

      function requireLoginForBracket() {
        if (state.user) return true;
        showToast('Please log in to use the Knockout Bracket Predictor.', 'warning');
        openModal('login');
        return false;
      }

      function requireLoginForPredictions() {
        if (state.user) return true;
        closeSelectorModal();
        showToast('Please log in or sign up to make predictions.', 'warning');
        openModal('login');
        return false;
      }

      function syncPredictionCenterGuestUI() {
        const predictionsTab = document.getElementById('wc-predictions');
        const notice = document.getElementById('wc-predictions-guest-notice');
        const isGuest = !state.user;
        if (predictionsTab) predictionsTab.classList.toggle('wc-predictions-guest', isGuest);
        if (notice) notice.style.display = isGuest ? '' : 'none';
      }

      function updatePredictionCenterAuthUI() {
        syncPredictionCenterGuestUI();
        if (document.getElementById('wc-predictions')?.style.display !== 'none') {
          renderGroupPredictions();
          renderMatchPredictions();
        }
        const thirdPanel = document.getElementById('third-place-selection-panel');
        if (thirdPanel && thirdPanel.style.display !== 'none') {
          renderThirdPlaceSelection();
        }
        const selectorModal = document.getElementById('wc-selector-modal');
        if (selectorModal && selectorModal.style.display === 'flex') {
          renderSelectorGrid();
        }
      }

      const bracketPredictor = new BracketPredictor();
      window.bracketPredictor = bracketPredictor;
      bracketPredictor.restoreBracketState({ render: false });
      let bracketInitialized = false;
      function syncWcMobileNavSub(tabId) {
        const onWc = state.currentPage === 'worldcup';
        document.querySelectorAll('.wc-mobile-tab').forEach(el => {
          el.classList.toggle('active', onWc && el.dataset.wcTab === tabId);
        });
      }

      function toggleWcMobileNav(btn) {
        const sub = document.getElementById('wc-mobile-nav-sub');
        if (!sub) return;
        const opening = !sub.classList.contains('open');
        sub.classList.toggle('open');
        btn.classList.toggle('expanded');
        if (opening) {
          if (state.currentPage === 'worldcup') {
            const activeTabBtn = document.querySelector('.wc-nav-tabs .wc-tab.active');
            const tabId = activeTabBtn
              ? activeTabBtn.getAttribute('onclick').match(/'([^']+)'/)[1]
              : 'dashboard';
            syncWcMobileNavSub(tabId);
          } else {
            document.querySelectorAll('.wc-mobile-tab').forEach(el => el.classList.remove('active'));
          }
        }
      }

      function switchWCTabFromMobile(tabId) {
        window._pendingWcTab = tabId;
        showPage('worldcup');
      }

      function switchWCTab(tabId, btnElement) {
        if (tabId === 'bracket' && !requireLoginForBracket()) {
          const dashboardBtn = document.querySelector('.wc-tab[onclick*="\'dashboard\'"]');
          switchWCTab('dashboard', dashboardBtn);
          return;
        }
        stopStandingsPolling();
        document.querySelectorAll('.wc-tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.wc-tab').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('wc-' + tabId);
        if (target) target.style.display = 'block';
        if (btnElement) btnElement.classList.add('active');
        else {
          const fallbackBtn = document.querySelector(`.wc-nav-tabs .wc-tab[onclick*="switchWCTab('${tabId}'"]`);
          if (fallbackBtn) fallbackBtn.classList.add('active');
        }
        syncWcMobileNavSub(tabId);
        if (tabId === 'dashboard') {
          startStandingsPolling();
          renderGroupStandings();
          renderBestThirdPlacedTable();
        } else if (tabId === 'matchday') {
          if (typeof window.initWCMatches === 'function') {
            window.initWCMatches('wc-matches');
          }
        } else if (tabId === 'predictions') {
          syncPredictionCenterGuestUI();
          awardPredictions = normalizeAwardPredictions(awardPredictions);
          ensureValidGroupPredictions();
          updateGroupStandingsStats();
          try { renderGroupPredictions(); } catch (err) { console.error('renderGroupPredictions failed:', err); }
          try { renderMatchPredictions(); } catch (err) { console.error('renderMatchPredictions failed:', err); }
          try { updateAwardsDisplay(); } catch (err) { console.error('updateAwardsDisplay failed:', err); }
          try { updatePredictorProfile(); } catch (err) { console.error('updatePredictorProfile failed:', err); }
          try { renderBestThirdPlacedTable(); } catch (err) { console.error('renderBestThirdPlacedTable failed:', err); }
          if (areGroupRankingsSubmitted()) {
            try { openThirdPlaceSelection(); } catch (err) { console.error('openThirdPlaceSelection failed:', err); }
          }
        } else if (tabId === 'bracket') {
          if (!bracketInitialized) {
            bracketPredictor.init();
            bracketInitialized = true;
          } else {
            bracketPredictor.restoreBracketState({ render: true });
          }
        } else if (tabId === 'analytics') {
          initAnalyticsTab();
        } else if (tabId === 'leaderboard') {
          renderWCLeaderboard();
        }
      }

      // ──────────────────────────  BATTLE SYSTEM REALTIME MATCHMAKING ──────────────────────────
      let ablyClient = null;
      let activeBattleRoomCode = null;
      let battleChannel = null;
      let battleRoom = null; // { room_code, role, host_id, guest_id }
      let battleState = {
        host: null,
        guest: null,
        score: 0,
        questionNo: 1,
        totalQuestions: 10,
        roundActive: false,
        answerDeadline: null,
        timerInterval: null,
        hasAnswered: false,
        startTime: null,
        hostAnswerScore: 0,
        guestAnswerScore: 0
      };

      async function createRoom() {
        try {
          if (!state.user) {
            showToast('Please log in first to create a battle room', 'warning');
            openModal('login');
            return;
          }
          
          const res = await apiRequest('/api/battle/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              difficulty: state.selectedDiff || 'easy',
              category: 'general',
              total_questions: 10
            })
          });
          
          battleRoom = {
            room_code: res.room_code,
            room_id: res.room_id,
            role: 'host',
            host_id: state.user.id,
            guest_id: null
          };
          
          setupLobbyUI();
          connectAbly(res.room_code);
        } catch (err) {
          console.error('Failed to create room:', err);
          showToast(err.message || 'Failed to create battle room', 'error');
        }
      }

      async function joinRoom(code) {
        try {
          code = validateRoomCodeInput(code);
        } catch (err) {
          showToast(err.message, 'warning');
          return;
        }
        
        try {
          if (!state.user) {
            showToast('Please log in first to join a battle room', 'warning');
            openModal('login');
            return;
          }
          
          const res = await apiRequest(`/api/battle/join/${code}`, {
            method: 'POST'
          });
          
          battleRoom = {
            room_code: res.room_code,
            room_id: res.room_id,
            role: res.role,
            host_id: res.host_id,
            guest_id: res.guest_id
          };
          
          setupLobbyUI();
          connectAbly(res.room_code);
        } catch (err) {
          console.error('Failed to join room:', err);
          showToast(err.message || 'Failed to join battle room', 'error');
        }
      }

      function setupLobbyUI() {
        document.getElementById('battle-lobby-start').classList.add('hidden');
        document.getElementById('battle-room-ui').classList.remove('hidden');
        document.getElementById('battle-question-ui').classList.add('hidden');
        document.getElementById('battle-reveal-ui').classList.add('hidden');
        document.getElementById('battle-finished-ui').classList.add('hidden');
        
        document.getElementById('battle-code-display').textContent = battleRoom.room_code;
        
        const shareLink = `${window.location.origin}${window.location.pathname}?code=${battleRoom.room_code}`;
        const shareLinkEl = document.getElementById('battle-share-link');
        shareLinkEl.textContent = shareLink;
        shareLinkEl.href = shareLink;
        
        const readyBtn = document.getElementById('btn-ready-toggle');
        readyBtn.textContent = 'Ready';
        readyBtn.className = 'btn btn-ghost';
        
        document.getElementById('btn-start-battle').classList.add('hidden');
      }

      async function getBattleState(code) {
        try {
          const res = await apiRequest(`/api/battle/room/${code}/state`, {
            method: 'GET'
          });
          if (res.status === 'in_progress') {
            showToast('⚽ Reconnecting to active battle...', 'info');
            initBattleQuiz(res);
          } else {
            battleState.host = res.host;
            battleState.guest = res.guest;
            renderLobbyPlayers();
            updateStartButtonVisibility();
          }
        } catch (err) {
          console.error('Failed to get battle state:', err);
        }
      }

      async function connectAbly(code) {
        if (battleChannel) {
          try {
            battleChannel.unsubscribe();
            battleChannel.presence.leave();
          } catch (e) {}
          battleChannel = null;
        }
        
        if (ablyClient && activeBattleRoomCode !== code) {
          try { ablyClient.close(); } catch (e) {}
          ablyClient = null;
          battleChannel = null;
        }
        if (!ablyClient) {
          activeBattleRoomCode = code;
          ablyClient = new Ably.Realtime({
            authCallback: (_tokenParams, callback) => {
              ensureCsrfToken()
                .then((csrf) => fetch(`${API_BASE_URL}/api/battle/token?room_code=${encodeURIComponent(code)}`, {
                  credentials: 'include',
                  headers: { 'X-CSRF-Token': csrf },
                }))
                .then((res) => {
                  if (!res.ok) throw new Error('Ably auth failed');
                  return res.json();
                })
                .then((data) => callback(null, data))
                .catch((err) => callback(err, null));
            },
            clientId: String(state.user.id),
          });
        }

        battleChannel = ablyClient.channels.get(`room:${code}`);
        
        battleChannel.subscribe((msg) => {
          handleBattleEvent(msg.data);
        });
        
        battleChannel.presence.subscribe('leave', (member) => {
          handleBattleEvent({
            event: 'OPPONENT_LEFT',
            user_id: member.clientId,
            username: member.data ? member.data.username : 'Opponent'
          });
        });
        
        battleChannel.presence.enter({ username: state.user.username });
        
        await getBattleState(code);
      }

      function handleBattleEvent(data) {
        console.log('Battle Event:', data);
        switch (data.event) {
          case 'LOBBY_STATE':
            battleState.host = data.host;
            battleState.guest = data.guest;
            renderLobbyPlayers();
            updateStartButtonVisibility();
            break;
            
          case 'PLAYER_JOINED':
            showToast(`👤 ${data.username} joined the room!`, 'info');
            break;
            
          case 'PLAYER_READY':
            if (battleState.host && battleState.host.user_id === data.user_id) {
              battleState.host.ready = data.ready;
            } else if (battleState.guest && battleState.guest.user_id === data.user_id) {
              battleState.guest.ready = data.ready;
            }
            renderLobbyPlayers();
            updateStartButtonVisibility();
            
            if (data.user_id === state.user.id) {
              const readyBtn = document.getElementById('btn-ready-toggle');
              if (data.ready) {
                readyBtn.textContent = 'Ready!';
                readyBtn.className = 'btn btn-success';
              } else {
                readyBtn.textContent = 'Ready';
                readyBtn.className = 'btn btn-ghost';
              }
            }
            break;
            
          case 'GAME_START':
            showToast('⚽ The Battle Begins!', 'success');
            initBattleQuiz(data);
            break;
            
          case 'OPPONENT_ANSWERED':
            showToast('⚡ Opponent has answered!', 'info');
            renderLiveStandings(true);
            break;
            
          case 'ROUND_RESULT':
            showRoundReveal(data);
            break;
            
          case 'NEXT_QUESTION':
            showNextQuestion(data);
            break;
            
          case 'GAME_OVER':
            showBattleGameOver(data);
            break;
            
          case 'OPPONENT_LEFT':
            showToast(`⚠️ ${data.username} disconnected!`, 'warning');
            break;
        }
      }

      function renderLobbyPlayers() {
        const container = document.getElementById('battle-players-list');
        if (!container) return;
        
        let html = '';
        
        if (battleState.host) {
          const isReady = battleState.host.ready;
          html += `
            <div class="lobby-player-card">
              <div class="player-ready-dot ${isReady ? 'ready' : ''}"></div>
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👑</div>
              <div style="font-family: var(--font-ui); font-weight: 700; font-size: 0.85rem;">${escapeHtml(battleState.host.username)}</div>
              <div style="font-size: 0.7rem; color: var(--text3); margin-top: 0.25rem;">Host (${isReady ? 'Ready' : 'Not Ready'})</div>
            </div>
          `;
        }
        
        if (battleState.guest && battleState.guest.user_id) {
          const isReady = battleState.guest.ready;
          html += `
            <div class="lobby-player-card">
              <div class="player-ready-dot ${isReady ? 'ready' : ''}"></div>
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👤</div>
              <div style="font-family: var(--font-ui); font-weight: 700; font-size: 0.85rem;">${escapeHtml(battleState.guest.username)}</div>
              <div style="font-size: 0.7rem; color: var(--text3); margin-top: 0.25rem;">Guest (${isReady ? 'Ready' : 'Not Ready'})</div>
            </div>
          `;
        } else {
          html += `
            <div class="lobby-player-card" style="opacity: 0.5; border-style: dashed;">
              <div style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--text3);">⏳</div>
              <div style="font-family: var(--font-ui); font-weight: 600; font-size: 0.85rem; color: var(--text3);">Waiting...</div>
              <div style="font-size: 0.7rem; color: var(--text3); margin-top: 0.25rem;">For opponent</div>
            </div>
          `;
        }
        
        container.innerHTML = html;
      }

      function updateStartButtonVisibility() {
        const startBtn = document.getElementById('btn-start-battle');
        if (!startBtn) return;
        
        if (battleRoom.role === 'host') {
          if (battleState.guest && battleState.guest.user_id) {
            startBtn.classList.remove('hidden');
            
            const hostReady = battleState.host && battleState.host.ready;
            const guestReady = battleState.guest && battleState.guest.ready;
            if (hostReady && guestReady) {
              startBtn.removeAttribute('disabled');
              startBtn.style.opacity = '1';
            } else {
              startBtn.setAttribute('disabled', 'true');
              startBtn.style.opacity = '0.5';
            }
          } else {
            startBtn.classList.add('hidden');
          }
        } else {
          startBtn.classList.add('hidden');
        }
      }

      async function toggleReady() {
        try {
          await apiRequest(`/api/battle/room/${battleRoom.room_code}/ready`, {
            method: 'POST'
          });
        } catch (err) {
          showToast(err.message || 'Failed to toggle ready status', 'error');
        }
      }

      async function startBattle() {
        try {
          await apiRequest(`/api/battle/room/${battleRoom.room_code}/start`, {
            method: 'POST'
          });
        } catch (err) {
          showToast(err.message || 'Failed to start battle', 'error');
        }
      }

      function initBattleQuiz(data) {
        document.getElementById('battle-room-ui').classList.add('hidden');
        document.getElementById('battle-question-ui').classList.remove('hidden');
        document.getElementById('battle-reveal-ui').classList.add('hidden');
        document.getElementById('battle-finished-ui').classList.add('hidden');
        
        battleState.score = 0;
        battleState.questionNo = data.question_no || 1;
        battleState.totalQuestions = data.total_questions || 10;
        battleState.hostAnswerScore = 0;
        battleState.guestAnswerScore = 0;
        
        showNextQuestion(data);
      }

      function startBattleTimer(serverTime, answerDeadline) {
        if (battleState.timerInterval) {
          clearInterval(battleState.timerInterval);
        }
        
        const localStartTime = Date.now();
        const deadlineDelta = answerDeadline - serverTime;
        const actualLocalDeadline = localStartTime + deadlineDelta;
        
        const timerCircle = document.getElementById('battle-timer-circle');
        const timerText = document.getElementById('battle-timer-text');
        
        battleState.timerInterval = setInterval(() => {
          const timeLeftMs = actualLocalDeadline - Date.now();
          const secondsLeft = Math.max(0, Math.ceil(timeLeftMs / 1000));
          
          if (timerText) {
            timerText.textContent = secondsLeft;
          }
          
          if (timerCircle) {
            const percentage = Math.max(0, timeLeftMs / deadlineDelta);
            const offset = 176 - (176 * percentage);
            timerCircle.style.strokeDashoffset = offset;
            
            if (secondsLeft <= 5) {
              timerCircle.className = 'timer-ring-circle danger';
            } else if (secondsLeft <= 10) {
              timerCircle.className = 'timer-ring-circle warning';
            } else {
              timerCircle.className = 'timer-ring-circle';
            }
          }
          
          if (timeLeftMs <= 0) {
            clearInterval(battleState.timerInterval);
            if (!battleState.hasAnswered) {
              submitBattleAnswer(null, -1);
            }
          }
        }, 100);
      }

      async function submitBattleAnswer(option, btnIdx) {
        if (battleState.hasAnswered) return;
        battleState.hasAnswered = true;
        
        const buttons = document.querySelectorAll('#battle-options .option');
        buttons.forEach((btn, idx) => {
          btn.classList.add('disabled');
          if (idx === btnIdx) {
            btn.classList.add('selected');
          }
        });
        
        const timeTakenMs = Date.now() - battleState.startTime;
        
        try {
          await apiRequest(`/api/battle/room/${battleRoom.room_code}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              option: option,
              time_taken_ms: timeTakenMs
            })
          });
        } catch (err) {
          showToast(err.message || 'Failed to submit answer', 'error');
        }
      }

      function renderLiveStandings(opponentAnswered = false) {
        const container = document.getElementById('battle-live-scores');
        if (!container) return;
        
        let hostLock = false;
        let guestLock = false;
        
        if (battleRoom.role === 'host') {
          hostLock = battleState.hasAnswered;
          guestLock = opponentAnswered;
        } else {
          hostLock = opponentAnswered;
          guestLock = battleState.hasAnswered;
        }
        
        let html = '';
        if (battleState.host) {
          html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--surface2); border-radius: 4px;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>👑</span>
                <span style="font-family: var(--font-ui); font-weight: 700;">${escapeHtml(battleState.host.username)}</span>
                ${hostLock ? '<span style="font-size: 0.75rem; background: var(--green)20; color: var(--green); padding: 2px 6px; border-radius: 3px; font-weight: 600;">LOCKED IN</span>' : '<span style="font-size: 0.75rem; background: var(--orange)20; color: var(--orange); padding: 2px 6px; border-radius: 3px; font-weight: 600;">THINKING...</span>'}
              </div>
              <div style="font-family: var(--font-display); font-weight: 700; color: var(--accent);">${battleRoom.role === 'host' ? battleState.score : (battleState.hostAnswerScore || 0)} PTS</div>
            </div>
          `;
        }
        
        if (battleState.guest && battleState.guest.user_id) {
          html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: var(--surface2); border-radius: 4px;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>👤</span>
                <span style="font-family: var(--font-ui); font-weight: 700;">${escapeHtml(battleState.guest.username)}</span>
                ${guestLock ? '<span style="font-size: 0.75rem; background: var(--green)20; color: var(--green); padding: 2px 6px; border-radius: 3px; font-weight: 600;">LOCKED IN</span>' : '<span style="font-size: 0.75rem; background: var(--orange)20; color: var(--orange); padding: 2px 6px; border-radius: 3px; font-weight: 600;">THINKING...</span>'}
              </div>
              <div style="font-family: var(--font-display); font-weight: 700; color: var(--accent);">${battleRoom.role === 'guest' ? battleState.score : (battleState.guestAnswerScore || 0)} PTS</div>
            </div>
          `;
        }
        
        container.innerHTML = html;
      }

      function showRoundReveal(data) {
        if (battleState.timerInterval) {
          clearInterval(battleState.timerInterval);
        }
        
        battleState.hostAnswerScore = data.host_score;
        battleState.guestAnswerScore = data.guest_score;
        if (battleRoom.role === 'host') {
          battleState.score = data.host_score;
        } else {
          battleState.score = data.guest_score;
        }
        
        document.getElementById('battle-question-ui').classList.add('hidden');
        document.getElementById('battle-reveal-ui').classList.remove('hidden');
        
        const revealContainer = document.getElementById('battle-reveal-players');
        revealContainer.innerHTML = '';
        
        const hostAns = data.host_answer;
        const guestAns = data.guest_answer;
        
        let hostHtml = `
          <div style="background: var(--surface2); border: 1px solid ${hostAns.is_correct ? 'var(--green)' : 'var(--border)'}; border-radius: var(--r); padding: 1rem; text-align: left; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <div style="font-family: var(--font-ui); font-weight: 700; font-size: 0.95rem;">👑 ${escapeHtml(battleState.host.username)}</div>
              <div style="font-size: 0.8rem; color: var(--text2); margin-top: 0.25rem;">
                Option: <strong style="color: ${hostAns.is_correct ? 'var(--green)' : 'var(--red)'};">${escapeHtml(hostAns.option || 'TIMEOUT')}</strong>
                (${hostAns.is_correct ? 'Correct' : 'Incorrect'})
              </div>
              <div style="font-size: 0.75rem; color: var(--text3); margin-top: 0.15rem;">Time: ${(hostAns.time_taken_ms / 1000).toFixed(2)}s</div>
            </div>
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: var(--accent);">${data.host_score} PTS</div>
          </div>
        `;
        
        let guestHtml = '';
        if (battleState.guest && battleState.guest.user_id) {
          guestHtml = `
            <div style="background: var(--surface2); border: 1px solid ${guestAns.is_correct ? 'var(--green)' : 'var(--border)'}; border-radius: var(--r); padding: 1rem; text-align: left; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-family: var(--font-ui); font-weight: 700; font-size: 0.95rem;">👤 ${escapeHtml(battleState.guest.username)}</div>
                <div style="font-size: 0.8rem; color: var(--text2); margin-top: 0.25rem;">
                  Option: <strong style="color: ${guestAns.is_correct ? 'var(--green)' : 'var(--red)'};">${escapeHtml(guestAns.option || 'TIMEOUT')}</strong>
                  (${guestAns.is_correct ? 'Correct' : 'Incorrect'})
                </div>
                <div style="font-size: 0.75rem; color: var(--text3); margin-top: 0.15rem;">Time: ${(guestAns.time_taken_ms / 1000).toFixed(2)}s</div>
              </div>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: var(--accent);">${data.guest_score} PTS</div>
            </div>
          `;
        }
        
        revealContainer.innerHTML = hostHtml + guestHtml;

        const myAns = battleRoom.role === 'host' ? hostAns : guestAns;
        if (myAns) {
          if (myAns.is_correct) playCorrectSound();
          else playWrongSound();
        }
        
        let timeLeft = data.next_question_delay_sec || 5;
        const countdownEl = document.getElementById('battle-reveal-countdown');
        countdownEl.textContent = `Next question in ${timeLeft}s...`;
        
        const countdownInterval = setInterval(() => {
          timeLeft--;
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
          } else {
            countdownEl.textContent = `Next question in ${timeLeft}s...`;
          }
        }, 1000);
      }

      function showNextQuestion(data) {
        if (battleState.timerInterval) {
          clearInterval(battleState.timerInterval);
        }
        
        battleState.hasAnswered = false;
        battleState.startTime = Date.now();
        battleState.questionNo = data.question_no;
        
        document.getElementById('battle-reveal-ui').classList.add('hidden');
        document.getElementById('battle-question-ui').classList.remove('hidden');
        
        document.getElementById('battle-q-count').textContent = `QUESTION ${data.question_no}/${battleState.totalQuestions}`;
        document.getElementById('battle-q-score').textContent = `${battleState.score} PTS`;
        document.getElementById('battle-q-text').textContent = data.question.question_text;
        
        const grid = document.getElementById('battle-options');
        const options = [
          { key: 'A', text: data.question.option_a },
          { key: 'B', text: data.question.option_b },
          { key: 'C', text: data.question.option_c },
          { key: 'D', text: data.question.option_d }
        ];
        
        grid.innerHTML = options.map((opt, i) => `
          <button class="option" onclick="submitBattleAnswer('${opt.key}', ${i})">
            <span class="option-letter">${opt.key}</span>
            ${escapeHtml(opt.text)}
          </button>
        `).join('');
        
        startBattleTimer(data.server_time, data.answer_deadline);
        renderLiveStandings(false);
      }

      function showBattleGameOver(data) {
        if (battleState.timerInterval) {
          clearInterval(battleState.timerInterval);
        }
        
        document.getElementById('battle-question-ui').classList.add('hidden');
        document.getElementById('battle-reveal-ui').classList.add('hidden');
        document.getElementById('battle-finished-ui').classList.remove('hidden');
        
        const finalContainer = document.getElementById('battle-final-scores');
        
        const isWinner = data.winner_id === state.user.id;
        const isTie = data.winner_id === null;
        
        let headerHtml = '';
        if (isTie) {
          headerHtml = `<h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--orange); margin-bottom: 1.5rem;">🤝 It's a Tie!</h3>`;
        } else if (isWinner) {
          headerHtml = `<h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--green); margin-bottom: 1.5rem;">🎉 You Won!</h3>`;
        } else {
          headerHtml = `<h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--red); margin-bottom: 1.5rem;">💀 You Lost!</h3>`;
        }
        
        const scoresHtml = `
          ${headerHtml}
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--font-ui); font-weight: 700; font-size: 1.1rem;">👑 ${escapeHtml(data.host_username)}</span>
              <span style="font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--accent);">${data.host_score} PTS</span>
            </div>
            <div style="background: var(--surface2); border: 1px solid var(--border); border-radius: var(--r); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: var(--font-ui); font-weight: 700; font-size: 1.1rem;">👤 ${escapeHtml(data.guest_username)}</span>
              <span style="font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--accent);">${data.guest_score} PTS</span>
            </div>
          </div>
          <div style="margin-top: 1.5rem; color: var(--text3); font-size: 0.85rem;">
            ${isTie ? 'Tiebreaker checked total answer times. Good game!' : (isWinner ? 'Victory points (+50 XP bonus) awarded to your profile!' : 'XP (+10 participation XP) awarded to your profile.')}
          </div>
        `;
        
        finalContainer.innerHTML = scoresHtml;
        
        closeBattleRealtime();
      }

      function closeBattleRealtime() {
        if (battleChannel) {
          try {
            battleChannel.unsubscribe();
            battleChannel.presence.leave();
          } catch (e) {}
          battleChannel = null;
        }
        if (ablyClient) {
          try { ablyClient.close(); } catch (e) {}
          ablyClient = null;
          activeBattleRoomCode = null;
        }
      }

      function exitBattle() {
        closeBattleRealtime();
        const url = new URL(window.location);
        url.searchParams.delete('code');
        window.history.replaceState({}, document.title, url.toString());
        
        document.getElementById('battle-lobby-start').classList.remove('hidden');
        document.getElementById('battle-room-ui').classList.add('hidden');
        document.getElementById('battle-question-ui').classList.add('hidden');
        document.getElementById('battle-reveal-ui').classList.add('hidden');
        document.getElementById('battle-finished-ui').classList.add('hidden');
        
        showPage('play');
      }

      function openLivePopup() {
        // If a modal overlay was open, close it first
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
          overlay.classList.remove('show');
        }

        let widget = document.getElementById('live-scores-floating-widget');
        if (!widget) {
          // Injected Styles
          if (!document.getElementById('floating-widget-styles')) {
            const styles = document.createElement('style');
            styles.id = 'floating-widget-styles';
            styles.textContent = `
              .floating-widget {
                position: fixed;
                bottom: 25px;
                right: 25px;
                width: 290px;
                height: 52px;
                background: rgba(10, 10, 10, 0.92);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 26px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
                display: flex;
                align-items: center;
                z-index: 10000;
                font-family: var(--font-ui);
                cursor: move;
                user-select: none;
                padding: 0 14px;
                transition: opacity 0.2s ease;
              }
              .floating-widget-close {
                position: absolute;
                top: -6px;
                right: -6px;
                width: 18px;
                height: 18px;
                background: #141414;
                border: 1px solid var(--border);
                color: var(--text2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.5);
                transition: all 0.2s;
                padding: 0;
                line-height: 1;
                border-style: solid;
              }
              .floating-widget-close:hover {
                background: var(--error);
                color: #fff;
                border-color: var(--error);
              }
              .floating-widget-body {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
              }
            `;
            document.head.appendChild(styles);
          }

          // Widget Container
          widget = document.createElement('div');
          widget.id = 'live-scores-floating-widget';
          widget.className = 'floating-widget';

          // Close Button
          const closeBtn = document.createElement('button');
          closeBtn.className = 'floating-widget-close';
          closeBtn.innerHTML = '&times;';
          closeBtn.title = 'Close Widget';
          closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeLiveScoresWidget();
          };
          widget.appendChild(closeBtn);

          // Body
          const body = document.createElement('div');
          body.className = 'floating-widget-body';
          widget.appendChild(body);

          document.body.appendChild(widget);
          makeDraggable(widget, widget);
        }

        // Make sure it is expanded and visible
        widget.style.display = 'flex';
        widget.style.opacity = '1';

        renderLiveScoresWidget();

        // Start Auto Polling
        if (window.liveScoresWidgetTimer) {
          clearInterval(window.liveScoresWidgetTimer);
        }
        
        window.liveScoresWidgetTimer = setInterval(async () => {
          if (widget.style.display === 'none') {
            clearInterval(window.liveScoresWidgetTimer);
            window.liveScoresWidgetTimer = null;
            return;
          }
          try {
            const apiBase = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:' ? 'http://127.0.0.1:8000' : 'https://footytrivia-api.onrender.com';
            const res = await fetch(apiBase + '/api/wc/matches', { credentials: 'omit' });
            if (res.ok) {
              const data = await res.json();
              window.WC_TODAY_MATCHES = data.matches || [];
              renderLiveScoresWidget();
            }
          } catch (e) {
            console.error('Failed to update live scores floating widget:', e);
          }
        }, 10000);
      }

      function closeLiveScoresWidget() {
        const widget = document.getElementById('live-scores-floating-widget');
        if (widget) {
          widget.style.display = 'none';
        }
        if (window.liveScoresWidgetTimer) {
          clearInterval(window.liveScoresWidgetTimer);
          window.liveScoresWidgetTimer = null;
        }
      }

      function renderLiveScoresWidget() {
        const widget = document.getElementById('live-scores-floating-widget');
        if (!widget) return;
        const body = widget.querySelector('.floating-widget-body');
        if (!body) return;
        
        const matches = window.WC_TODAY_MATCHES || [];
        const live = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
        const fixtures = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
        const completed = matches.filter(m => m.status === 'FINISHED');
        
        let activeMatch = null;
        let matchType = '';
        
        if (live.length > 0) {
          activeMatch = live[0];
          matchType = 'live';
        } else if (fixtures.length > 0) {
          activeMatch = fixtures[0];
          matchType = 'fixture';
        } else if (completed.length > 0) {
          activeMatch = completed[completed.length - 1];
          matchType = 'completed';
        }
        
        let html = '';
        
        if (!activeMatch) {
          html = `
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%; height:100%; color:var(--text2); font-size:0.75rem; font-weight:700;">
              <span>🏆</span>
              <span>FIFA WORLD CUP 2026</span>
              <span style="font-size:0.6rem; background:var(--border2); padding:1px 5px; border-radius:10px; color:var(--text3); font-weight:800; border: 1px solid var(--border);">OFFSEASON</span>
            </div>
          `;
        } else {
          const home = activeMatch.homeTeam || {};
          const away = activeMatch.awayTeam || {};
          const score = activeMatch.score || {};
          
          const homeName = home.tla || (home.shortName || home.name || 'TBD').slice(0,3).toUpperCase();
          const awayName = away.tla || (away.shortName || away.name || 'TBD').slice(0,3).toUpperCase();
          
          const homeScoreVal = score.fullTime && score.fullTime.home != null ? score.fullTime.home : 0;
          const awayScoreVal = score.fullTime && score.fullTime.away != null ? score.fullTime.away : 0;
          
          const homeCrest = home.crest ? `<img src="${home.crest}" alt="${homeName}" style="width:22px; height:22px; object-fit:contain; border-radius:3px;">` : `<span style="font-size:0.6rem; font-weight:700; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; background:var(--surface2); border:1px solid var(--border2); border-radius:3px; color:var(--text2);">${homeName}</span>`;
          const awayCrest = away.crest ? `<img src="${away.crest}" alt="${awayName}" style="width:22px; height:22px; object-fit:contain; border-radius:3px;">` : `<span style="font-size:0.6rem; font-weight:700; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; background:var(--surface2); border:1px solid var(--border2); border-radius:3px; color:var(--text2);">${awayName}</span>`;
          
          let centerHtml = '';
          if (matchType === 'live') {
            centerHtml = `
              <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:var(--accent); line-height:1;">${homeScoreVal} - ${awayScoreVal}</div>
              <div style="display:flex; align-items:center; gap:3px; font-size:0.65rem; font-weight:700; color:var(--success); margin-top:1px;">
                <span style="width:4px; height:4px; background:var(--success); border-radius:50%; display:inline-block; animation:pulse 1s infinite alternate"></span>
                ${activeMatch.minute != null ? activeMatch.minute + "'" : (activeMatch.status === 'PAUSED' ? 'HT' : 'LIVE')}
              </div>
            `;
          } else if (matchType === 'fixture') {
            const time = activeMatch.utcDate ? new Date(activeMatch.utcDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'VS';
            centerHtml = `
              <div style="font-size:0.6rem; font-weight:700; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; line-height:1;">TODAY</div>
              <div style="font-size:0.7rem; font-weight:700; color:var(--gold); margin-top:2px; line-height:1;">${time}</div>
            `;
          } else if (matchType === 'completed') {
            centerHtml = `
              <div style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:var(--text2); line-height:1;">${homeScoreVal} - ${awayScoreVal}</div>
              <div style="font-size:0.6rem; font-weight:700; background:var(--border2); color:var(--text3); padding:0px 4px; border-radius:2px; margin-top:2px; line-height:1.2;">FT</div>
            `;
          }
          
          html = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%; height:100%; padding:0 4px;">
              <!-- Home -->
              <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
                ${homeCrest}
                <span style="font-weight:700; font-size:0.8rem; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${homeName}</span>
              </div>
              
              <!-- Center -->
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-width:60px;">
                ${centerHtml}
              </div>
              
              <!-- Away -->
              <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end; min-width:0; flex:1; text-align:right;">
                <span style="font-weight:700; font-size:0.8rem; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${awayName}</span>
                ${awayCrest}
              </div>
            </div>
          `;
        }
        
        body.innerHTML = html;
      }

      function makeDraggable(el, header) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragTouchStart;

        function dragMouseDown(e) {
          e = e || window.event;
          if (e.target.closest('.floating-widget-close')) return;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          
          let newTop = el.offsetTop - pos2;
          let newLeft = el.offsetLeft - pos1;
          
          const padding = 10;
          newTop = Math.max(padding, Math.min(window.innerHeight - el.offsetHeight - padding, newTop));
          newLeft = Math.max(padding, Math.min(window.innerWidth - el.offsetWidth - padding, newLeft));
          
          el.style.top = newTop + "px";
          el.style.left = newLeft + "px";
          el.style.bottom = "auto";
          el.style.right = "auto";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }

        function dragTouchStart(e) {
          if (e.target.closest('.floating-widget-close')) return;
          if (e.touches.length !== 1) return;
          pos3 = e.touches[0].clientX;
          pos4 = e.touches[0].clientY;
          document.ontouchend = closeDragTouch;
          document.ontouchmove = elementTouchDrag;
        }

        function elementTouchDrag(e) {
          if (e.touches.length !== 1) return;
          pos1 = pos3 - e.touches[0].clientX;
          pos2 = pos4 - e.touches[0].clientY;
          pos3 = e.touches[0].clientX;
          pos4 = e.touches[0].clientY;

          let newTop = el.offsetTop - pos2;
          let newLeft = el.offsetLeft - pos1;

          const padding = 10;
          newTop = Math.max(padding, Math.min(window.innerHeight - el.offsetHeight - padding, newTop));
          newLeft = Math.max(padding, Math.min(window.innerWidth - el.offsetWidth - padding, newLeft));

          el.style.top = newTop + "px";
          el.style.left = newLeft + "px";
          el.style.bottom = "auto";
          el.style.right = "auto";
        }

        function closeDragTouch() {
          document.ontouchend = null;
          document.ontouchmove = null;
        }
      }

      window.closeLiveScoresWidget = closeLiveScoresWidget;
      window.openLivePopup = openLivePopup;

      window.openModal = openModal;
      window.closeModal = closeModal;
      window.togglePasswordVisibility = togglePasswordVisibility;
      window.mockLogin = mockLogin;
      window.mockRegister = mockRegister;
      window.mockForgotPassword = mockForgotPassword;
      window.mockResetPassword = mockResetPassword;
      window.mockResendVerification = mockResendVerification;
      window.createRoom = createRoom;
      window.joinRoom = joinRoom;
      window.toggleReady = toggleReady;
      window.startBattle = startBattle;
      window.exitBattle = exitBattle;
      window.submitBattleAnswer = submitBattleAnswer;
      window.signOut = logout;
      window.openLivePopup = openLivePopup;
