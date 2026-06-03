      // ──────────────────────────  a• a• a• a• a• a•  DATA a• a• a• a• a• a• a• 
      // QUESTIONS loaded from data.js
      // LEADERBOARD_DATA loaded from data.js
      // CATEGORIES_DATA loaded from data.js
      // TRANSFER_PLAYERS loaded from data.js
      let state = {
        currentPage: 'home',
        quiz: { active: false, questions: [], idx: 0, score: 0, correct: 0, streak: 0, bestStreak: 0, hintPenalty: 1, timer: null, timeLeft: 15, mode: 'solo', diff: 'easy', hintsUsed: [] },
        user: null,
        transfer: { playerIdx: 0, guesses: [], maxGuesses: 3, revealed: false, hintsRevealed: 1 },
        theme: 'dark',
        sound: false,
        lbTab: 'daily',
        selectedMode: 'solo',
        selectedDiff: 'easy',
      };
      // ──────────────────────────  a• a• a• a• a• a•  NAVIGATION a• a• a• a• a• a• a• 
      function showPage(page) {
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
        if (page === 'worldcup') {
          const activeTabBtn = document.querySelector('.wc-nav-tabs .wc-tab.active');
          const activeTabId = activeTabBtn ? activeTabBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'dashboard';
          switchWCTab(activeTabId, activeTabBtn);
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
      function showClub(clubId) {
        const clubs = {
          'man-utd': { name: 'Manchester United', logo: LOGO_URLS['man-utd'], color1: '#da291c', color2: '#fbe122', league: 'Premier League', founded: 1878, stadium: 'Old Trafford', manager: 'Ruben Amorim', trophies: ['PL x13', 'UCL x3', 'Club WC x1'], desc: 'One of the most successful clubs in English football history. 20 league titles and 3 European Cups.' },
          'man-city': { name: 'Manchester City', logo: LOGO_URLS['man-city'], color1: '#6cabdd', color2: '#1c2c5b', league: 'Premier League', founded: 1880, stadium: 'Etihad Stadium', manager: 'Pep Guardiola', trophies: ['PL x9', 'UCL x1', 'FA Cup x7'], desc: 'City have become Premier League dominators under Pep Guardiola, winning the Treble in 2022-23.' },
          'chelsea': { name: 'Chelsea FC', logo: LOGO_URLS['chelsea'], color1: '#003087', color2: '#68b0e8', league: 'Premier League', founded: 1905, stadium: 'Stamford Bridge', manager: 'Enzo Maresca', trophies: ['PL x6', 'UCL x2', 'UEL x2'], desc: 'West London giants who dominated the 2000s and 2010s, winning two Champions League titles.' },
          'arsenal': { name: 'Arsenal FC', logo: LOGO_URLS['arsenal'], color1: '#d00027', color2: '#db0007', league: 'Premier League', founded: 1886, stadium: 'Emirates Stadium', manager: 'Mikel Arteta', trophies: ['PL x3', 'FA Cup x14'], desc: 'The Invincibles of 2003-04 went the entire season unbeaten. Arteta Arsenal are strong contenders again.' },
          'liverpool': { name: 'Liverpool FC', logo: LOGO_URLS['liverpool'], color1: '#c8102e', color2: '#00b2a9', league: 'Premier League', founded: 1892, stadium: 'Anfield', manager: 'Arne Slot', trophies: ['UCL x6', 'PL x1', 'Club WC x1'], desc: 'Six-time European champions. Klopp high-pressing style brought the club back to the summit.' },
          'real-madrid': { name: 'Real Madrid CF', logo: LOGO_URLS['real-madrid'], color1: '#febe10', color2: '#fff', league: 'La Liga', founded: 1902, stadium: 'Santiago Bernabeu', manager: 'Carlo Ancelotti', trophies: ['UCL x15', 'La Liga x35', 'Club WC x8'], desc: 'The most successful club in Champions League history with 15 titles.' },
          'barcelona': { name: 'FC Barcelona', logo: LOGO_URLS['barcelona'], color1: '#004D98', color2: '#A50044', league: 'La Liga', founded: 1899, stadium: 'Spotify Camp Nou', manager: 'Hansi Flick', trophies: ['UCL x5', 'La Liga x27', 'Copa x31'], desc: 'More than a club. Home of the legendary Cruyff, Messi, and the tiki-taka era under Guardiola.' },
        };
        const club = clubs[clubId] || clubs['man-utd'];
        setClubBg(clubId);
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
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="startQuiz('${clubId}')">Start Club Trivia</button>
        <button class="btn btn-ghost" onclick="showPage('categories')">&larr; Back to Categories</button>
      </div>
    </div>`;
        showPage('club');
      }
      // ──────────────────────────  a• a• a• a• a• a•  QUIZ ENGINE a• a• a• a• a• a• a• 
      function startQuiz(category) {
        if (!checkDailyLimit()) return;
        incrementDailyAttempts();
        const pool = QUESTIONS[category] || QUESTIONS['daily'];
        const shuffled = [...pool].sort(() => Math.random() - .5).slice(0, Math.min(10, pool.length));
        state.quiz = { ...state.quiz, active: true, questions: shuffled, idx: 0, score: 0, correct: 0, streak: 0, bestStreak: 0, hintPenalty: 1, hintsUsed: [], category };
        showPage('play');
        document.getElementById('mode-select').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('quiz-interface').classList.remove('hidden');
        renderQuestion();
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
        document.getElementById('q-cat').innerHTML = `<span>${question.cat}</span><span class="q-difficulty ${question.diff}">${question.diff}</span>`;
        document.getElementById('q-text').textContent = question.q;
        const grid = document.getElementById('options-grid');
        grid.innerHTML = question.opts.map((opt, i) => `
    <button class="option" onclick="selectAnswer(${i})">
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      ${opt}
    </button>`).join('');
        startTimer();
      }
      function selectAnswer(idx) {
        clearInterval(state.quiz.timer);
        const q = state.quiz;
        const question = q.questions[q.idx];
        const correct = idx === question.ans;
        const options = document.querySelectorAll('.option');
        options.forEach(o => o.classList.add('disabled'));
        options[question.ans].classList.add('correct');
        if (!correct) options[idx].classList.add('wrong');
        const timeBonus = Math.floor(state.quiz.timeLeft * 5);
        let pts = 0;
        if (correct) {
          q.correct++;
          q.streak++;
          if (q.streak > q.bestStreak) q.bestStreak = q.streak;
          const base = { easy: 100, medium: 150, hard: 200, legendary: 300 }[question.diff] || 100;
          pts = Math.floor((base + timeBonus) * q.hintPenalty);
          if (q.streak >= 3) pts = Math.floor(pts * 1.2);
          if (state.selectedMode === 'blitz') {
            pts *= 2;
          }
          q.score += pts;
        } else {
          q.streak = 0;
        }
        let aiCorrect = false;
        let aiPts = 0;
        if (state.selectedMode === 'ai') {
          const aiProb = { easy: 0.8, medium: 0.65, hard: 0.5, legendary: 0.35 }[question.diff] || 0.6;
          aiCorrect = Math.random() < aiProb;
          if (aiCorrect) {
            q.aiCorrect = (q.aiCorrect || 0) + 1;
            const aiBase = { easy: 100, medium: 150, hard: 200, legendary: 300 }[question.diff] || 100;
            const aiBonus = Math.floor(Math.random() * 30);
            aiPts = aiBase + aiBonus;
            q.aiScore = (q.aiScore || 0) + aiPts;
          }
        }
        const scoreText = state.selectedMode === 'ai' ? `YOU: ${q.score} | AI: ${q.aiScore || 0}` : `${q.score} PTS`;
        document.getElementById('q-score').textContent = scoreText;
        showFeedback(correct, pts, q.streak);
        if (state.selectedMode === 'ai') {
          let aiMsg = aiCorrect ? `🤖 Bot Guardiola got it CORRECT (+${aiPts} PTS)` : `🤖 Bot Guardiola got it WRONG`;
          document.getElementById('fb-sub').innerHTML = (correct && q.streak >= 3 ? `🔥 ${q.streak} in a row! Bonus applied!<br/>` : '') + aiMsg;
        }
        if (!correct && state.selectedMode === 'hardcore') {
          setTimeout(() => {
            hideFeedback();
            endQuiz();
          }, 2200);
          return;
        }
        setTimeout(() => {
          hideFeedback();
          q.idx++;
          renderQuestion();
        }, correct ? 1800 : 2200);
      }
      function showFeedback(correct, pts, streak) {
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
        setTimeout(() => el.remove(), 1100);
      }
      function useHint(hintIdx) {
        const q = state.quiz;
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
        const mode = state.selectedMode;
        TIMER_MAX = mode === 'blitz' ? 8 : mode === 'hardcore' ? 10 : 15;
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
      function timeUp() {
        const q = state.quiz;
        const question = q.questions[q.idx];
        const options = document.querySelectorAll('.option');
        options.forEach(o => o.classList.add('disabled'));
        if (options[question.ans]) options[question.ans].classList.add('correct');
        q.streak = 0;
        let aiCorrect = false;
        let aiPts = 0;
        if (state.selectedMode === 'ai') {
          const aiProb = { easy: 0.8, medium: 0.65, hard: 0.5, legendary: 0.35 }[question.diff] || 0.6;
          aiCorrect = Math.random() < aiProb;
          if (aiCorrect) {
            q.aiCorrect = (q.aiCorrect || 0) + 1;
            const aiBase = { easy: 100, medium: 150, hard: 200, legendary: 300 }[question.diff] || 100;
            aiPts = aiBase;
            q.aiScore = (q.aiScore || 0) + aiPts;
          }
        }
        showFeedback(false, 0, 0);
        if (state.selectedMode === 'ai') {
          let aiMsg = aiCorrect ? `🤖 Bot Guardiola got it CORRECT (+${aiPts} PTS)` : `🤖 Bot Guardiola got it WRONG`;
          document.getElementById('fb-sub').innerHTML = aiMsg;
        }
        if (state.selectedMode === 'hardcore') {
          setTimeout(() => {
            hideFeedback();
            endQuiz();
          }, 2000);
          return;
        }
        setTimeout(() => {
          hideFeedback();
          q.idx++;
          renderQuestion();
        }, 2000);
      }
      function endQuiz() {
        clearInterval(state.quiz.timer);
        document.getElementById('quiz-interface').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');
        const q = state.quiz;
        const total = q.questions.length;
        const pct = total > 0 ? Math.round((q.correct / total) * 100) : 0;
        const titles = ['Keep Practicing!', 'Not Bad!', 'Good Game!', 'Great Performance!', 'Excellent!', 'Unstoppable! 🔥'];
        const titleIdx = Math.floor(pct / 20);
        document.getElementById('results-pct').textContent = pct + '%';
        document.getElementById('results-title').textContent = titles[Math.min(titleIdx, 5)];
        document.getElementById('results-msg').textContent = `${q.correct}/${total} correct answers`;
        document.getElementById('r-correct').textContent = q.correct;
        document.getElementById('r-points').textContent = q.score;
        document.getElementById('r-best-streak').textContent = q.bestStreak;
        saveQuizResult(q.category, q.score, q.correct, q.questions.length, 0);
        saveQuizResult(state.selectedMode, q.score, q.correct, total, TIMER_MAX - state.quiz.timeLeft);
        // animate arc
        setTimeout(() => {
          const arc = document.getElementById('results-arc');
          if (arc) arc.style.strokeDashoffset = 377 * (1 - pct / 100);
        }, 100);
        showToast(`🏆 Game over! ${q.correct}/${total} correct`, 'success');
      }
      function exitQuiz() {
        clearInterval(state.quiz.timer);
        document.getElementById('quiz-interface').classList.add('hidden');
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('mode-select').classList.remove('hidden');
      }
      function restartQuiz() {
        document.getElementById('results-screen').classList.add('hidden');
        document.getElementById('mode-select').classList.remove('hidden');
      }
      function selectMode(mode) {
        state.selectedMode = mode;
        showToast(`⚡ Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`, 'info');
        if (mode === 'daily') { startQuiz('daily'); return; }
        document.querySelectorAll('.mode-card').forEach(c => c.style.borderColor = '');
      }
      function selectDiff(diff, el) {
        state.selectedDiff = diff;
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        showToast(`Difficulty: ${diff.charAt(0).toUpperCase() + diff.slice(1)}`, 'info');
      }
      // ────────────────────────── a•a•a•a•a•a• TRANSFER GUESSER a•a•a•a•a•a•a•
      function newTransferGame() {
        state.transfer = { playerIdx: Math.floor(Math.random() * TRANSFER_PLAYERS.length), guesses: [], maxGuesses: 3, revealed: false, hintsRevealed: 1 };
        document.getElementById('tg-num').textContent = state.transfer.playerIdx + 1;
        document.getElementById('tg-guesses-left').textContent = 3;
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
        <div class="suggestion-item" onclick="selectTransferSuggestion('${p.name.replace(/'/g, "\\'")}')">
          ${p.name}
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
        if (state.transfer.guesses.length > 0) {
          container.style.display = 'none';
          return;
        }
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
          Guess ${t.guesses.length + 1}: <strong>${guessedPlayer.name}</strong>
        </div>
        <div class="clue-row">
          <div class="clue-cell ${natClass}">
            <div class="clue-cell-label">Nation</div>
            <div class="clue-cell-value">${guessedPlayer.nationality}</div>
          </div>
          <div class="clue-cell ${ageClass}">
            <div class="clue-cell-label">Age</div>
            <div class="clue-cell-value">${guessedPlayer.age}${ageArrow}</div>
          </div>
          <div class="clue-cell ${posClass}">
            <div class="clue-cell-label">Pos</div>
            <div class="clue-cell-value">${guessedPlayer.position}</div>
          </div>
          <div class="clue-cell ${lgClass}">
            <div class="clue-cell-label">League</div>
            <div class="clue-cell-value">${guessedPlayer.league}</div>
          </div>
          <div class="clue-cell ${clubClass}">
            <div class="clue-cell-label">Club</div>
            <div class="clue-cell-value">${guessedPlayer.club}</div>
          </div>
          <div class="clue-cell ${valClass}">
            <div class="clue-cell-label">Value</div>
            <div class="clue-cell-value">${guessedPlayer.value}${valArrow}</div>
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
          <div style="font-family:var(--font-display);font-size: 1.25rem; font-weight: 600;color:var(--accent);letter-spacing:1px">${player.name}</div>
          <div style="color:var(--text2);font-size:.9rem;margin-top:.5rem">${player.nationality}  -  ${player.position}  -  ${player.club}</div>
          <div style="margin-top:.75rem;font-size:.85rem;color:var(--text3)">Career: ${player.clubs.join(' &rarr; ')}</div>
          <button class="btn btn-primary mt-3" onclick="newTransferGame()">Try Another</button>
        `;
          showToast(correct ? 'You got it!' : `It was ${player.name}`, correct ? 'success' : 'error');
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
      function renderStaticLeaderboard(container) {
        // Render static fallback leaderboard when Firestore is not available
        const data = LEADERBOARD_DATA;
        if (!data || data.length === 0) {
          container.innerHTML = "<div style='padding:2rem;text-align:center'>No scores yet.</div>";
          return;
        }
        let html = '';
        data.forEach((p, i) => {
          const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          const rankLabel = i + 1;
          let tierName = 'Bronze'; let tierColor = '#cd7f32';
          if (p.score >= 10000) { tierName = 'Diamond'; tierColor = '#b9f2ff'; }
          else if (p.score >= 5000) { tierName = 'Platinum'; tierColor = '#e5e4e2'; }
          else if (p.score >= 2500) { tierName = 'Gold'; tierColor = 'var(--gold)'; }
          else if (p.score >= 1000) { tierName = 'Silver'; tierColor = '#c0c0c0'; }
          html += `
          <div class="lb-row">
            <div class="lb-rank ${rankClass}">${rankLabel}</div>
            <div class="lb-avatar" style="background:var(--surface2)">${p.name ? p.name[0] : '?'}</div>
            <div class="lb-info">
              <div class="lb-name">${p.name || 'Guest'}
                <span style="font-size:0.65rem;background:${tierColor};color:#000;padding:0.1rem 0.35rem;border-radius:4px;margin-left:0.5rem;font-weight:700">${tierName}</span>
              </div>
              <div class="lb-meta">${getLeaderboardFlagImg(p.country) || ''} &nbsp; ${p.correct || 0} correct</div>
            </div>
            <div class="lb-score">${(p.score || 0).toLocaleString()}</div>
          </div>`;
        });
        container.innerHTML = html;
      }
      function switchLbTab(el, tab) {
        document.querySelectorAll('#lb-main-tabs .lb-tab').forEach(t => t.classList.remove('active'));
        if (el) el.classList.add('active');
        const container = document.getElementById('lb-main-list');
        if (!container) return;
        if (!window.db) {
          // Fallback to static leaderboard data when Firestore is not configured
          renderStaticLeaderboard(container);
          return;
        }
        let collectionName = 'leaderboard_alltime';
        if (tab === 'weekly') collectionName = 'leaderboard_weekly';
        else if (tab === 'monthly') collectionName = 'leaderboard_battle'; // Battle ELO
        if (lbUnsubscribe) lbUnsubscribe();
        container.innerHTML = "<div style='padding:2rem;text-align:center'>Loading live standings...</div>";
        let query = db.collection(collectionName).orderBy('score', 'desc').limit(100);
        if (tab === 'weekly') {
          query = query.where('week', '==', getISOWeek());
        }
        lbUnsubscribe = query.onSnapshot(snapshot => {
          if (snapshot.empty) {
            container.innerHTML = "<div style='padding:2rem;text-align:center'>No scores recorded yet. Be the first!</div>";
            return;
          }
          let html = '';
          let i = 0;
          snapshot.forEach(doc => {
            const p = doc.data();
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            const rankLabel = i === 0 ? '1' : i === 1 ? '2' : i === 2 ? '3' : i + 1;
            const isCurrentUser = state.user && state.user.uid === doc.id;
            const borderStyle = isCurrentUser ? 'border-left: 3px solid var(--accent);' : '';
            let tierName = 'Bronze';
            let tierColor = '#cd7f32';
            if (p.score >= 25000) { tierName = 'World Class'; tierColor = 'var(--accent)'; }
            else if (p.score >= 10000) { tierName = 'Diamond'; tierColor = 'var(--accent)'; }
            else if (p.score >= 5000) { tierName = 'Platinum'; tierColor = '#e5e4e2'; }
            else if (p.score >= 2500) { tierName = 'Gold'; tierColor = 'var(--gold)'; }
            else if (p.score >= 1000) { tierName = 'Silver'; tierColor = '#c0c0c0'; }
            html += `
                <div class="lb-row" style="${borderStyle}">
                  <div class="lb-rank ${rankClass}">${rankLabel}</div>
                  <div class="lb-avatar" style="background: var(--surface2)">
                    ${p.avatar ? `<img src="${p.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">` : (p.name ? p.name[0] : '?')}
                  </div>
                  <div class="lb-info">
                    <div class="lb-name">${p.name || 'Guest'} 
                        <span style="font-size:0.65rem;background:${tierColor};color:#000;padding:0.1rem 0.35rem;border-radius:4px;margin-left:0.5rem;font-weight:700">${tierName}</span>
                    </div>
                  </div>
                  <div class="lb-score">${(p.score || 0).toLocaleString()}</div>
                </div>`;
            i++;
          });
          container.innerHTML = html;
        }, err => {
          console.error("Leaderboard error", err);
          container.innerHTML = "<div style='padding:2rem;text-align:center'>Error loading standings.</div>";
        });
      }
      function renderLeaderboard(containerId, data) {
        // Dynamic leaderboard overwrite
        if (containerId === 'lb-main-list') {
          switchLbTab(null, 'alltime');
        } else if (containerId === 'lb-list') {
          // Home preview: query top 5 all-time
          if (!window.db) return;
          db.collection('leaderboard_alltime').orderBy('score', 'desc').limit(5).onSnapshot(snapshot => {
            const el = document.getElementById(containerId);
            if (!el) return;
            if (snapshot.empty) {
              el.innerHTML = "<div style='padding:1rem;text-align:center'>No scores yet.</div>";
              return;
            }
            let html = '';
            let i = 0;
            snapshot.forEach(doc => {
              const p = doc.data();
              const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
              html += `
                      <div class="lb-row">
                        <div class="lb-rank ${rankClass}">${i + 1}</div>
                        <div class="lb-info">
                          <div class="lb-name">${p.name || 'Guest'}</div>
                        </div>
                        <div class="lb-score">${(p.score || 0).toLocaleString()}</div>
                      </div>`;
              i++;
            });
            el.innerHTML = html;
          });
        }
      }
      function switchTab(el) {
        // Stub to support existing nav active styling if referenced
        if (el) {
          el.parentNode.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
          el.classList.add('active');
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
        document.getElementById('sound-btn').textContent = state.sound ? 'Disable' : 'Enable';
        showToast('Sound ON', 'info');
      }
      // ────────────────────────── a•a•a•a•a•a• TOAST a•a•a•a•a•a•a•
      function showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '🏆', error: '❌', info: '⚡' };
        toast.innerHTML = `<span>${icons[type] || '⚡'}</span> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(20px)';
          toast.style.transition = 'all .3s';
          setTimeout(() => toast.remove(), 300);
        }, 3000);
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
      function toggleMenu() { document.getElementById('mobile-menu').classList.toggle('open'); }
      function closeMenu() { document.getElementById('mobile-menu').classList.remove('open'); }
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
          state.user.favClub = name;
          state.user.favClubLogo = logo;
          localStorage.setItem('footytrivia_user', JSON.stringify(state.user));
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
          state.user.favWc = name;
          state.user.favWcLogo = flagUrl;
          localStorage.setItem('footytrivia_user', JSON.stringify(state.user));
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
      function openModal(type) {
        const overlay = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        if (!overlay || !content) return;
        if (type === 'login') {
          content.innerHTML = `
          <h2 class="modal-title">Welcome Back</h2>
          <div class="modal-sub">Log in to track your scores and compete globally.</div>
          <form onsubmit="mockLogin(event)">
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              <input type="password" id="auth-password" class="form-input" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Log In</button>
          </form>
          <div class="modal-footer">
            Don't have an account? <a onclick="openModal('signup')">Sign Up</a>
          </div>
        `;
        } else {
          content.innerHTML = `
          <h2 class="modal-title">Create Account</h2>
          <div class="modal-sub">Join the ultimate football trivia arena today.</div>
          <form onsubmit="mockRegister(event)">
            <div class="form-group">
              <label class="form-label">USERNAME</label>
              <input type="text" id="auth-username" class="form-input" required placeholder="footballer123">
            </div>
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <input type="email" id="auth-email" class="form-input" required placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              <input type="password" id="auth-password" class="form-input" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">Sign Up</button>
          </form>
          <div class="modal-footer">
            Already have an account? <a onclick="openModal('login')">Log In</a>
          </div>
        `;
        }
        overlay.classList.add('show');
      }
      function closeModal() {
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
      function mockRegister(e) {
        e.preventDefault();
        const username = document.getElementById('auth-username').value.trim();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        if (!username || !email || !password) return;
        const userObj = {
          username: username,
          email: email,
          level: 1,
          xp: 120,
          gamesPlayed: 0,
          correctAnswers: 0,
          currentStreak: 0,
          bestStreak: 0,
          accuracy: 0,
          totalQuestions: 0
        };
        localStorage.setItem('footytrivia_user', JSON.stringify(userObj));
        state.user = userObj;
        closeModal();
        updateAuthUI();
        showToast(`Welcome, ${username}! Account created.`, 'success');
      }
      function mockLogin(e) {
        e.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const storedUser = localStorage.getItem('footytrivia_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj.email.toLowerCase() === email.toLowerCase()) {
            state.user = userObj;
            closeModal();
            updateAuthUI();
            showToast(`Welcome back, ${userObj.username}!`, 'success');
            return;
          }
        }
        const tempUsername = email.split('@')[0];
        const newUserObj = {
          username: tempUsername,
          email: email,
          level: 1,
          xp: 120,
          gamesPlayed: 0,
          correctAnswers: 0,
          currentStreak: 0,
          bestStreak: 0,
          accuracy: 0,
          totalQuestions: 0
        };
        localStorage.setItem('footytrivia_user', JSON.stringify(newUserObj));
        state.user = newUserObj;
        closeModal();
        updateAuthUI();
        showToast(`Welcome back, ${tempUsername}!`, 'success');
      }
      function logout() {
        state.user = null;
        updateAuthUI();
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
        const statsVals = document.querySelectorAll('.profile-stat-val');
        if (state.user) {
          const user = state.user;
          if (navAuthWrap) {
            navAuthWrap.innerHTML = `
            <span style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text2);margin-right:0.5rem">👤 ${user.username}</span>
            <button class="btn btn-ghost" onclick="logout()">Log out</button>
          `;
          }
          if (mobileAuthWrap) {
            mobileAuthWrap.innerHTML = `
            <span style="font-family:var(--font-ui);font-size:0.85rem;color:var(--text2);flex:1;text-align:center">👤 ${user.username}</span>
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
            const rankIdx = Math.min(ranks.length - 1, Math.floor(user.level / 2));
            profileRankEl.textContent = ranks[rankIdx].toUpperCase();
          }
          if (xpFillEl) {
            const pct = (user.xp / 1000) * 100;
            xpFillEl.style.width = `${pct}%`;
          }
          if (xpLabelEl) {
            xpLabelEl.textContent = `${user.xp} / 1000 XP to next level`;
          }
          if (statsVals && statsVals.length >= 4) {
            statsVals[0].textContent = user.gamesPlayed || 0;
            statsVals[1].textContent = user.correctAnswers || 0;
            statsVals[2].textContent = `${user.accuracy || 0}%`;
            statsVals[3].textContent = user.bestStreak || 0;
          }
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
          if (statsVals && statsVals.length >= 4) {
            statsVals[0].textContent = '0';
            statsVals[1].textContent = '0';
            statsVals[2].textContent = '0%';
            statsVals[3].textContent = '0';
          }
        }
        // Update Favourite Club UI
        const favClubLabel = document.getElementById('profile-fav-club-label');
        const favClubBtn = document.getElementById('profile-fav-club-btn');
        let favClubName = state.user ? state.user.favClub : state.guestFavClub;
        let favClubLogoUrl = state.user ? state.user.favClubLogo : state.guestFavClubLogo;
        if (favClubName) {
          if (favClubLabel) {
            favClubLabel.innerHTML = `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem"><img src="${favClubLogoUrl}" style="height:1.2rem;width:1.2rem;object-fit:contain;vertical-align:middle" onerror="this.src='https://crests.football-data.org/PL.png'"/> <span style="color:var(--text);font-weight:600">${favClubName}</span></div>`;
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
            favWcLabel.innerHTML = `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem"><img src="${favWcLogoUrl}" style="height:1.2rem;width:1.8rem;object-fit:cover;border-radius:2px;vertical-align:middle;box-shadow:0 1px 2px rgba(0,0,0,0.2)"/> <span style="color:var(--text);font-weight:600">${favWcName}</span></div>`;
          }
          if (favWcBtn) favWcBtn.textContent = 'Change';
        } else {
          if (favWcLabel) favWcLabel.textContent = 'Not set';
          if (favWcBtn) favWcBtn.textContent = 'Set';
        }
      }
      function saveQuizResult(mode, score, correct, total, timeTaken) {
        if (!state.user) return;
        const user = state.user;
        user.gamesPlayed = (user.gamesPlayed || 0) + 1;
        user.correctAnswers = (user.correctAnswers || 0) + correct;
        user.totalQuestions = (user.totalQuestions || 0) + total;
        user.accuracy = user.totalQuestions > 0 ? Math.round((user.correctAnswers / user.totalQuestions) * 100) : 0;
        if (state.quiz.bestStreak > (user.bestStreak || 0)) {
          user.bestStreak = state.quiz.bestStreak;
        }
        const xpEarned = Math.round(score / 10) + 50;
        user.xp = (user.xp || 0) + xpEarned;
        while (user.xp >= 1000) {
          user.xp -= 1000;
          user.level = (user.level || 0) + 1;
          showToast(`🎉 Level Up! You reached Level ${user.level}!`, 'success');
        }
        localStorage.setItem('footytrivia_user', JSON.stringify(user));
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
      document.addEventListener('DOMContentLoaded', () => {
        // Load session
        const storedUser = localStorage.getItem('footytrivia_user');
        if (storedUser) {
          state.user = JSON.parse(storedUser);
        } else {
          state.guestFavClub = localStorage.getItem('footytrivia_guest_fav_club');
          state.guestFavClubLogo = localStorage.getItem('footytrivia_guest_fav_club_logo');
          state.guestFavWc = localStorage.getItem('footytrivia_guest_fav_wc');
          state.guestFavWcLogo = localStorage.getItem('footytrivia_guest_fav_wc_logo');
        }
        updateAuthUI();
        // Auto-join battle lobby if code is in URL
        const urlParams = new URLSearchParams(window.location.search);
        const battleCode = urlParams.get('code');
        if (battleCode) {
          showPage('battle');
          joinRoom(battleCode.toUpperCase());
        } else {
          
          const lastPage = localStorage.getItem('footytrivia_last_page');
          
          if (lastPage) {
            showPage(lastPage);
          }
        }
        // Init home leaderboard preview with static data
        const lbPreview = document.getElementById('lb-list');
        if (lbPreview) {
          let html = '';
          LEADERBOARD_DATA.slice(0, 5).forEach((p, i) => {
            const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            html += `<div class="lb-row"><div class="lb-rank ${rankClass}">${i + 1}</div><div class="lb-info"><div class="lb-name">${p.name}</div></div><div class="lb-score">${(p.score || 0).toLocaleString()}</div></div>`;
          });
          lbPreview.innerHTML = html;
        }
        // Init leaderboard with static data on load
        const lbContainer = document.getElementById('lb-main-list');
        if (lbContainer) renderStaticLeaderboard(lbContainer);
        renderCategories('home-cats');
        renderCategories('play-cats');
        newTransferGame();
        setInterval(updateCountdown, 1000);
        updateCountdown();
        // Animate hero stats on load
        setTimeout(() => { document.querySelectorAll('.hero-stat-num').forEach(el => { el.style.animation = 'popIn .6s ease'; }); }, 300);
      });
      // ── WORLD CUP 2026 DATA & FUNCTIONS ──
      // COUNTRY_CODES loaded from data.js
      function getFlagImg(countryName) {
        const code = COUNTRY_CODES[countryName];
        if (!code) return '🏳️';
        return `<img src="https://flagcdn.com/w40/${code}.png" alt="${countryName}" class="wc-flag-img" style="width:22px; height:15px; border-radius:2px; object-fit:cover; vertical-align:middle; box-shadow:0 1px 2px rgba(0,0,0,0.25);">`;
      }
      // WC_TEAMS loaded from data.js
      // WC_GROUPS loaded from data.js
      // WC_PLAYERS loaded from data.js
      // WC_FIXTURES loaded from data.js
      // Seed photo database for top superstars to load instantly
      const seedPlayerPhotos = {
        'Kylian Mbappe': 'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
        'Kylian Mbappé': 'https://r2.thesportsdb.com/images/media/player/cutout/h9u9vz1733653583.png',
        'Lionel Messi': 'https://r2.thesportsdb.com/images/media/player/cutout/e0i2051750317027.png',
        'Cristiano Ronaldo': 'https://r2.thesportsdb.com/images/media/player/cutout/a19jje1761592498.png',
        'Jude Bellingham': 'https://r2.thesportsdb.com/images/media/player/cutout/trk5271750271712.png',
        'Lamine Yamal': 'https://r2.thesportsdb.com/images/media/player/cutout/m9n4ja1761512633.png',
        'Vinicius Jr': 'https://r2.thesportsdb.com/images/media/player/cutout/ejuxsh1750271859.png',
        'Harry Kane': 'https://r2.thesportsdb.com/images/media/player/cutout/j4ouvd1756408895.png',
        'Bukayo Saka': 'https://r2.thesportsdb.com/images/media/player/cutout/xfwok41769331816.png',
        'Cole Palmer': 'https://r2.thesportsdb.com/images/media/player/cutout/fn0pzc1757010119.png',
        'Kevin De Bruyne': 'https://r2.thesportsdb.com/images/media/player/cutout/o4flia1764089447.png',
        'Phil Foden': 'https://r2.thesportsdb.com/images/media/player/cutout/lbn4sx1769182620.png'
      };
      let playerPhotoCache = JSON.parse(localStorage.getItem('wc_player_photo_cache')) || {};
      
      // Ensure seed photos are in the cache
      let cacheUpdated = false;
      for (const [name, url] of Object.entries(seedPlayerPhotos)) {
        if (!playerPhotoCache[name]) {
          playerPhotoCache[name] = url;
          cacheUpdated = true;
        }
      }
      if (cacheUpdated) {
        try {
          localStorage.setItem('wc_player_photo_cache', JSON.stringify(playerPhotoCache));
        } catch(e) {}
      }
      function getPlayerPhoto(playerName, callback) {
        const cleanName = playerName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        if (playerPhotoCache[cleanName] !== undefined) {
          callback(playerPhotoCache[cleanName]);
          return;
        }
        // Fetch asynchronously from free open API
        const apiBaseUrl = (window.ENV && window.ENV.SPORTSDB_API_URL) || 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php';
        fetch(`${apiBaseUrl}?p=${encodeURIComponent(cleanName)}`)
          .then(res => {
            if (!res.ok) throw new Error('Network response error');
            return res.json();
          })
          .then(data => {
            let photoUrl = '';
            if (data && data.player && data.player.length > 0) {
              const result = data.player.find(item => item.strSport === 'Soccer') || data.player[0];
              photoUrl = result.strCutout || result.strThumb || '';
            }
            playerPhotoCache[cleanName] = photoUrl;
            try {
              localStorage.setItem('wc_player_photo_cache', JSON.stringify(playerPhotoCache));
            } catch(e) {}
            callback(photoUrl);
          })
          .catch(err => {
            callback('');
          });
      }
      let groupPredictions = JSON.parse(localStorage.getItem('wc_group_predictions')) || JSON.parse(JSON.stringify(WC_GROUPS));
      let matchPredictions = JSON.parse(localStorage.getItem('wc_match_predictions')) || {};
      let awardPredictions = JSON.parse(localStorage.getItem('wc_award_predictions')) || {};
      const GROUP_RANKINGS_SUBMITTED_KEY = 'wc_group_rankings_submitted';
      function areGroupRankingsSubmitted() {
        return localStorage.getItem(GROUP_RANKINGS_SUBMITTED_KEY) === 'true';
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
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
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
        const thirds = [];
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          const team = group.teams[2]; // The 3rd placed team is at index 2
          if (!team) return;
          
          const baseSeed = getSeed(team.name) + groupKey.charCodeAt(0);
          const pts = team.pts || 0;
          const gd = team.gd || 0;
          const gf = team.gf || 0;
          const ga = gf - gd;
          const { w, d, l } = getWDL(pts, baseSeed);
          
          // Get FIFA ranking
          const teamObjFromData = typeof WC_TEAMS !== 'undefined' ? WC_TEAMS.find(t => t.name === team.name) : null;
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

      function renderBestThirdPlacedTable() {
        const thirds = getBestThirdPlacedTeams();

        // 1. Predictions Tab Table
        const tbodyPred = document.getElementById('best-third-place-table-body');
        if (tbodyPred) {
          tbodyPred.innerHTML = '';
          thirds.forEach((item, idx) => {
            const rank = idx + 1;
            const isQualified = rank <= 8;
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

      function onGroupStandingsChanged() {
        updateGroupStandingsStats();
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        localStorage.removeItem(GROUP_RANKINGS_SUBMITTED_KEY);
        renderGroupPredictions();
        renderGroupStandings();
        renderBestThirdPlacedTable();
        if (window.bracketPredictor) {
          window.bracketPredictor.syncRound32Matchups();
        }
        updatePredictorProfile();
      }

      // Initialize stats on load
      updateGroupStandingsStats();
      renderGroupStandings();
      renderBestThirdPlacedTable();

      // Render functions for Group Standings
      function renderGroupStandings() {
        const container = document.getElementById('wc-dashboard-groups');
        if (!container) return;
        container.innerHTML = '';
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
          const card = document.createElement('div');
          card.className = 'wc-card';
          let html = `
            <div class="wc-card-title">${group.name} <span style="font-size:0.75rem; color:var(--gold)">Matchday 1</span></div>
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
        container.innerHTML = '';
        Object.keys(groupPredictions).forEach(groupKey => {
          const group = groupPredictions[groupKey];
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
            item.draggable = true;
            item.dataset.teamName = team.name;
            item.dataset.groupKey = groupKey;
            item.dataset.index = index;
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOver);
            item.addEventListener('drop', handleDrop);
            item.addEventListener('dragend', handleDragEnd);
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
                <button class="wc-reorder-btn" onclick="moveTeam('${groupKey}', ${index}, -1)" title="Move Up">▲</button>
                <button class="wc-reorder-btn" onclick="moveTeam('${groupKey}', ${index}, 1)" title="Move Down">▼</button>
              </div>
            `;
            list.appendChild(item);
          });
          card.appendChild(list);
          container.appendChild(card);
        });
      }
      let dragSourceItem = null;
      function handleDragStart(e) {
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
          window.bracketPredictor.saveBracket();
        }
      }
      function handleDrop(e) {
        e.stopPropagation();
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
          onGroupStandingsChanged();
        }
        return false;
      }
      function handleDragEnd() {
        this.style.opacity = '1';
      }
      function moveTeam(groupKey, index, direction) {
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
        onGroupStandingsChanged();
      }
      function submitGroupPredictions() {
        updateGroupStandingsStats();
        localStorage.setItem('wc_group_predictions', JSON.stringify(groupPredictions));
        localStorage.setItem(GROUP_RANKINGS_SUBMITTED_KEY, 'true');
        if (window.bracketPredictor) {
          window.bracketPredictor.syncRound32Matchups();
          window.bracketPredictor.renderBracket();
        }
        showToast('Group predictions saved! Bonus points calculated when official standings are confirmed.', 'success');
      }
      // Render upcoming match predictions
      function renderMatchPredictions() {
        const container = document.getElementById('wc-predictions-fixtures');
        if (!container) return;
        container.innerHTML = '';
        WC_FIXTURES.forEach(fixture => {
          const card = document.createElement('div');
          card.className = 'wc-card';
          card.style.background = 'var(--surface2)';
          card.style.border = '1px solid var(--border)';
          card.style.padding = '1.25rem';
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.gap = '0.75rem';
          const pred = matchPredictions[fixture.id] || { homeScore: '', awayScore: '' };
          const hasPredicted = pred.homeScore !== '' && pred.awayScore !== '';
          card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text3); border-bottom:1px solid var(--border); padding-bottom:0.5rem;">
              <span>${fixture.group}</span>
              <span>${fixture.date} • ${fixture.time}</span>
            </div>
            
            <div style="display:flex; align-items:center; justify-content:space-between; padding:0.5rem 0;">
              <div style="display:flex; align-items:center; gap:0.5rem; flex:1;">
                ${getFlagImg(fixture.home)}
                <span style="font-weight:600; font-size:0.9rem;">${fixture.home}</span>
              </div>
              <input type="number" id="pred-home-${fixture.id}" value="${pred.homeScore}" min="0" placeholder="-" style="width:42px; text-align:center; padding:0.3rem; border:1px solid var(--border); border-radius:4px; background:var(--surface); color:var(--text); font-weight:700;">
              
              <span style="margin:0 0.75rem; color:var(--text3); font-size:0.8rem;">vs</span>
              
              <input type="number" id="pred-away-${fixture.id}" value="${pred.awayScore}" min="0" placeholder="-" style="width:42px; text-align:center; padding:0.3rem; border:1px solid var(--border); border-radius:4px; background:var(--surface); color:var(--text); font-weight:700;">
              <div style="display:flex; align-items:center; gap:0.5rem; flex:1; justify-content:flex-end;">
                <span style="font-weight:600; font-size:0.9rem;">${fixture.away}</span>
                ${getFlagImg(fixture.away)}
              </div>
            </div>
            
            <div style="font-size:0.75rem; color:var(--text2); text-align:center; margin-top:0.25rem; font-style:italic;">
              Venue: ${fixture.venue}
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.75rem;">
              <span id="pred-status-${fixture.id}" style="font-size:0.75rem; font-weight:700; color:${hasPredicted ? 'var(--success)' : 'var(--text3)'}">
                ${hasPredicted ? `Predicted: ${pred.homeScore} - ${pred.awayScore}` : 'Not Predicted'}
              </span>
              <button class="btn btn-ghost" style="padding:0.3rem 0.8rem; font-size:0.8rem;" onclick="saveMatchPrediction(${fixture.id})">Save Prediction</button>
            </div>
          `;
          container.appendChild(card);
        });
      }
      function saveMatchPrediction(fixtureId) {
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
          statusEl.style.color = 'var(--success)';
        }
        updatePredictorProfile();
        showToast('Prediction saved successfully!', 'success');
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
        if (currentModalAwardKey === 'golden-boot') {
          return WC_PLAYERS.filter(p => p.pos === 'Forward' || p.subPos === 'Attacking Midfielder');
        } else if (currentModalAwardKey === 'golden-glove') {
          return WC_PLAYERS.filter(p => p.pos === 'Goalkeeper');
        } else if (currentModalAwardKey === 'best-young') {
          return WC_PLAYERS.filter(p => p.age <= 22);
        } else {
          // Golden Ball: all positions
          return WC_PLAYERS;
        }
      }
      function openSelectorModal(awardKey, awardTitle, type) {
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
        const sortSelect = document.getElementById('wc-modal-sort');
        if (nationSelect) currentModalFilterNation = nationSelect.value;
        if (clubSelect) currentModalFilterClub = clubSelect.value;
        if (sortSelect) currentModalSortBy = sortSelect.value;
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
            nations = WC_TEAMS.map(t => t.name).sort();
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
        const sortSelect = document.getElementById('wc-modal-sort');
        if (sortSelect) {
          let options = [];
          if (currentModalType === 'team') {
            options = [
              { val: 'RANKING', label: 'FIFA Ranking' },
              { val: 'ALPHABETICAL', label: 'Alphabetical' },
              { val: 'CONFEDERATION', label: 'Confederation' }
            ];
          } else {
            options = [
              { val: 'POPULARITY', label: 'Popularity' },
              { val: 'MARKET_VALUE', label: 'Market Value' },
              { val: 'FORM', label: 'Current Form' },
              { val: 'ALPHABETICAL', label: 'Alphabetical' }
            ];
            if (currentModalAwardKey === 'golden-boot' || currentModalAwardKey === 'golden-ball' || currentModalAwardKey === 'best-young') {
              options.unshift({ val: 'GOALS', label: 'Goals Scored' });
            }
            if (currentModalAwardKey === 'golden-glove') {
              options.unshift({ val: 'CLEAN_SHEETS', label: 'Clean Sheets' });
              options.unshift({ val: 'SAVES', label: 'Saves Made' });
            }
          }
          
          sortSelect.innerHTML = options.map(o => `<option value="${o.val}" ${currentModalSortBy === o.val ? 'selected' : ''}>${o.label}</option>`).join('');
        }
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
          list.sort((a, b) => {
            if (currentModalSortBy === 'GOALS') {
              return (b.goals || 0) - (a.goals || 0);
            } else if (currentModalSortBy === 'MARKET_VALUE') {
              return b.marketValue - a.marketValue;
            } else if (currentModalSortBy === 'FORM') {
              return b.form - a.form;
            } else if (currentModalSortBy === 'CLEAN_SHEETS') {
              return (b.cleanSheets || 0) - (a.cleanSheets || 0);
            } else if (currentModalSortBy === 'SAVES') {
              return (b.saves || 0) - (a.saves || 0);
            } else if (currentModalSortBy === 'AGE') {
              return a.age - b.age;
            } else if (currentModalSortBy === 'ALPHABETICAL') {
              return a.name.localeCompare(b.name);
            } else {
              return b.popularity - a.popularity;
            }
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
            card.innerHTML = `
              ${favBadge}
              <div class="wc-card-player-hero">
                <div class="wc-card-avatar-frame" style="background:${grad}">
                  <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; position:absolute; top:0; left:0; display:flex; align-items:center; justify-content:center;">
                    <span class="wc-card-avatar-initials">${initials}</span>
                    <img class="wc-card-avatar-img" data-player="${p.name}" src="" style="display:none; width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';">
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
              <button class="wc-card-select-btn" onclick="selectSelectorItemFromModal('${p.name.replace(/'/g, "\\'")}')">Select Player</button>
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
          let list = [...WC_TEAMS];
          if (query.length > 0) {
            list = list.filter(t => t.name.toLowerCase().includes(query) || t.confederation.toLowerCase().includes(query));
          }
          if (currentModalFilterNation !== 'ALL') {
            list = list.filter(t => t.name === currentModalFilterNation);
          }
          list.sort((a, b) => {
            if (currentModalSortBy === 'RANKING') {
              return a.ranking - b.ranking;
            } else if (currentModalSortBy === 'CONFEDERATION') {
              return a.confederation.localeCompare(b.confederation);
            } else {
              return a.name.localeCompare(b.name);
            }
          });
          if (list.length === 0) {
            emptyState.style.display = 'block';
            return;
          }
          list.forEach(t => {
            const card = document.createElement('div');
            card.className = 'wc-modal-team-card';
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
              <button class="wc-card-select-btn" style="width:100%; margin-top:auto;" onclick="selectSelectorItemFromModal('${t.name.replace(/'/g, "\\'")}')">Select Team</button>
            `;
            grid.appendChild(card);
          });
        }
      }
      function selectSelectorItemFromModal(name) {
        if (currentModalType === 'team') {
          awardPredictions[currentModalAwardKey] = name;
        } else {
          const player = WC_PLAYERS.find(p => p.name === name);
          if (player) {
            awardPredictions[currentModalAwardKey] = player;
          }
        }
        localStorage.setItem('wc_award_predictions', JSON.stringify(awardPredictions));
        updateAwardsDisplay();
        closeSelectorModal();
        updatePredictorProfile();
        showToast(`Prediction for ${currentModalAwardTitle} saved!`, 'success');
      }
      function updateAwardsDisplay() {
        renderAwardsGrid();
      }
      function renderAwardsGrid() {
        const grid = document.getElementById('wc-awards-grid');
        if (!grid) return;
        const awardsConfig = [
          {
            key: 'golden-boot',
            title: 'Golden Boot',
            subtitle: 'Top Goalscorer',
            icon: '⚽',
            desc: 'Attacking players (forwards, strikers, wingers, attacking mids) participating in the tournament.',
            type: 'player'
          },
          {
            key: 'golden-ball',
            title: 'Golden Ball',
            subtitle: 'Player of the Tournament',
            icon: '🟡',
            desc: 'Best player of the tournament, open to all players regardless of position.',
            type: 'player'
          },
          {
            key: 'golden-glove',
            title: 'Golden Glove',
            subtitle: 'Best Goalkeeper',
            icon: '🧤',
            desc: 'Outstanding goalkeeper of the tournament, restricted to goalkeepers.',
            type: 'player'
          },
          {
            key: 'best-young',
            title: 'Best Young Player',
            subtitle: 'U-22 Star of the Tournament',
            icon: '🌟',
            desc: 'Best performing young player under FIFA age requirements (age 22 or under).',
            type: 'player'
          },
          {
            key: 'world-champion',
            title: 'World Champion',
            subtitle: 'Tournament Winner',
            icon: '🏆',
            desc: 'Select the nation you predict will lift the FIFA World Cup 2026 trophy.',
            type: 'team'
          }
        ];
        grid.innerHTML = awardsConfig.map(award => {
          const pred = awardPredictions[award.key];
          const isSelected = !!pred;
          const cardClass = isSelected ? 'wc-award-card selected' : 'wc-award-card';
          let selectionHtml = '';
          if (isSelected) {
            if (award.type === 'team') {
              const teamName = typeof pred === 'string' ? pred : pred.name;
              const teamObj = WC_TEAMS.find(t => t.name === teamName) || { name: teamName, ranking: 'N/A', confederation: 'N/A', recent: 'N/A' };
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
            } else {
              const initials = pred.name.split(' ').map(n => n[0]).join('');
              const grad = getPlayerGradient(pred.pos);
              selectionHtml = `
                <div class="wc-award-selected-player-card">
                  <div class="wc-selected-player-badge" style="background:${grad}; position:relative;">
                    <div style="width:100%; height:100%; border-radius:50%; overflow:hidden; position:absolute; top:0; left:0; display:flex; align-items:center; justify-content:center;">
                      <span class="wc-selected-player-initials">${initials}</span>
                      <img class="wc-selected-player-img" data-player="${pred.name}" src="" style="display:none; width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;" onload="this.style.display='block'; this.previousElementSibling.style.display='none';">
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
                    <div class="wc-selected-player-stats">Stats: ${pred.stats}</div>
                    <div style="font-size:0.65rem; color:var(--success); font-weight:600; margin-top:0.15rem;">
                      Age: ${pred.age} • ${pred.formIndicator || '⭐ Stable'}
                    </div>
                  </div>
                </div>
              `;
            }
          } else {
            selectionHtml = `
              <div class="wc-award-icon-placeholder">${award.icon}</div>
              <p style="font-size:0.75rem; color:var(--text2); margin-bottom:1.5rem; line-height:1.4;">${award.desc}</p>
            `;
          }
          const buttonText = isSelected ? 'Change Selection' : 'Select Prediction';
          const buttonClass = isSelected ? 'btn btn-ghost' : 'btn btn-primary';
          return `
            <div class="${cardClass}">
              <div style="display:flex; align-items:center; gap:0.75rem; width:100%; margin-bottom:1.25rem;">
                <div class="wc-award-badge">${award.icon}</div>
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
        const matchCount = Object.keys(matchPredictions).length;
        const awardsCount = Object.keys(awardPredictions).length;
        let groupComps = 0;
        if (localStorage.getItem('wc_group_predictions')) {
          groupComps = 12;
        }
        const pts = (matchCount * 10) + (groupComps * 10) + (awardsCount * 50);
        let tier = 'Unranked';
        let tierClass = 'wc-tier-gold';
        if (pts >= 300) { tier = 'Elite'; tierClass = 'wc-tier-elite'; }
        else if (pts >= 150) { tier = 'Gold'; tierClass = 'wc-tier-gold'; }
        else if (pts > 0) { tier = 'Bronze'; tierClass = 'wc-tier-gold'; }
        const ptsEl = document.getElementById('wc-profile-pts');
        const accEl = document.getElementById('wc-profile-accuracy');
        const tierEl = document.getElementById('wc-profile-tier');
        if (ptsEl) ptsEl.textContent = pts.toLocaleString();
        if (accEl) accEl.textContent = pts > 0 ? '85%' : '0%';
        if (tierEl) {
          tierEl.textContent = `Tier: ${tier}`;
          tierEl.className = `wc-tier-badge ${tierClass}`;
        }
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
          this.syncRound32Matchups();
          this.loadSavedBracket();
          this.renderProgress();
          this.renderBracket();
          this.updateChampionDisplay();

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
          if (typeof WC_TEAMS !== 'undefined') {
            const found = WC_TEAMS.find(t => t.name === name);
            if (found) return found;
          }
          return { name };
        }

        loadSavedBracket() {
          const saved = localStorage.getItem(this.storageKey);
          if (!saved) return;
          try {
            const data = JSON.parse(saved);
            data.forEach((d, i) => {
              if (i >= this.totalMatches) return;
              const m = this.matches[i];
              if (i >= 16) {
                if (d.home) m.home = this.findTeamByName(d.home);
                if (d.away) m.away = this.findTeamByName(d.away);
              }
              if (d.winner) {
                m.winner = d.winner;
                const winnerTeam = m[d.winner];
                if (winnerTeam) {
                  this.propagateWinner(i, winnerTeam, false);
                }
              }
            });
          } catch (e) { console.error('Bracket load error:', e); }
        }

        // ── SYNC R32 slot labels from group predictions ──
        syncRound32Matchups(forceDesignated = true) {
          this._savedDesignations = {};
          const isSubmitted = areGroupRankingsSubmitted();
          
          for (let i = 0; i < 16; i++) {
            const homeCode = this.getSlotDesignation(i, 'home');
            const awayCode = this.getSlotDesignation(i, 'away');
            this._savedDesignations[`${i}-home`] = homeCode;
            this._savedDesignations[`${i}-away`] = awayCode;

            const m = this.matches[i];
            
            if (isSubmitted) {
              const defaultHome = this.getTeamByDesignation(homeCode);
              const defaultAway = this.getTeamByDesignation(awayCode);

              // Check if home changed
              if (defaultHome) {
                if (!m.home || m.home.name !== defaultHome.name) {
                  m.home = defaultHome;
                  this.clearDownstream(i);
                }
              } else {
                if (m.home) {
                  m.home = null;
                  this.clearDownstream(i);
                }
              }

              // Check if away changed
              if (defaultAway) {
                if (!m.away || m.away.name !== defaultAway.name) {
                  m.away = defaultAway;
                  this.clearDownstream(i);
                }
              } else {
                if (m.away) {
                  m.away = null;
                  this.clearDownstream(i);
                }
              }
            } else {
              if (m.home || m.away) {
                m.home = null;
                m.away = null;
                this.clearDownstream(i);
              }
            }
          }
          this.saveBracket();
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
          const m = this.matches[matchId];
          if (!m.home || !m.away) return;

          // Toggle off if already picked
          if (m.winner === side) {
            this.clearDownstream(matchId);
            this.renderBracket();
            this.renderProgress();
            this.updateChampionDisplay();
            this.saveBracket();
            return;
          }

          m.winner = side;
          const winnerTeam = m[side];
          this.propagateWinner(matchId, winnerTeam, true);
          this.renderBracket();
          this.renderProgress();
          this.updateChampionDisplay();
          this.saveBracket();
        }

        propagateWinner(matchId, team, render = true) {
          if (matchId === 30) {
            // Final — no downstream
            if (render) this.updateChampionDisplay(team);
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
          if (matchId < 16 && !areGroupRankingsSubmitted()) {
            showToast('Submit your group ranking predictions in the Prediction Center before choosing knockout teams.', 'error');
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
          this.renderBracket();
          this.renderProgress();
          this.saveBracket();
        }

        // ── DROPDOWN ──
        toggleDropdown(slotEl, matchId, side) {
          if (matchId < 16 && !areGroupRankingsSubmitted()) {
            showToast('Submit your group ranking predictions in the Prediction Center before choosing knockout teams.', 'error');
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
              this.renderBracket();
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

          // Wait a frame for DOM layout to complete, then align and draw connectors
          setTimeout(() => {
            this.alignMatchesAndDrawConnectors();
          }, 0);
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
            vs.textContent = 'VS';
            matchEl.appendChild(vs);
            // Away slot
            matchEl.appendChild(this.buildSlot(id, 'away'));

            matchesContainer.appendChild(matchEl);
          });

          return col;
        }

        buildSlot(matchId, side) {
          const m = this.matches[matchId];
          const team = m[side];
          const slot = document.createElement('div');
          slot.className = 'bp-slot';
          slot.dataset.matchId = matchId;
          slot.dataset.side = side;
          const r32Locked = matchId < 16 && !areGroupRankingsSubmitted();
          if (r32Locked) {
            slot.classList.add('locked');
            slot.title = 'Submit group ranking predictions in the Prediction Center to unlock team selection.';
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

            // Change button to override/choose team
            if (matchId < 16) {
              const editBtn = document.createElement('span');
              editBtn.className = 'bp-slot-edit';
              editBtn.innerHTML = '✎';
              editBtn.title = 'Choose team from group stage';
              editBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleDropdown(slot, matchId, side);
              };
              slot.appendChild(editBtn);
            }

            // For R32 slots: clicking slot body selects winner (if both filled),
            // the ✎ button is the explicit way to open group picker
            slot.onclick = (e) => {
              if (this.activeDropdown && this.activeDropdown.contains(e.target)) return;
              e.stopPropagation();
              if (matchId < 16) {
                // R32: clicking the slot name area picks winner; ✎ button opens picker
                if (m.home && m.away) {
                  this.selectWinner(matchId, side);
                } else {
                  this.toggleDropdown(slot, matchId, side);
                }
              } else {
                if (m.home && m.away) this.selectWinner(matchId, side);
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

            // Click: open dropdown for R32 slots, no-op for locked later rounds
            slot.onclick = (e) => {
              if (e.target.closest('.bp-dropdown')) return;
              e.stopPropagation();
              if (matchId < 16) {
                this.toggleDropdown(slot, matchId, side);
              }
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
          // 1. Position matches in later rounds absolute based on vertical centering of their source matches
          
          // Round of 16 (matches 16-23)
          for (let id = 16; id <= 23; id++) {
            const mEl = document.getElementById(`bp-match-${id}`);
            const sources = this.getSourceMatches(id);
            const s1El = document.getElementById(`bp-match-${sources[0]}`);
            const s2El = document.getElementById(`bp-match-${sources[1]}`);
            if (mEl && s1El && s2El) {
              const y1 = s1El.offsetTop + s1El.offsetHeight / 2;
              const y2 = s2El.offsetTop + s2El.offsetHeight / 2;
              const centerY = (y1 + y2) / 2;
              mEl.style.position = 'absolute';
              mEl.style.top = (centerY - mEl.offsetHeight / 2) + 'px';
              mEl.style.left = '4px';
              mEl.style.right = '4px';
            }
          }

          // Quarter-Finals (matches 24-27)
          for (let id = 24; id <= 27; id++) {
            const mEl = document.getElementById(`bp-match-${id}`);
            const sources = this.getSourceMatches(id);
            const s1El = document.getElementById(`bp-match-${sources[0]}`);
            const s2El = document.getElementById(`bp-match-${sources[1]}`);
            if (mEl && s1El && s2El) {
              const y1 = s1El.offsetTop + s1El.offsetHeight / 2;
              const y2 = s2El.offsetTop + s2El.offsetHeight / 2;
              const centerY = (y1 + y2) / 2;
              mEl.style.position = 'absolute';
              mEl.style.top = (centerY - mEl.offsetHeight / 2) + 'px';
              mEl.style.left = '4px';
              mEl.style.right = '4px';
            }
          }

          // Semi-Finals (matches 28 and 29)
          for (let id = 28; id <= 29; id++) {
            const mEl = document.getElementById(`bp-match-${id}`);
            const sources = this.getSourceMatches(id);
            const s1El = document.getElementById(`bp-match-${sources[0]}`);
            const s2El = document.getElementById(`bp-match-${sources[1]}`);
            if (mEl && s1El && s2El) {
              const y1 = s1El.offsetTop + s1El.offsetHeight / 2;
              const y2 = s2El.offsetTop + s2El.offsetHeight / 2;
              const centerY = (y1 + y2) / 2;
              mEl.style.position = 'absolute';
              mEl.style.top = (centerY - mEl.offsetHeight / 2) + 'px';
              mEl.style.left = '4px';
              mEl.style.right = '4px';
            }
          }

          // Final (match 30)
          const m30El = document.getElementById('bp-match-30');
          const s1El = document.getElementById('bp-match-28'); // M29
          const s2El = document.getElementById('bp-match-29'); // M30
          let titleHeight = 0;
          if (m30El && s1El && s2El) {
            const y1 = s1El.offsetTop + s1El.offsetHeight / 2;
            const y2 = s2El.offsetTop + s2El.offsetHeight / 2;
            const centerY = (y1 + y2) / 2;
            m30El.style.position = 'absolute';
            m30El.style.top = (centerY - m30El.offsetHeight / 2) + 'px';
            m30El.style.left = '4px';
            m30El.style.right = '4px';

            const finalCol = document.getElementById('bp-final-col');
            const finalTitle = finalCol ? finalCol.querySelector('.bp-round-title') : null;
            titleHeight = finalTitle ? finalTitle.offsetHeight : 0;

            // Champion box now lives outside the bracket wrapper � no positioning needed
          }

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

            if (side === 'left') {
              if (!s2El) return;
              const s2Rect = s2El.getBoundingClientRect();
              const s2Right = s2Rect.right - wrapperRect.left + scrollLeft;
              const s2CenterY = s2Rect.top - wrapperRect.top + scrollTop + s2Rect.height / 2;

              const xStart1 = s1Right;
              const xStart2 = s2Right;
              const xEnd = tLeft;
              const xMid = xStart1 + lineOffset;

              const pathData = `
                M ${xStart1} ${s1CenterY}
                H ${xMid}
                M ${xStart2} ${s2CenterY}
                H ${xMid}
                V ${s1CenterY}
                M ${xMid} ${tCenterY}
                H ${xEnd}
              `.trim();

              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('stroke', '#2a2a30');
              path.setAttribute('stroke-width', '1.5');
              path.setAttribute('fill', 'none');
              path.setAttribute('shape-rendering', 'crispEdges');
              svg.appendChild(path);
            } else if (side === 'right') {
              if (!s2El) return;
              const s2Rect = s2El.getBoundingClientRect();
              const s2Left = s2Rect.left - wrapperRect.left + scrollLeft;
              const s2CenterY = s2Rect.top - wrapperRect.top + scrollTop + s2Rect.height / 2;

              const xStart1 = s1Left;
              const xStart2 = s2Left;
              const xEnd = tRight;
              const xMid = xStart1 - lineOffset;

              const pathData = `
                M ${xStart1} ${s1CenterY}
                H ${xMid}
                M ${xStart2} ${s2CenterY}
                H ${xMid}
                V ${s1CenterY}
                M ${xMid} ${tCenterY}
                H ${xEnd}
              `.trim();

              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('stroke', '#2a2a30');
              path.setAttribute('stroke-width', '1.5');
              path.setAttribute('fill', 'none');
              path.setAttribute('shape-rendering', 'crispEdges');
              svg.appendChild(path);
            } else if (side === 'final-left') {
              const xStart = s1Right;
              const xEnd = tLeft;
              const pathData = `M ${xStart} ${s1CenterY} H ${xEnd}`;
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('stroke', '#2a2a30');
              path.setAttribute('stroke-width', '1.5');
              path.setAttribute('fill', 'none');
              path.setAttribute('shape-rendering', 'crispEdges');
              svg.appendChild(path);
            } else if (side === 'final-right') {
              const xStart = s1Left;
              const xEnd = tRight;
              const pathData = `M ${xStart} ${s1CenterY} H ${xEnd}`;
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', pathData);
              path.setAttribute('stroke', '#2a2a30');
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

        // ── CHAMPION ──
        updateChampionDisplay(team = null) {
          const champBox = document.getElementById('bp-champion-box');
          const champFlag = document.getElementById('bp-champ-flag');
          const champName = document.getElementById('bp-champ-name');
          if (!champBox || !champFlag || !champName) return;

          const finalM = this.matches[30];
          const champ = team || (finalM.winner ? finalM[finalM.winner] : null);

          if (champ) {
            champBox.classList.add('crowned');
            champFlag.innerHTML = getFlagImg(champ.name);
            champName.innerHTML = champ.name;
            champName.style.color = '';
          } else {
            champBox.classList.remove('crowned');
            champBox.className = 'bp-champion';
            champFlag.innerHTML = '\u{1F3C6}';
            champName.textContent = 'SELECT YOUR CHAMPION';
            champName.style.color = 'var(--text3)';
          }
        }

        // ── RESET ──
        reset() {
          if (!confirm('Reset the entire knockout bracket?')) return;
          this.matches.forEach(m => { m.home = null; m.away = null; m.winner = null; });
          localStorage.removeItem(this.storageKey);
          localStorage.removeItem('wc_bracket_state_manual_groups');
          localStorage.removeItem('wc_bracket_state');
          this.syncRound32Matchups();
          this.renderBracket();
          this.renderProgress();
          this.updateChampionDisplay();
          showToast('Bracket reset successfully.', 'success');
        }

        submit() {
          const incomplete = this.matches.find(m => !m.winner);
          if (incomplete) {
            showToast('Please complete all fixture predictions before submitting!', 'error');
            return;
          }
          const champion = this.matches[30][this.matches[30].winner];
          showToast(`Bracket submitted! Predicted champion: ${champion.name}`, 'success');
        }
      }
      // Analytics State variables
      let filteredPlayers = [];
      let analyticsSortCol = 'rating';
      let analyticsSortAsc = false;
      let analyticsCurrentPage = 1;
      const analyticsPageSize = 15;
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

      function enrichPlayerStats() {
        if (!window.WC_PLAYERS) return;
        
        // Only enrich once to maintain consistency and speed
        if (window.WC_PLAYERS[0] && window.WC_PLAYERS[0].appearances !== undefined) return;

        window.WC_PLAYERS.forEach(p => {
          const seed = getSeed(p.name);
          
          const isGK = p.pos === 'Goalkeeper';
          const isDF = p.pos === 'Defender';
          const isMF = p.pos === 'Midfielder';
          const isFW = p.pos === 'Forward';
          
          p.rating = p.form || getDeterministicVal(seed, 6.0, 9.5, 1);
          
          p.appearances = getDeterministicVal(seed, 3, 7);
          p.matchesStarted = getDeterministicVal(seed + 1, Math.max(1, p.appearances - 2), p.appearances);
          p.minutesPlayed = p.matchesStarted * getDeterministicVal(seed + 2, 75, 90) + (p.appearances - p.matchesStarted) * getDeterministicVal(seed + 3, 15, 30);
          
          if (p.goals === undefined) {
            if (isFW) p.goals = getDeterministicVal(seed + 4, 1, 6);
            else if (isMF) p.goals = getDeterministicVal(seed + 4, 0, 3);
            else if (isDF) p.goals = getDeterministicVal(seed + 4, 0, 1);
            else p.goals = 0;
          }
          
          if (p.assists === undefined) {
            if (isFW) p.assists = getDeterministicVal(seed + 5, 0, 3);
            else if (isMF) p.assists = getDeterministicVal(seed + 5, 1, 5);
            else if (isDF) p.assists = getDeterministicVal(seed + 5, 0, 2);
            else p.assists = 0;
          }
          
          if (p.cleanSheets === undefined) {
            if (isGK) p.cleanSheets = getDeterministicVal(seed + 6, 1, 4);
            else if (isDF) p.cleanSheets = getDeterministicVal(seed + 6, 1, 4);
            else p.cleanSheets = 0;
          }
          
          if (p.saves === undefined) {
            if (isGK) p.saves = getDeterministicVal(seed + 7, 8, 28);
            else p.saves = 0;
          }
          
          if (isFW) {
            p.shots = getDeterministicVal(seed + 8, 8, 25);
            p.shotsOnTarget = Math.round(p.shots * getDeterministicVal(seed + 9, 0.4, 0.65, 2));
          } else if (isMF) {
            p.shots = getDeterministicVal(seed + 8, 3, 12);
            p.shotsOnTarget = Math.round(p.shots * getDeterministicVal(seed + 9, 0.3, 0.5, 2));
          } else if (isDF) {
            p.shots = getDeterministicVal(seed + 8, 0, 4);
            p.shotsOnTarget = Math.round(p.shots * getDeterministicVal(seed + 9, 0.2, 0.5, 2));
          } else {
            p.shots = 0;
            p.shotsOnTarget = 0;
          }
          
          if (isMF) {
            p.keyPasses = getDeterministicVal(seed + 10, 6, 22);
            p.chancesCreated = Math.round(p.keyPasses * getDeterministicVal(seed + 11, 1.1, 1.5, 2));
          } else if (isFW) {
            p.keyPasses = getDeterministicVal(seed + 10, 3, 14);
            p.chancesCreated = Math.round(p.keyPasses * getDeterministicVal(seed + 11, 1.0, 1.4, 2));
          } else if (isDF) {
            p.keyPasses = getDeterministicVal(seed + 10, 1, 5);
            p.chancesCreated = Math.round(p.keyPasses * getDeterministicVal(seed + 11, 1.0, 1.3, 2));
          } else {
            p.keyPasses = 0;
            p.chancesCreated = 0;
          }
          
          if (isGK) p.passAccuracy = getDeterministicVal(seed + 12, 60, 78);
          else if (isDF) p.passAccuracy = getDeterministicVal(seed + 12, 85, 94);
          else if (isMF) p.passAccuracy = getDeterministicVal(seed + 12, 82, 92);
          else p.passAccuracy = getDeterministicVal(seed + 12, 70, 85);
          
          if (isFW) p.successfulDribbles = getDeterministicVal(seed + 13, 8, 28);
          else if (isMF) p.successfulDribbles = getDeterministicVal(seed + 13, 5, 18);
          else if (isDF) p.successfulDribbles = getDeterministicVal(seed + 13, 1, 6);
          else p.successfulDribbles = 0;
          
          if (isDF) {
            p.tackles = getDeterministicVal(seed + 14, 10, 26);
            p.interceptions = getDeterministicVal(seed + 15, 8, 22);
            p.clearances = getDeterministicVal(seed + 16, 15, 45);
          } else if (isMF) {
            p.tackles = getDeterministicVal(seed + 14, 6, 18);
            p.interceptions = getDeterministicVal(seed + 15, 5, 15);
            p.clearances = getDeterministicVal(seed + 16, 2, 10);
          } else if (isFW) {
            p.tackles = getDeterministicVal(seed + 14, 1, 5);
            p.interceptions = getDeterministicVal(seed + 15, 0, 4);
            p.clearances = getDeterministicVal(seed + 16, 0, 3);
          } else {
            p.tackles = 0;
            p.interceptions = 0;
            p.clearances = 0;
          }
          
          p.penaltiesScored = (p.goals > 2 && (seed % 7 === 0)) ? getDeterministicVal(seed + 17, 1, 2) : 0;
          p.penaltiesMissed = (p.penaltiesScored > 0 && (seed % 3 === 0)) ? 1 : 0;
          p.freeKickGoals = (p.goals > 1 && (seed % 11 === 0)) ? 1 : 0;
          p.ownGoals = (seed % 31 === 0) ? 1 : 0;
          
          p.yellowCards = getDeterministicVal(seed + 18, 0, 3);
          p.redCards = (seed % 29 === 0) ? 1 : 0;
          
          p.foulsCommitted = getDeterministicVal(seed + 19, 2, 14);
          p.foulsWon = getDeterministicVal(seed + 20, 2, 18);
          
          p.offsides = isFW ? getDeterministicVal(seed + 21, 2, 10) : (isMF ? getDeterministicVal(seed + 21, 0, 2) : 0);
          p.crossesCompleted = (isMF || isFW) ? getDeterministicVal(seed + 22, 2, 12) : 0;
          p.aerialDuelsWon = getDeterministicVal(seed + 23, 2, 24);
          p.possessionWon = getDeterministicVal(seed + 24, 10, 48);
          p.distanceCovered = getDeterministicVal(seed + 25, p.minutesPlayed * 0.10, p.minutesPlayed * 0.14, 1);
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

      function initAnalyticsTab() {
        populateTeamDropdown();
        
        document.getElementById('wc-analytics-search').value = '';
        document.getElementById('wc-analytics-tournament').value = 'wc2026';
        document.getElementById('wc-analytics-group').value = 'all';
        document.getElementById('wc-analytics-team').value = 'all';
        document.getElementById('wc-analytics-position').value = 'all';
        document.getElementById('wc-analytics-stage').value = 'all';
        
        filterAnalyticsData();
        setupCanvasInteraction();
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
        
        analyticsCurrentPage = 1;
        sortAnalyticsDataArray(analyticsSortCol, false);
        updateOverviewStats();
        updateAdvancedLeaderboards();
        drawAnalyticsChart();
        renderAnalyticsTable();
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

      function sortAnalyticsTable(colName) {
        sortAnalyticsDataArray(colName, true);
        renderAnalyticsTable();
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

      function renderAnalyticsTable() {
        const tbody = document.getElementById('wc-analytics-table-body');
        if (!tbody) return;
        
        const countLabel = document.getElementById('table-results-count');
        if (countLabel) countLabel.textContent = `Showing ${filteredPlayers.length} players`;
        
        const totalItems = filteredPlayers.length;
        const totalPages = Math.ceil(totalItems / analyticsPageSize) || 1;
        
        if (analyticsCurrentPage > totalPages) analyticsCurrentPage = totalPages;
        if (analyticsCurrentPage < 1) analyticsCurrentPage = 1;
        
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) paginationInfo.textContent = `Showing page ${analyticsCurrentPage} of ${totalPages}`;
        
        const prevBtn = document.getElementById('btn-pagination-prev');
        const nextBtn = document.getElementById('btn-pagination-next');
        if (prevBtn) prevBtn.disabled = (analyticsCurrentPage === 1);
        if (nextBtn) nextBtn.disabled = (analyticsCurrentPage === totalPages);
        
        const start = (analyticsCurrentPage - 1) * analyticsPageSize;
        const pageItems = filteredPlayers.slice(start, start + analyticsPageSize);
        
        tbody.innerHTML = '';
        
        if (pageItems.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="17" style="text-align:center;color:var(--text3);padding:2rem;">No players found matching current filters.</td>
            </tr>
          `;
          return;
        }
        
        pageItems.forEach((p, idx) => {
          const rank = start + idx + 1;
          const flag = getLeaderboardFlagImg(p.team);
          
          const tr = document.createElement('tr');
          tr.className = 'wc-table-row';
          tr.style.cursor = 'pointer';
          tr.onclick = () => openPlayerProfileModal(p.name);
          
          tr.innerHTML = `
            <td style="text-align:center;color:var(--text3);font-size:0.8rem;">${rank}</td>
            <td>
              <div style="display:flex;align-items:center;gap:0.4rem;font-weight:600;">
                ${flag} <span>${p.name}</span>
              </div>
            </td>
            <td style="font-size:0.8rem;color:var(--text2);">${p.team}</td>
            <td style="font-size:0.8rem;"><span class="wc-badge badge-${p.pos.toLowerCase()}">${p.pos}</span></td>
            <td style="text-align:center;font-weight:700;color:var(--gold);">${p.rating.toFixed(1)}</td>
            <td style="text-align:center;">${p.appearances}</td>
            <td style="text-align:center;color:var(--text2);font-size:0.8rem;">${p.minutesPlayed}</td>
            <td style="text-align:center;font-weight:700;color:var(--gold);">${p.goals}</td>
            <td style="text-align:center;font-weight:700;color:var(--gold);">${p.assists}</td>
            <td style="text-align:center;font-size:0.8rem;color:var(--text2);">${p.shots} (${p.shotsOnTarget})</td>
            <td style="text-align:center;">${p.keyPasses}</td>
            <td style="text-align:center;color:var(--text2);">${p.passAccuracy}%</td>
            <td style="text-align:center;">${p.successfulDribbles}</td>
            <td style="text-align:center;">${p.tackles}</td>
            <td style="text-align:center;color:var(--green);font-weight:600;">${p.cleanSheets}</td>
            <td style="text-align:center;color:var(--accent);">${p.saves}</td>
            <td style="text-align:center;">
              <span style="color:#facc15;">${p.yellowCards}🟨</span>
              ${p.redCards > 0 ? '<span style="color:#ef4444;margin-left:4px;">1🟥</span>' : ''}
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      function prevAnalyticsPage() {
        if (analyticsCurrentPage > 1) {
          analyticsCurrentPage--;
          renderAnalyticsTable();
        }
      }

      function nextAnalyticsPage() {
        const totalPages = Math.ceil(filteredPlayers.length / analyticsPageSize) || 1;
        if (analyticsCurrentPage < totalPages) {
          analyticsCurrentPage++;
          renderAnalyticsTable();
        }
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
        const marginRight = 25;
        const marginTop = 20;
        const marginBottom = 40;
        
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
                <div style="font-weight:700;color:var(--gold);margin-bottom:0.25rem">${hoveredPlayer.name}</div>
                <div style="font-size:0.7rem;color:var(--text3);margin-bottom:0.25rem">${hoveredPlayer.team} | ${hoveredPlayer.pos}</div>
                <div>${getMetricLabel(xMetric)}: <strong>${hoveredPlayer[xMetric]}</strong></div>
                <div>${getMetricLabel(yMetric)}: <strong>${hoveredPlayer[yMetric]}</strong></div>
              `;
            } else {
              tooltip.innerHTML = `
                <div style="font-weight:700;color:var(--gold);margin-bottom:0.25rem">${hoveredPlayer.team}</div>
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
      window.sortAnalyticsTable = sortAnalyticsTable;
      window.prevAnalyticsPage = prevAnalyticsPage;
      window.nextAnalyticsPage = nextAnalyticsPage;
      window.openPlayerProfileModal = openPlayerProfileModal;
      window.closePlayerProfileModal = closePlayerProfileModal;
      window.initAnalyticsTab = initAnalyticsTab;
      window.switchWCTab = switchWCTab;

      const bracketPredictor = new BracketPredictor();
      window.bracketPredictor = bracketPredictor;
      let bracketInitialized = false;
      function switchWCTab(tabId, btnElement) {
        document.querySelectorAll('.wc-tab-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.wc-tab').forEach(el => el.classList.remove('active'));
        const target = document.getElementById('wc-' + tabId);
        if (target) target.style.display = 'block';
        if (btnElement) btnElement.classList.add('active');
        if (tabId === 'dashboard') {
          renderGroupStandings();
          renderBestThirdPlacedTable();
        } else if (tabId === 'predictions') {
          renderGroupStandings();
          renderGroupPredictions();
          renderMatchPredictions();
          updateAwardsDisplay();
          updatePredictorProfile();
          renderBestThirdPlacedTable();
        } else if (tabId === 'bracket') {
          if (!bracketInitialized) {
            bracketPredictor.init();
            bracketInitialized = true;
          } else {
            // Force-refresh slots that still track group designations
            bracketPredictor.syncRound32Matchups(true);
            bracketPredictor.renderBracket();
            bracketPredictor.updateChampionDisplay();
          }
        } else if (tabId === 'analytics') {
          initAnalyticsTab();
        }
      }
