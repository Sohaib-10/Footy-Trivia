(function () {
  'use strict';

  // Avoid injecting multiple times
  if (document.getElementById('live-scores-extension-widget')) return;

  const API_URL = 'https://footytrivia-api.onrender.com/api/wc/matches';
  let widget = null;
  let timer = null;

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

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ft-extension-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Close Live Scores';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      removeWidget();
    };
    widget.appendChild(closeBtn);

    // Body
    const body = document.createElement('div');
    body.className = 'ft-extension-body';
    widget.appendChild(body);

    document.body.appendChild(widget);
    makeDraggable(widget);

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
  }

  async function fetchScores() {
    const el = document.getElementById('live-scores-extension-widget');
    if (!el) return;
    const body = el.querySelector('.ft-extension-body');
    if (!body) return;

    try {
      const res = await fetch(API_URL, { credentials: 'omit' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const matches = data.matches || [];
      
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
          <div class="ft-extension-content ft-extension-offseason">
            <span class="ft-ext-trophy">🏆</span>
            <span class="ft-ext-title">FIFA WORLD CUP</span>
          </div>
        `;
      } else {
        const homeName = activeMatch.homeTeam.tla || (activeMatch.homeTeam.shortName || activeMatch.homeTeam.name || 'TBD').slice(0,3).toUpperCase();
        const awayName = activeMatch.awayTeam.tla || (activeMatch.awayTeam.shortName || activeMatch.awayTeam.name || 'TBD').slice(0,3).toUpperCase();
        
        const homeScoreVal = activeMatch.score.fullTime && activeMatch.score.fullTime.home != null ? activeMatch.score.fullTime.home : 0;
        const awayScoreVal = activeMatch.score.fullTime && activeMatch.score.fullTime.away != null ? activeMatch.score.fullTime.away : 0;
        
        const homeCrest = activeMatch.homeTeam.crest ? `<img src="${activeMatch.homeTeam.crest}" class="ft-ext-crest">` : `<span class="ft-ext-initials">${homeName}</span>`;
        const awayCrest = activeMatch.awayTeam.crest ? `<img src="${activeMatch.awayTeam.crest}" class="ft-ext-crest">` : `<span class="ft-ext-initials">${awayName}</span>`;
        
        let centerHtml = '';
        if (matchType === 'live') {
          centerHtml = `
            <div class="ft-ext-score">${homeScoreVal} - ${awayScoreVal}</div>
            <div class="ft-ext-minute">
              <span class="ft-ext-live-dot"></span>
              ${activeMatch.minute != null ? activeMatch.minute + "'" : (activeMatch.status === 'PAUSED' ? 'HT' : 'LIVE')}
            </div>
          `;
        } else if (matchType === 'fixture') {
          const time = activeMatch.utcDate ? new Date(activeMatch.utcDate).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'VS';
          centerHtml = `
            <div class="ft-ext-fixture-label">TODAY</div>
            <div class="ft-ext-time">${time}</div>
          `;
        } else if (matchType === 'completed') {
          centerHtml = `
            <div class="ft-ext-score stale-score">${homeScoreVal} - ${awayScoreVal}</div>
            <div class="ft-ext-ft-label">FT</div>
          `;
        }

        html = `
          <div class="ft-extension-content">
            <div class="ft-ext-team-left">
              ${homeCrest}
              <span class="ft-ext-team-name">${homeName}</span>
            </div>
            <div class="ft-ext-center">
              ${centerHtml}
            </div>
            <div class="ft-ext-team-right">
              <span class="ft-ext-team-name">${awayName}</span>
              ${awayCrest}
            </div>
          </div>
        `;
      }
      body.innerHTML = html;
    } catch (e) {
      console.error('Failed to fetch live scores in content script:', e);
    }
  }

  function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;
    el.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
      e = e || window.event;
      if (e.target.closest('.ft-extension-close')) return;
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
      if (e.target.closest('.ft-extension-close')) return;
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
