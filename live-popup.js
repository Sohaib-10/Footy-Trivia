(function () {
  'use strict';

  function resolveApiBaseUrl() {
    const isLocal = location.hostname === 'localhost'
      || location.hostname === '127.0.0.1'
      || location.protocol === 'file:';
    if (window.ENV && window.ENV.API_BASE_URL) return window.ENV.API_BASE_URL;
    if (isLocal) return 'http://127.0.0.1:8000';
    return 'https://footytrivia-api.onrender.com';
  }

  const API_URL = resolveApiBaseUrl() + '/api/wc/matches';
  let pollInterval = null;
  let isFetching = false;

  const matchesContainer = document.getElementById('matches-container');
  const refreshBtn = document.getElementById('refresh-btn');
  const statusBanner = document.getElementById('status-banner');
  const statusText = document.getElementById('status-text');

  // Helper: Get clean team name
  function getTeamName(team) {
    if (!team) return 'TBD';
    return team.shortName || team.tla || team.name || 'TBD';
  }

  // Helper: Create crest image or fallback initials
  function createCrestElement(team) {
    const name = getTeamName(team);
    if (!team || !team.crest) {
      const initials = document.createElement('span');
      initials.className = 'team-initials';
      initials.textContent = name.slice(0, 3).toUpperCase();
      return initials;
    }
    const img = document.createElement('img');
    img.className = 'team-crest';
    img.src = team.crest;
    img.alt = name;
    img.loading = 'lazy';
    img.onerror = () => {
      const initials = document.createElement('span');
      initials.className = 'team-initials';
      initials.textContent = name.slice(0, 3).toUpperCase();
      img.replaceWith(initials);
    };
    return img;
  }

  // Helper: Create a team visual block
  function createTeamBlock(team, isAway = false) {
    const block = document.createElement('div');
    block.className = 'wc-team-block' + (isAway ? ' wc-team-away' : '');
    block.appendChild(createCrestElement(team));

    const nameEl = document.createElement('span');
    nameEl.className = 'wc-team-name';
    nameEl.textContent = getTeamName(team);
    block.appendChild(nameEl);

    return block;
  }

  // Helper: Date & Time Formatting
  function formatLocalTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  // Helper: Format date and time
  function formatLocalDateTime(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    const day = d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
    const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `${day} · ${time}`;
  }

  // Helper: Render Section Title
  function createSectionLabel(text) {
    const label = document.createElement('div');
    label.className = 'wc-section-label';
    label.textContent = text;
    return label;
  }

  // Helper: Build a beautiful Match Card
  function buildMatchCard(match, type) {
    const card = document.createElement('div');
    card.className = 'wc-match-card';

    const home = match.homeTeam || {};
    const away = match.awayTeam || {};
    const score = match.score || {};

    const homeScoreVal = score.fullTime && score.fullTime.home != null ? score.fullTime.home : 0;
    const awayScoreVal = score.fullTime && score.fullTime.away != null ? score.fullTime.away : 0;

    const row = document.createElement('div');
    row.className = 'wc-match-row';
    row.appendChild(createTeamBlock(home, false));

    const center = document.createElement('div');
    center.className = 'wc-match-center';

    if (type === 'live') {
      const scoreline = document.createElement('div');
      scoreline.className = 'scoreline';
      scoreline.textContent = `${homeScoreVal} : ${awayScoreVal}`;
      center.appendChild(scoreline);

      const liveBadge = document.createElement('span');
      liveBadge.className = 'live-badge';
      liveBadge.textContent = 'LIVE';
      center.appendChild(liveBadge);

      if (match.minute != null) {
        const minEl = document.createElement('span');
        minEl.className = 'kickoff-time';
        minEl.style.color = 'var(--success)';
        minEl.textContent = `${match.minute}'`;
        center.appendChild(minEl);
      } else if (match.status === 'PAUSED') {
        const htEl = document.createElement('span');
        htEl.className = 'kickoff-time';
        htEl.textContent = 'HT';
        center.appendChild(htEl);
      }
    } else if (type === 'fixture') {
      const timeEl = document.createElement('div');
      timeEl.className = 'kickoff-time';
      timeEl.textContent = formatLocalTime(match.utcDate);
      center.appendChild(timeEl);

      const grp = match.group ? `Group ${match.group.replace(/^GROUP_/i, '')}` : '';
      if (grp) {
        const grpEl = document.createElement('div');
        grpEl.className = 'wc-group-label';
        grpEl.textContent = grp;
        center.appendChild(grpEl);
      }
    } else if (type === 'result') {
      const scoreline = document.createElement('div');
      scoreline.className = 'scoreline';
      scoreline.textContent = `${homeScoreVal} : ${awayScoreVal}`;
      center.appendChild(scoreline);

      const ftLabel = document.createElement('span');
      ftLabel.className = 'wc-ft-label';
      ftLabel.textContent = 'FT';
      center.appendChild(ftLabel);
    } else if (type === 'upcoming') {
      const datetimeEl = document.createElement('div');
      datetimeEl.className = 'kickoff-time';
      datetimeEl.textContent = formatLocalDateTime(match.utcDate);
      center.appendChild(datetimeEl);

      const grp = match.group ? `Group ${match.group.replace(/^GROUP_/i, '')}` : '';
      if (grp) {
        const grpEl = document.createElement('div');
        grpEl.className = 'wc-group-label';
        grpEl.textContent = grp;
        center.appendChild(grpEl);
      }
    }

    row.appendChild(center);
    row.appendChild(createTeamBlock(away, true));
    card.appendChild(row);

    // Goal Scorers List (collapsible or neat list)
    if (match.goals && match.goals.length > 0) {
      const goalsWrapper = document.createElement('div');
      goalsWrapper.className = 'wc-match-goals';

      const homeGoals = document.createElement('div');
      homeGoals.className = 'home-goals';

      const awayGoals = document.createElement('div');
      awayGoals.className = 'away-goals';

      match.goals.forEach(goal => {
        const goalEl = document.createElement('div');
        goalEl.className = 'wc-goal-item';
        goalEl.textContent = `⚽ ${goal.scorer} (${goal.minute}')`;
        if (goal.team === 'home') {
          homeGoals.appendChild(goalEl);
        } else {
          awayGoals.appendChild(goalEl);
        }
      });

      goalsWrapper.appendChild(homeGoals);
      goalsWrapper.appendChild(awayGoals);
      card.appendChild(goalsWrapper);
    }

    return card;
  }

  // Render Off Season Card
  function renderOffSeason() {
    const wrap = document.createElement('div');
    wrap.className = 'wc-offseason';
    wrap.innerHTML = `
      <span class="wc-trophy">🏆</span>
      <p>FIFA World Cup 2026</p>
      <p class="wc-dates">11 Jun – 19 Jul 2026 · USA · Canada · Mexico</p>
    `;
    matchesContainer.appendChild(wrap);
  }

  // Main Render Logic
  function render(data) {
    matchesContainer.innerHTML = '';

    const mode = data.mode || 'off_season';
    const matches = data.matches || [];

    if (mode === 'today') {
      const live = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
      const fixtures = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
      const completed = matches.filter(m => {
        if (m.status !== 'FINISHED') return false;
        if (m.utcDate) {
          const kickoff = new Date(m.utcDate);
          // Only show matches finished in the last 8 hours
          const cutoff = new Date(kickoff.getTime() + 8 * 60 * 60 * 1000);
          return new Date() < cutoff;
        }
        return true;
      });

      let hasItems = false;
      if (live.length > 0) {
        matchesContainer.appendChild(createSectionLabel('🔴 LIVE NOW'));
        live.forEach(m => matchesContainer.appendChild(buildMatchCard(m, 'live')));
        hasItems = true;
      }
      if (fixtures.length > 0) {
        matchesContainer.appendChild(createSectionLabel("📅 TODAY'S FIXTURES"));
        fixtures.forEach(m => matchesContainer.appendChild(buildMatchCard(m, 'fixture')));
        hasItems = true;
      }
      if (completed.length > 0) {
        matchesContainer.appendChild(createSectionLabel('✅ COMPLETED'));
        completed.forEach(m => matchesContainer.appendChild(buildMatchCard(m, 'result')));
        hasItems = true;
      }

      if (!hasItems) {
        renderOffSeason();
      }
    } else if (mode === 'upcoming') {
      if (matches.length > 0) {
        matchesContainer.appendChild(createSectionLabel('Next Up'));
        matches.forEach(m => matchesContainer.appendChild(buildMatchCard(m, 'upcoming')));
      } else {
        renderOffSeason();
      }
    } else if (mode === 'recent') {
      if (matches.length > 0) {
        matchesContainer.appendChild(createSectionLabel('Latest Results'));
        matches.forEach(m => matchesContainer.appendChild(buildMatchCard(m, 'result')));
      } else {
        renderOffSeason();
      }
    } else {
      renderOffSeason();
    }
  }

  // Update Status Dot & Banner text
  function setStatus(text, type = 'success') {
    statusBanner.classList.remove('hidden');
    statusText.textContent = text;
    const dot = statusBanner.querySelector('.status-dot');
    dot.className = 'status-dot';
    if (type === 'stale') dot.classList.add('stale');
    if (type === 'error') dot.classList.add('error');
  }

  // Fetch from Website API
  async function fetchScores(isManual = false) {
    if (isFetching) return;
    isFetching = true;

    // Start spin animation
    const refreshIcon = refreshBtn.querySelector('svg');
    refreshIcon.classList.add('spinning');

    try {
      const response = await fetch(API_URL, { credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      render(data);

      if (data.stale) {
        setStatus('Showing cached matches', 'stale');
      } else {
        setStatus(`Updated at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`, 'success');
      }

      // Check if there are active live matches to speed up polling
      const hasLive = (data.matches || []).some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
      setupAutoPolling(hasLive ? 30000 : 120000);

    } catch (error) {
      console.error('Error fetching scores:', error);
      setStatus('Server warming up. Retrying...', 'error');
      
      // If error occurs, keep skeleton if container is empty
      if (matchesContainer.children.length === 0 || matchesContainer.querySelector('.skeleton-loader')) {
        matchesContainer.innerHTML = `
          <div class="wc-offseason" style="padding: 30px 16px;">
            <span style="font-size: 2rem; animation: spin 4s linear infinite; display: inline-block; margin-bottom: 8px;">⏳</span>
            <p style="font-size: 0.95rem; font-weight: 700;">Connection Issue</p>
            <p class="wc-dates" style="font-size: 0.76rem; max-width: 250px; line-height: 1.4;">
              Unable to connect to the backend server. We are retrying automatically.
            </p>
          </div>
        `;
      }
      setupAutoPolling(10000); // Retry in 10s on error
    } finally {
      isFetching = false;
      // Stop spin animation
      setTimeout(() => {
        refreshIcon.classList.remove('spinning');
      }, 500);
    }
  }

  // Setup/Reset Polling Timer
  function setupAutoPolling(ms) {
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    pollInterval = setInterval(() => {
      fetchScores(false);
    }, ms);
  }

  // Event Listeners
  refreshBtn.addEventListener('click', () => {
    fetchScores(true);
  });

  // Initial load
  fetchScores(false);
})();
