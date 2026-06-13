(function () {
  'use strict';

  var pollTimer = null;

  function resolveApiBaseUrl() {
    var isLocal = location.hostname === 'localhost'
      || location.hostname === '127.0.0.1'
      || location.protocol === 'file:';
    if (window.ENV && window.ENV.API_BASE_URL) return window.ENV.API_BASE_URL;
    if (isLocal) return 'http://localhost:8002';
    return 'https://footytrivia-api.onrender.com';
  }

  function teamName(team) {
    if (!team) return 'TBD';
    return team.shortName || team.tla || team.name || 'TBD';
  }

  function teamCrest(team) {
    return team && team.crest ? team.crest : '';
  }

  function homeScore(match) {
    var s = match.score || {};
    if (s.fullTime && s.fullTime.home != null) return s.fullTime.home;
    if (s.halfTime && s.halfTime.home != null) return s.halfTime.home;
    return 0;
  }

  function awayScore(match) {
    var s = match.score || {};
    if (s.fullTime && s.fullTime.away != null) return s.fullTime.away;
    if (s.halfTime && s.halfTime.away != null) return s.halfTime.away;
    return 0;
  }

  function groupLabel(match) {
    if (match.group) return 'Group ' + match.group;
    if (match.competition && match.competition.name) return match.competition.name;
    return '';
  }

  function attachCrestFallback(img, name) {
    img.onerror = function () {
      var span = document.createElement('span');
      span.className = 'team-initials';
      span.textContent = (name || '???').slice(0, 3).toUpperCase();
      img.replaceWith(span);
    };
  }

  function createCrest(team) {
    var name = teamName(team);
    var crest = teamCrest(team);
    if (!crest) {
      var initials = document.createElement('span');
      initials.className = 'team-initials';
      initials.textContent = name.slice(0, 3).toUpperCase();
      return initials;
    }
    var img = document.createElement('img');
    img.className = 'team-crest';
    img.src = crest;
    img.alt = name;
    img.loading = 'lazy';
    attachCrestFallback(img, name);
    return img;
  }

  function createTeamBlock(team, align) {
    var block = document.createElement('div');
    block.className = 'wc-team-block' + (align === 'away' ? ' wc-team-away' : '');
    block.appendChild(createCrest(team));
    var nameEl = document.createElement('span');
    nameEl.className = 'wc-team-name';
    nameEl.textContent = teamName(team);
    block.appendChild(nameEl);
    return block;
  }

  function formatLocalTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function formatLocalDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    var day = d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
    var time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return day + ' · ' + time;
  }

  function formatMatchDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function buildCard(match, variant) {
    var card = document.createElement('div');
    card.className = 'wc-match-card' + (variant ? ' ' + variant : '');

    var home = match.homeTeam || {};
    var away = match.awayTeam || {};

    var row = document.createElement('div');
    row.className = 'wc-match-row';
    row.appendChild(createTeamBlock(home, 'home'));

    var center = document.createElement('div');
    center.className = 'wc-match-center';

    if (variant === 'live') {
      var score = document.createElement('div');
      score.className = 'scoreline';
      score.textContent = homeScore(match) + ' : ' + awayScore(match);
      center.appendChild(score);
      var badge = document.createElement('span');
      badge.className = 'live-badge';
      badge.textContent = '● LIVE';
      center.appendChild(badge);
      if (match.minute != null) {
        var minute = document.createElement('span');
        minute.className = 'kickoff-time';
        minute.textContent = match.minute + "'";
        center.appendChild(minute);
      }
    } else if (variant === 'fixture') {
      var kick = document.createElement('div');
      kick.className = 'kickoff-time';
      kick.textContent = formatLocalTime(match.utcDate);
      center.appendChild(kick);
      var grp = groupLabel(match);
      if (grp) {
        var gl = document.createElement('div');
        gl.className = 'wc-group-label';
        gl.textContent = grp;
        center.appendChild(gl);
      }
    } else if (variant === 'result' || variant === 'recent') {
      var finalScore = document.createElement('div');
      finalScore.className = 'scoreline';
      finalScore.textContent = homeScore(match) + ' : ' + awayScore(match);
      center.appendChild(finalScore);
      var ft = document.createElement('span');
      ft.className = 'wc-ft-label';
      ft.textContent = 'FT';
      center.appendChild(ft);
      if (variant === 'recent') {
        var md = document.createElement('span');
        md.className = 'kickoff-time';
        md.textContent = formatMatchDate(match.utcDate);
        center.appendChild(md);
      }
    } else if (variant === 'upcoming') {
      var dt = document.createElement('div');
      dt.className = 'kickoff-time';
      dt.textContent = formatLocalDateTime(match.utcDate);
      center.appendChild(dt);
      var grp2 = groupLabel(match);
      if (grp2) {
        var gl2 = document.createElement('div');
        gl2.className = 'wc-group-label';
        gl2.textContent = grp2;
        center.appendChild(gl2);
      }
    }

    row.appendChild(center);
    row.appendChild(createTeamBlock(away, 'away'));
    card.appendChild(row);

    // Goal scorers display
    if (match.goals && match.goals.length > 0) {
      var goalsEl = document.createElement('div');
      goalsEl.className = 'wc-match-goals';

      var homeGoalsEl = document.createElement('div');
      homeGoalsEl.className = 'home-goals';

      var awayGoalsEl = document.createElement('div');
      awayGoalsEl.className = 'away-goals';

      match.goals.forEach(function (g) {
        var item = document.createElement('div');
        item.className = 'wc-goal-item';
        item.innerHTML = '⚽ ' + g.scorer + ' (' + g.minute + "')";
        if (g.team === 'home') {
          homeGoalsEl.appendChild(item);
        } else if (g.team === 'away') {
          awayGoalsEl.appendChild(item);
        }
      });

      goalsEl.appendChild(homeGoalsEl);
      goalsEl.appendChild(awayGoalsEl);
      card.appendChild(goalsEl);
    }

    return card;
  }

  function renderSectionLabel(text) {
    var label = document.createElement('div');
    label.className = 'wc-section-label';
    label.textContent = text;
    return label;
  }

  function renderTodayMode(container, matches) {
    var live = matches.filter(function (m) {
      return m.status === 'IN_PLAY' || m.status === 'PAUSED';
    });
    var fixtures = matches.filter(function (m) {
      return m.status === 'SCHEDULED' || m.status === 'TIMED';
    });
    var finished = matches.filter(function (m) {
      return m.status === 'FINISHED';
    });

    if (live.length) {
      container.appendChild(renderSectionLabel('🔴 LIVE NOW'));
      live.forEach(function (m) { container.appendChild(buildCard(m, 'live')); });
    }
    if (fixtures.length) {
      container.appendChild(renderSectionLabel("📅 TODAY'S FIXTURES"));
      fixtures.forEach(function (m) { container.appendChild(buildCard(m, 'fixture')); });
    }
    if (finished.length) {
      container.appendChild(renderSectionLabel('✅ COMPLETED'));
      finished.forEach(function (m) { container.appendChild(buildCard(m, 'result')); });
    }
  }

  function renderOffSeason(container) {
    var wrap = document.createElement('div');
    wrap.className = 'wc-offseason';
    wrap.innerHTML =
      '<span class="wc-trophy">🏆</span>' +
      '<p>FIFA World Cup 2026</p>' +
      '<p class="wc-dates">11 Jun – 19 Jul 2026 · USA · Canada · Mexico</p>';
    container.appendChild(wrap);
  }

  function showSkeleton(container) {
    if (container.dataset.loaded === '1') return;
    container.innerHTML = '<div class="wc-skeleton">Loading World Cup matches...</div>';
  }

  function renderMatches(container, data) {
    container.innerHTML = '';
    container.dataset.loaded = '1';

    var header = document.createElement('div');
    header.className = 'wc-header';
    var title = document.createElement('h3');
    title.className = 'wc-header-title';
    title.textContent = data.label || 'World Cup 2026';
    header.appendChild(title);
    if (data.stale) {
      var stale = document.createElement('span');
      stale.className = 'wc-stale-badge';
      stale.textContent = 'Cached';
      header.appendChild(stale);
    }
    container.appendChild(header);

    var mode = data.mode || 'off_season';
    var matches = data.matches || [];

    if (mode === 'today') {
      if (matches.length) renderTodayMode(container, matches);
      else renderOffSeason(container);
    } else if (mode === 'upcoming') {
      container.appendChild(renderSectionLabel('Next Up'));
      matches.forEach(function (m) { container.appendChild(buildCard(m, 'upcoming')); });
      if (!matches.length) renderOffSeason(container);
    } else if (mode === 'recent') {
      container.appendChild(renderSectionLabel('Latest Results'));
      matches.forEach(function (m) { container.appendChild(buildCard(m, 'recent')); });
      if (!matches.length) renderOffSeason(container);
    } else {
      renderOffSeason(container);
    }
  }

  function unlockMatchdayTab() {
    var tab = document.getElementById('wc-matchday');
    if (tab) tab.classList.remove('wc-matchday-locked');
    var overlay = document.getElementById('wc-matchday-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  async function fetchAndRender(container) {
    showSkeleton(container);
    try {
      var res = await fetch(resolveApiBaseUrl() + '/api/wc/matches', { credentials: 'omit' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      window.WC_TODAY_MATCHES = data.matches || [];
      renderMatches(container, data);
      unlockMatchdayTab();
    } catch (err) {
      container.innerHTML = '';
      renderOffSeason(container);
      var retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'wc-retry-btn';
      retry.textContent = 'Retry';
      retry.addEventListener('click', function () { fetchAndRender(container); });
      container.appendChild(retry);
    }
  }

  window.initWCMatches = function initWCMatches(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    fetchAndRender(container);
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(function () {
      fetchAndRender(container);
    }, 60000);
  };
})();
