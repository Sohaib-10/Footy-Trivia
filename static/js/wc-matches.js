(function () {
  'use strict';

  var pollTimer = null;
  var retryTimer = null;

  function resolveApiBaseUrl() {
    var isLocal = location.hostname === 'localhost'
      || location.hostname === '127.0.0.1'
      || location.protocol === 'file:';
    if (window.ENV && window.ENV.API_BASE_URL) return window.ENV.API_BASE_URL;
    if (isLocal) return 'http://127.0.0.1:8002';
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
    if (match.group) {
      var g = match.group.replace(/^GROUP_/i, '');
      return 'Group ' + g;
    }
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
      if (m.status !== 'FINISHED') return false;
      if (m.utcDate) {
        var kickoff = new Date(m.utcDate);
        var cutoff = new Date(kickoff.getTime() + 8 * 60 * 60 * 1000);
        if (new Date() > cutoff) return false;
      }
      return true;
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

  function getVenueForGroup(group) {
    var venues = {
      'A': 'Estadio Azteca, Mexico City',
      'B': 'BC Place, Vancouver',
      'C': 'MetLife Stadium, New York/New Jersey',
      'D': 'SoFi Stadium, Los Angeles',
      'E': 'Mercedes-Benz Stadium, Atlanta',
      'F': 'Gillette Stadium, Boston',
      'G': 'Hard Rock Stadium, Miami',
      'H': 'AT&T Stadium, Dallas',
      'I': 'NRG Stadium, Houston',
      'J': 'Arrowhead Stadium, Kansas City',
      'K': 'Lincoln Financial Field, Philadelphia',
      'L': 'Lumen Field, Seattle'
    };
    return venues[group] || 'FIFA World Cup Stadium';
  }

  function updateLiveMatchCenter(matches) {
    var liveMatchCard = document.getElementById('live-match-card');
    var noMatchPlaceholder = document.getElementById('no-match-placeholder');
    var matchdayContent = document.querySelector('.wc-matchday-content');
    
    if (!liveMatchCard || !noMatchPlaceholder) return;
    
    var liveMatches = (matches || []).filter(function (m) {
      return m.status === 'IN_PLAY' || m.status === 'PAUSED';
    });
    var finishedMatches = (matches || []).filter(function (m) {
      if (m.status !== 'FINISHED') return false;
      if (m.utcDate) {
        var kickoff = new Date(m.utcDate);
        var cutoff = new Date(kickoff.getTime() + 8 * 60 * 60 * 1000);
        if (new Date() > cutoff) return false;
      }
      return true;
    });
    var scheduledMatches = (matches || []).filter(function (m) {
      return m.status === 'SCHEDULED' || m.status === 'TIMED';
    });
    
    var activeMatch = null;
    if (liveMatches.length > 0) {
      activeMatch = liveMatches[0];
    } else if (scheduledMatches.length > 0) {
      activeMatch = scheduledMatches[0];
    } else if (finishedMatches.length > 0) {
      activeMatch = finishedMatches[finishedMatches.length - 1];
    }
    
    if (!activeMatch) {
      if (matchdayContent) matchdayContent.style.display = 'none';
      liveMatchCard.style.display = 'none';
      noMatchPlaceholder.style.display = 'block';
      
      var liveIndicator = document.getElementById('live-indicator');
      var ftIndicator = document.getElementById('ft-indicator');
      if (liveIndicator) liveIndicator.style.display = 'none';
      if (ftIndicator) ftIndicator.style.display = 'none';
      return;
    }
    
    // Ensure the container itself is visible
    if (matchdayContent) matchdayContent.style.display = 'block';
    
    liveMatchCard.style.display = 'block';
    noMatchPlaceholder.style.display = 'none';
    
    var homeT = activeMatch.homeTeam || {};
    var awayT = activeMatch.awayTeam || {};
    
    var homeImg = document.getElementById('home-team-flag');
    var homeNameEl = document.getElementById('home-team-name');
    var awayImg = document.getElementById('away-team-flag');
    var awayNameEl = document.getElementById('away-team-name');
    
    if (homeImg) {
      homeImg.src = teamCrest(homeT);
      homeImg.alt = teamName(homeT);
    }
    if (homeNameEl) homeNameEl.textContent = teamName(homeT);
    
    if (awayImg) {
      awayImg.src = teamCrest(awayT);
      awayImg.alt = teamName(awayT);
    }
    if (awayNameEl) awayNameEl.textContent = teamName(awayT);
    
    var homeScoreEl = document.getElementById('home-score');
    var awayScoreEl = document.getElementById('away-score');
    if (homeScoreEl) homeScoreEl.textContent = homeScore(activeMatch);
    if (awayScoreEl) awayScoreEl.textContent = awayScore(activeMatch);
    
    var matchMinuteEl = document.getElementById('match-minute');
    var liveIndicator = document.getElementById('live-indicator');
    var ftIndicator = document.getElementById('ft-indicator');
    
    if (activeMatch.status === 'IN_PLAY') {
      if (liveIndicator) liveIndicator.style.display = 'flex';
      if (ftIndicator) ftIndicator.style.display = 'none';
      if (matchMinuteEl) {
        matchMinuteEl.style.display = 'block';
        matchMinuteEl.style.color = 'var(--success)';
        matchMinuteEl.textContent = activeMatch.minute != null ? activeMatch.minute + "'" : 'LIVE';
      }
    } else if (activeMatch.status === 'PAUSED') {
      if (liveIndicator) liveIndicator.style.display = 'flex';
      if (ftIndicator) ftIndicator.style.display = 'none';
      if (matchMinuteEl) {
        matchMinuteEl.style.display = 'block';
        matchMinuteEl.style.color = 'var(--text2)';
        matchMinuteEl.textContent = 'HT';
      }
    } else if (activeMatch.status === 'FINISHED') {
      if (liveIndicator) liveIndicator.style.display = 'none';
      if (ftIndicator) ftIndicator.style.display = 'flex';
      if (matchMinuteEl) {
        matchMinuteEl.style.display = 'block';
        matchMinuteEl.style.color = 'var(--text2)';
        matchMinuteEl.textContent = 'FT';
      }
    } else {
      if (liveIndicator) liveIndicator.style.display = 'none';
      if (ftIndicator) ftIndicator.style.display = 'none';
      if (matchMinuteEl) {
        matchMinuteEl.style.display = 'block';
        matchMinuteEl.style.color = 'var(--text3)';
        matchMinuteEl.textContent = formatLocalTime(activeMatch.utcDate);
      }
    }
    
    var venueEl = document.getElementById('venue');
    if (venueEl) {
      venueEl.textContent = activeMatch.venue || getVenueForGroup(activeMatch.group) || 'FIFA World Cup Stadium';
    }
    
    var refereeEl = document.getElementById('referee');
    if (refereeEl) {
      refereeEl.textContent = (activeMatch.referees && activeMatch.referees[0] && activeMatch.referees[0].name) || 'To Be Appointed';
    }
    
    // Simulate statistics deterministically
    var matchId = activeMatch.id || 0;
    var hScore = homeScore(activeMatch);
    var aScore = awayScore(activeMatch);
    var isScheduled = activeMatch.status === 'SCHEDULED' || activeMatch.status === 'TIMED';
    var isLive = activeMatch.status === 'IN_PLAY' || activeMatch.status === 'PAUSED';
    
    var possessionHome = 50 + (hScore - aScore) * 3 + (matchId % 11) - 5;
    possessionHome = Math.max(30, Math.min(70, possessionHome));
    if (isScheduled) possessionHome = 50;
    var possessionAway = 100 - possessionHome;
    
    var shotsHome = hScore + 3 + (matchId % 7);
    var shotsAway = aScore + 2 + (matchId % 5);
    if (isScheduled) {
      shotsHome = 0;
      shotsAway = 0;
    } else if (isLive) {
      var minFraction = (activeMatch.minute || 45) / 90;
      shotsHome = Math.max(hScore, Math.round(shotsHome * minFraction));
      shotsAway = Math.max(aScore, Math.round(shotsAway * minFraction));
    }
    
    var xgHome = (hScore * 0.75 + (matchId % 5) * 0.15).toFixed(1);
    var xgAway = (aScore * 0.7 + (matchId % 4) * 0.15).toFixed(1);
    if (isScheduled) {
      xgHome = '0.0';
      xgAway = '0.0';
    } else if (isLive) {
      var minFraction = (activeMatch.minute || 45) / 90;
      xgHome = Math.max(hScore * 0.1, parseFloat(xgHome) * minFraction).toFixed(1);
      xgAway = Math.max(aScore * 0.1, parseFloat(xgAway) * minFraction).toFixed(1);
    }
    
    var pHValue = document.getElementById('possession-home-val');
    var pAValue = document.getElementById('possession-away-val');
    var pHBar = document.getElementById('possession-home-bar');
    var pABar = document.getElementById('possession-away-bar');
    
    if (pHValue) pHValue.textContent = possessionHome + '%';
    if (pAValue) pAValue.textContent = possessionAway + '%';
    if (pHBar) pHBar.style.width = possessionHome + '%';
    if (pABar) pABar.style.width = possessionAway + '%';
    
    var sHValue = document.getElementById('shots-home-val');
    var sAValue = document.getElementById('shots-away-val');
    var sHBar = document.getElementById('shots-home-bar');
    var sABar = document.getElementById('shots-away-bar');
    
    if (sHValue) sHValue.textContent = shotsHome;
    if (sAValue) sAValue.textContent = shotsAway;
    var totalShots = (shotsHome + shotsAway) || 1;
    if (sHBar) sHBar.style.width = (shotsHome / totalShots * 100) + '%';
    if (sABar) sABar.style.width = (shotsAway / totalShots * 100) + '%';
    
    var xgHValue = document.getElementById('xg-home-val');
    var xgAValue = document.getElementById('xg-away-val');
    var xgHBar = document.getElementById('xg-home-bar');
    var xgABar = document.getElementById('xg-away-bar');
    
    if (xgHValue) xgHValue.textContent = xgHome;
    if (xgAValue) xgAValue.textContent = xgAway;
    var totalXg = (parseFloat(xgHome) + parseFloat(xgAway)) || 1;
    if (xgHBar) xgHBar.style.width = (parseFloat(xgHome) / totalXg * 100) + '%';
    if (xgABar) xgABar.style.width = (parseFloat(xgAway) / totalXg * 100) + '%';
  }

  function startRegularPolling(container) {
    if (pollTimer) return;
    var hasLive = (window.WC_TODAY_MATCHES || []).some(function (m) {
      return m.status === 'IN_PLAY' || m.status === 'PAUSED';
    });
    var interval = hasLive ? 30000 : 120000;
    pollTimer = setInterval(function () {
      // Re-check for live matches and adjust interval
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      fetchAndRender(container);
    }, interval);
  }

  async function fetchAndRender(container) {
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    showSkeleton(container);
    try {
      var res = await fetch(resolveApiBaseUrl() + '/api/wc/matches', { credentials: 'omit' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      window.WC_TODAY_MATCHES = data.matches || [];
      renderMatches(container, data);
      updateLiveMatchCenter(window.WC_TODAY_MATCHES);
      unlockMatchdayTab();
      
      startRegularPolling(container);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      container.innerHTML = '';
      
      var errWrap = document.createElement('div');
      errWrap.className = 'wc-offseason wc-error-state';
      errWrap.innerHTML =
        '<span class="wc-loader-spinner" style="font-size: 2rem; display: block; margin-bottom: 0.5rem; animation: wc-pulse 1.5s infinite;">⏳</span>' +
        '<p style="font-weight: 800; font-size: 1.05rem; margin: 0.25rem 0;">Server is warming up...</p>' +
        '<p class="wc-dates" style="font-size: 0.82rem; max-width: 320px; margin: 0.25rem auto 0; line-height: 1.4;">' +
          'The server is taking a moment to respond. Retrying automatically in 5 seconds...' +
        '</p>';
      container.appendChild(errWrap);
      
      updateLiveMatchCenter([]);
      
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
      retryTimer = setTimeout(function () {
        fetchAndRender(container);
      }, 5000);
    }
  }

  window.initWCMatches = function initWCMatches(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    fetchAndRender(container);
  };
})();
