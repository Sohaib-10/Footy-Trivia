(function () {
  'use strict';

  // Avoid injecting multiple times
  if (document.getElementById('live-scores-extension-widget')) return;

  const API_URL = 'https://footytrivia-api.onrender.com/api/wc/matches';
  let widget = null;
  let timer = null;
  let expanded = false;

  // Check if enabled
  chrome.storage.local.get({ enabled: true }, (result) => {
    if (result.enabled) {
      createWidget();
    }
  });

  // Listen for messages from popup to toggle widget
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleWidget') {
      if (request.enabled) {
        createWidget();
      } else {
        removeWidget();
      }
    }
  });

  function createWidget() {
    if (document.getElementById('live-scores-extension-widget')) return;

    widget = document.createElement('div');
    widget.id = 'live-scores-extension-widget';
    widget.className = 'ft-extension-widget';

    // Header bar (always visible, shows primary match)
    const header = document.createElement('div');
    header.className = 'ft-extension-header';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ft-extension-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Close Live Scores';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      removeWidget();
    };

    // Primary match display
    const body = document.createElement('div');
    body.className = 'ft-extension-body';

    // Expand toggle button
    const expandBtn = document.createElement('button');
    expandBtn.className = 'ft-extension-expand';
    expandBtn.innerHTML = '▼';
    expandBtn.title = 'Show all matches';
    expandBtn.onclick = (e) => {
      e.stopPropagation();
      toggleExpand();
    };

    header.appendChild(body);
    header.appendChild(expandBtn);
    widget.appendChild(closeBtn);
    widget.appendChild(header);

    // Expanded panel (all matches)
    const panel = document.createElement('div');
    panel.className = 'ft-extension-panel';
    panel.style.display = 'none';
    widget.appendChild(panel);

    document.body.appendChild(widget);
    makeDraggable(widget, header);

    // Initial Fetch & Poll
    fetchScores();
    timer = setInterval(fetchScores, 15000);
  }

  function removeWidget() {
    const el = document.getElementById('live-scores-extension-widget');
    if (el) el.remove();
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    expanded = false;
  }

  function toggleExpand() {
    const el = document.getElementById('live-scores-extension-widget');
    if (!el) return;
    const panel = el.querySelector('.ft-extension-panel');
    const expandBtn = el.querySelector('.ft-extension-expand');
    if (!panel) return;
    expanded = !expanded;
    panel.style.display = expanded ? 'block' : 'none';
    if (expandBtn) expandBtn.innerHTML = expanded ? '▲' : '▼';
    el.classList.toggle('ft-expanded', expanded);
  }

  function getTeamDisplay(team) {
    if (!team) return { tla: 'TBD', crest: '' };
    const tla = team.tla || (team.shortName || team.name || 'TBD').slice(0, 3).toUpperCase();
    const crest = team.crest || '';
    return { tla, crest };
  }

  function renderCrest(team) {
    const { tla, crest } = getTeamDisplay(team);
    if (crest) {
      return `<img src="${crest}" class="ft-ext-crest" onerror="this.outerHTML='<span class=\\'ft-ext-initials\\'>${tla}</span>'">`;
    }
    return `<span class="ft-ext-initials">${tla}</span>`;
  }

  function renderMatchRow(match, type) {
    const home = getTeamDisplay(match.homeTeam);
    const away = getTeamDisplay(match.awayTeam);

    const homeScore = match.score?.fullTime?.home ?? 0;
    const awayScore = match.score?.fullTime?.away ?? 0;

    let centerHtml = '';
    if (type === 'live') {
      const minuteText = match.minute != null ? match.minute + "'" : (match.status === 'PAUSED' ? 'HT' : 'LIVE');
      centerHtml = `
        <div class="ft-ext-score">${homeScore} - ${awayScore}</div>
        <div class="ft-ext-minute"><span class="ft-ext-live-dot"></span>${minuteText}</div>
      `;
    } else if (type === 'fixture') {
      const time = match.utcDate ? new Date(match.utcDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'VS';
      centerHtml = `
        <div class="ft-ext-time">${time}</div>
      `;
    } else if (type === 'completed') {
      centerHtml = `
        <div class="ft-ext-score stale-score">${homeScore} - ${awayScore}</div>
        <div class="ft-ext-ft-label">FT</div>
      `;
    }

    return `
      <div class="ft-ext-match-row ft-ext-match-${type}">
        <div class="ft-ext-team-left">
          ${renderCrest(match.homeTeam)}
          <span class="ft-ext-team-name">${home.tla}</span>
        </div>
        <div class="ft-ext-center">
          ${centerHtml}
        </div>
        <div class="ft-ext-team-right">
          <span class="ft-ext-team-name">${away.tla}</span>
          ${renderCrest(match.awayTeam)}
        </div>
      </div>
    `;
  }

  async function fetchScores() {
    const el = document.getElementById('live-scores-extension-widget');
    if (!el) return;
    const body = el.querySelector('.ft-extension-body');
    const panel = el.querySelector('.ft-extension-panel');
    if (!body) return;

    try {
      const res = await fetch(API_URL, { credentials: 'omit' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const matches = data.matches || [];

      const live = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
      const fixtures = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED');
      const completed = matches.filter(m => m.status === 'FINISHED');

      // === Compact header: show primary match ===
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

      if (!activeMatch) {
        body.innerHTML = `
          <div class="ft-extension-content ft-extension-offseason">
            <span class="ft-ext-trophy">🏆</span>
            <span class="ft-ext-title">FIFA WORLD CUP</span>
          </div>
        `;
      } else {
        body.innerHTML = `<div class="ft-extension-content">${renderMatchRow(activeMatch, matchType)}</div>`;
      }

      // Show match count badge if there are more matches
      const totalMatches = live.length + fixtures.length + completed.length;
      const expandBtn = el.querySelector('.ft-extension-expand');
      if (expandBtn && totalMatches > 1) {
        expandBtn.style.display = 'flex';
        expandBtn.title = `Show all ${totalMatches} matches`;
      } else if (expandBtn) {
        expandBtn.style.display = totalMatches > 0 ? 'flex' : 'none';
      }

      // === Expanded panel: all matches ===
      if (panel) {
        let panelHtml = '';

        if (live.length > 0) {
          panelHtml += `<div class="ft-ext-section-label"><span class="ft-ext-section-dot live"></span>LIVE</div>`;
          live.forEach(m => { panelHtml += renderMatchRow(m, 'live'); });
        }
        if (fixtures.length > 0) {
          panelHtml += `<div class="ft-ext-section-label">📅 UPCOMING</div>`;
          fixtures.forEach(m => { panelHtml += renderMatchRow(m, 'fixture'); });
        }
        if (completed.length > 0) {
          panelHtml += `<div class="ft-ext-section-label">✅ COMPLETED</div>`;
          completed.forEach(m => { panelHtml += renderMatchRow(m, 'completed'); });
        }

        if (!panelHtml) {
          panelHtml = `<div class="ft-ext-empty">No matches today</div>`;
        }

        panel.innerHTML = panelHtml;
      }
    } catch (e) {
      console.error('Failed to fetch live scores in content script:', e);
    }
  }

  function makeDraggable(el, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragTarget = handle || el;
    dragTarget.onmousedown = dragMouseDown;
    dragTarget.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
      e = e || window.event;
      if (e.target.closest('.ft-extension-close') || e.target.closest('.ft-extension-expand')) return;
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
      if (e.target.closest('.ft-extension-close') || e.target.closest('.ft-extension-expand')) return;
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

})();
