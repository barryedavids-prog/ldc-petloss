/* ==========================================================================
   App logic. Reads wording from LDC_CONTENT and settings from LDC_CONFIG.
   Runs entirely in the browser: no storage, no network requests.
   ========================================================================== */
(function () {
  'use strict';

  var C = window.LDC_CONTENT;
  var CFG = window.LDC_CONFIG;

  var stage = document.getElementById('stage');
  var crisisBox = document.getElementById('crisis');
  var widget = document.getElementById('widget');
  var announcer = document.getElementById('announcer');

  var questions = C.questions.items;
  var answers = [];         // answers[i] = index of the chosen option (memory only)
  var petName = '';         // optional, typed on the intro screen (memory only)
  var breathTimer = null;   // handle for the breathing pause timer
  var advanceTimer = null;  // handle for the short pause after an answer is tapped
  var firstScreen = true;   // true until the first screen has been drawn

  /* Viewed directly (not inside the Squarespace iframe): give the page its
     own background so it still looks finished. */
  try {
    if (window.top === window.self) document.documentElement.classList.add('standalone');
  } catch (e) { /* cross-origin parent: we're framed */ }

  /* ---------- Illustrations ----------
     Fixed strings written here, never built from visitor input, and all
     decorative (hidden from screen readers). */

  /* #ldc-paw (one paw print, centred on 0,0) is defined once in index.html
     and reused here with <use>. */

  /* A trail of paw prints walking over the hills towards a low sun */
  function heroSvg() {
    var prints = [
      [58, 160, 1.15, 62], [88, 151, 1.05, 70], [114, 156, 0.95, 62], [140, 147, 0.86, 70],
      [162, 151, 0.78, 62], [184, 143, 0.7, 70], [203, 146, 0.62, 62], [221, 140, 0.55, 70]
    ].map(function (p) {
      return '<g class="print" transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[3] + ') scale(' + p[2] + ')"><use href="#ldc-paw"/></g>';
    }).join('');
    return '<svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMax slice" focusable="false">' +
      '<defs><linearGradient id="ldc-sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#cfe2f3"/><stop offset="1" stop-color="#fbe2c6"/></linearGradient></defs>' +
      '<rect width="400" height="170" fill="url(#ldc-sky)"/>' +
      '<circle class="sun" cx="292" cy="112" r="34" fill="#f5bf78"/>' +
      '<g class="birds" fill="none" stroke="#105f96" stroke-width="1.6" stroke-linecap="round" opacity="0.45">' +
      '<path d="M70 66 q6 -6 12 0 q6 -6 12 0"/><path d="M104 54 q4 -4 8 0 q4 -4 8 0"/></g>' +
      '<path d="M0 116 C 80 96, 170 104, 250 112 S 360 98, 400 106 V170 H0Z" fill="#9dbdd9"/>' +
      '<path d="M0 132 C 90 118, 200 120, 290 134 S 370 138, 400 132 V170 H0Z" fill="#5a8cb6"/>' +
      '<g fill="#ffffff" opacity="0.9">' + prints + '</g></svg>';
  }

  /* A heart holding a paw print, for the results screen */
  function heartSvg() {
    return '<svg viewBox="0 0 48 48" focusable="false">' +
      '<path d="M24 43C10 33 3 25 3 16.5A10.5 10.5 0 0 1 24 12a10.5 10.5 0 0 1 21 4.5C45 25 38 33 24 43Z" fill="#105f96"/>' +
      '<g fill="#fbe2c6" transform="translate(24 23) scale(1.05)"><use href="#ldc-paw"/></g></svg>';
  }

  function pawSvg() {
    return '<svg viewBox="-10 -10 20 20" focusable="false"><use href="#ldc-paw"/></svg>';
  }

  function illustration(className, markup) {
    var wrap = el('div', className);
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = markup;
    return wrap;
  }

  /* ---------- Small helpers ---------- */

  /* Build an element. Text goes in via textContent, so it is always treated as
     plain text, never as HTML. */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(label, className, onClick) {
    var b = el('button', className, label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  function paragraphs(container, lines, className) {
    lines.forEach(function (line) { container.appendChild(el('p', className, line)); });
  }

  /* Fill in {them} / {name} with the pet's name, if one was given */
  function personalise(text) {
    return text.replace(/\{them\}/g, petName || 'them').replace(/\{name\}/g, petName);
  }

  function announce(message) {
    announcer.textContent = '';
    // A tiny delay makes screen readers reliably notice the change
    setTimeout(function () { announcer.textContent = message; }, 50);
  }

  /* Swap in a new screen and move keyboard/screen-reader focus to its heading.
     preventScroll stops the parent Squarespace page jumping around. */
  function show(card, heading) {
    stopBreathing();
    clearTimeout(advanceTimer);
    stage.textContent = '';
    stage.appendChild(card);
    heading.setAttribute('tabindex', '-1');
    /* Don't grab focus on the very first screen: the visitor hasn't interacted
       yet, and stealing focus as an embedded page loads is disorienting. */
    if (!firstScreen) heading.focus({ preventScroll: true });
    firstScreen = false;
    postHeight();   // report the new height straight away (function is defined below)
  }

  /* ---------- Screens ---------- */

  function showTeaser() {
    var T = C.teaser;
    var card = el('section', 'card teaser');
    card.appendChild(illustration('hero hero-small', heroSvg()));
    var h = el('h1', null, T.heading);
    card.appendChild(h);
    card.appendChild(el('p', null, T.body));
    var row = el('div', 'btn-row');
    row.appendChild(button(T.button, 'btn', function () {
      ensureCrisis();
      showIntro();
    }));
    card.appendChild(row);
    show(card, h);
  }

  function showIntro() {
    var I = C.intro;
    var card = el('section', 'card card-hero');
    card.appendChild(illustration('hero', heroSvg()));

    var body = el('div', 'card-body');
    body.appendChild(el('p', 'kicker', I.kicker));
    var h = el('h1', null, I.title);
    body.appendChild(h);
    paragraphs(body, I.body);

    var field = el('div', 'field');
    var label = el('label', null, I.nameLabel);
    label.htmlFor = 'pet-name';
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'pet-name';
    input.maxLength = 40;
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.value = petName;
    input.setAttribute('aria-describedby', 'pet-name-hint');
    var hint = el('p', 'field-hint', I.nameHint);
    hint.id = 'pet-name-hint';
    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(hint);
    body.appendChild(field);

    body.appendChild(el('p', 'privacy-note', I.privacy));

    function begin() {
      petName = input.value.trim();
      showQuestion(0);
    }
    /* Enter in the name box starts, like submitting a form would */
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); begin(); }
    });

    var row = el('div', 'btn-row');
    row.appendChild(button(I.startButton, 'btn', begin));
    body.appendChild(row);
    card.appendChild(body);
    show(card, h);
  }

  /* One paw print per question: walked (answered), here (current), ahead */
  function pawTrail(current, total) {
    var trail = el('div', 'paw-trail');
    trail.setAttribute('aria-hidden', 'true'); // the progress text already says it
    for (var n = 0; n < total; n++) {
      var state = n < current ? 'walked' : (n === current ? 'here' : 'ahead');
      trail.appendChild(illustration('paw ' + state, pawSvg()));
    }
    return trail;
  }

  function showQuestion(i) {
    var Q = C.questions;
    var total = questions.length;
    var card = el('section', 'card');

    card.appendChild(pawTrail(i, total));
    card.appendChild(el('p', 'progress-text', Q.progressLabel
      .replace('{current}', i + 1)
      .replace('{total}', total)));

    card.appendChild(el('p', 'q-prompt', Q.prompt));
    var statement = el('h2', 'q-statement', personalise(questions[i].statement));
    statement.id = 'q-statement';
    card.appendChild(statement);

    /* Tapping an answer chooses it and moves on, which suits phones.
       aria-pressed tells screen readers which one was chosen before. */
    var group = el('div', 'options');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-labelledby', 'q-statement');
    var locked = false;
    var buttons = Q.options.map(function (opt, idx) {
      var b = button('', 'option', function () {
        if (locked) return;
        locked = true;
        answers[i] = idx;
        buttons.forEach(function (other) {
          other.setAttribute('aria-pressed', String(other === b));
        });
        advanceTimer = setTimeout(function () {
          if (i === total - 1) showResults(); else showQuestion(i + 1);
        }, CFG.advanceDelay);
      });
      b.setAttribute('aria-pressed', String(answers[i] === idx));
      var dot = el('span', 'option-dot');
      dot.setAttribute('aria-hidden', 'true');
      b.appendChild(dot);
      b.appendChild(el('span', null, opt.label));
      group.appendChild(b);
      return b;
    });
    card.appendChild(group);

    var row = el('div', 'btn-row');
    row.appendChild(button(Q.backButton, 'btn btn-quiet', function () {
      if (i === 0) showIntro(); else showQuestion(i - 1);
    }));
    card.appendChild(row);

    /* Focus the question itself (not a button) so it is read out first */
    show(card, statement);
  }

  function points(i) {
    return C.questions.options[answers[i]].points;
  }

  function totalPoints() {
    return answers.reduce(function (sum, optIndex, i) { return sum + points(i); }, 0);
  }

  function pickBand(total) {
    var chosen = C.results.bands[0];
    C.results.bands.forEach(function (band) {
      if (total >= band.minPoints) chosen = band;
    });
    return chosen;
  }

  /* Question numbers, strongest answers first (ties keep question order) */
  function byStrength() {
    return questions.map(function (q, i) { return i; }).sort(function (a, b) {
      return (points(b) - points(a)) || (a - b);
    });
  }

  /* Reflections: kind sentences for statements the visitor said were "Often"
     true (most points). If there are none, use the "Sometimes" ones. Max 3. */
  function pickReflections() {
    var opts = C.questions.options;
    var maxPoints = Math.max.apply(null, opts.map(function (o) { return o.points; }));
    function collect(target) {
      return questions.filter(function (q, i) {
        return points(i) === target && q.reflection;
      }).map(function (q) { return q.reflection; });
    }
    var list = collect(maxPoints);
    if (list.length === 0) list = collect(maxPoints - 1);
    return list.slice(0, 3);
  }

  /* Blog headings that speak to what the visitor said was true (max 3).
     If nothing was, just the first few headings in question order. */
  function pickSections() {
    var relevant = byStrength().filter(function (i) {
      return points(i) > 0 && questions[i].section;
    });
    var matched = relevant.length > 0;
    var order = matched ? relevant : questions.map(function (q, i) { return i; });
    var list = [];
    order.forEach(function (i) {
      var s = questions[i].section;
      if (s && list.indexOf(s) === -1) list.push(s);
    });
    return { matched: matched, list: list.slice(0, 3) };
  }

  function buildBlog() {
    var B = C.blog;
    var panel = el('div', 'blog');
    panel.appendChild(el('p', 'kicker', B.kicker));
    panel.appendChild(el('h3', 'blog-title', B.title));
    var quote = el('blockquote', 'blog-quote');
    quote.appendChild(el('p', null, B.quote));
    panel.appendChild(quote);

    var sections = pickSections();
    panel.appendChild(el('p', null, sections.matched ? B.sectionsIntro : B.sectionsIntroGeneral));
    var ul = el('ul', 'chips');
    sections.list.forEach(function (s) { ul.appendChild(el('li', null, s)); });
    panel.appendChild(ul);
    panel.appendChild(el('p', null, B.personal));

    var link = el('a', 'btn btn-light', B.button);
    link.href = CFG.blogUrl;
    link.target = '_top';
    panel.appendChild(link);
    return panel;
  }

  function showResults() {
    var band = pickBand(totalPoints());
    var R = C.results;
    var card = el('section', 'card');

    var top = el('div', 'result-top');
    top.appendChild(illustration('heart', heartSvg()));
    top.appendChild(el('p', 'kicker', petName ? personalise(R.thanksNamed) : R.thanks));
    card.appendChild(top);

    var h = el('h2', 'result-title', band.title);
    card.appendChild(h);
    paragraphs(card, band.body);

    var reflections = pickReflections();
    if (reflections.length) {
      card.appendChild(el('h3', null, R.reflectionsHeading));
      var ul = el('ul', 'reflections');
      reflections.forEach(function (r) { ul.appendChild(el('li', null, r)); });
      card.appendChild(ul);
    }

    card.appendChild(buildBlog());

    card.appendChild(buildBreathing());

    /* Call to action: a soft invitation, not a hard sell */
    var cta = el('div', 'panel');
    cta.appendChild(el('h3', null, C.cta.heading));
    cta.appendChild(el('p', null, C.cta.body));
    var link = el('a', 'btn btn-secondary', C.cta.button);
    link.href = CFG.bookingUrl;
    link.target = '_top';
    cta.appendChild(link);
    card.appendChild(cta);

    /* Other pet bereavement services (not urgent: crisis help is always below) */
    if (C.support && C.support.services.length) {
      var support = el('div', 'panel');
      support.appendChild(el('h3', null, C.support.heading));
      support.appendChild(phoneList(C.support.services));
      card.appendChild(support);
    }

    card.appendChild(el('p', 'muted small', R.disclaimer));

    var row = el('div', 'btn-row');
    row.appendChild(button(R.restartButton, 'btn btn-quiet', function () {
      answers = [];
      showIntro();
    }));
    card.appendChild(row);

    show(card, h);
  }

  /* ---------- Breathing pause ---------- */

  function stopBreathing() {
    clearTimeout(breathTimer);
    breathTimer = null;
  }

  function buildBreathing() {
    var B = C.breathing;
    var b = CFG.breathing;
    var panel = el('div', 'panel');
    panel.appendChild(el('h3', null, B.heading));
    panel.appendChild(el('p', null, B.intro));

    var startBtn = button(B.startButton, 'btn btn-secondary', begin);
    panel.appendChild(startBtn);

    var stageBox = el('div', 'breath-stage');
    stageBox.hidden = true;
    var circleWrap = el('div', 'breath-circle-wrap');
    circleWrap.setAttribute('aria-hidden', 'true'); // decorative; the words carry the meaning
    var circle = el('div', 'breath-circle');
    circleWrap.appendChild(circle);
    var cue = el('p', 'breath-cue');
    var stopBtn = button(B.stopButton, 'btn btn-secondary', function () { finish(B.stopped, false); });
    stageBox.appendChild(circleWrap);
    stageBox.appendChild(cue);
    stageBox.appendChild(stopBtn);
    panel.appendChild(stageBox);

    function begin() {
      startBtn.hidden = true;
      stageBox.hidden = false;
      stopBtn.hidden = false;
      announce(B.announceStart);
      step(0, true);
      postHeight();
    }

    /* One step = one breath in or one breath out. Each step schedules the next. */
    function step(count, breatheIn) {
      if (count >= b.cycles * 2) { finish(B.done, true); return; }
      var seconds = breatheIn ? b.inSeconds : b.outSeconds;
      cue.textContent = breatheIn ? B.breatheIn : B.breatheOut;
      circle.style.transitionDuration = seconds + 's';
      circle.classList.toggle('expanded', breatheIn);
      breathTimer = setTimeout(function () { step(count + 1, !breatheIn); }, seconds * 1000);
    }

    function finish(message, completed) {
      stopBreathing();
      circle.style.transitionDuration = '1s';
      circle.classList.remove('expanded');
      cue.textContent = message;
      stopBtn.hidden = true;
      startBtn.textContent = B.againButton;
      startBtn.hidden = false;
      if (completed) announce(B.announceDone);
      postHeight();
    }

    return panel;
  }

  /* ---------- Crisis support (always visible, on every screen except the
     collapsed teaser) ---------- */

  var crisisRendered = false;
  function ensureCrisis() {
    if (crisisRendered) return;
    crisisRendered = true;
    renderCrisis();
    crisisBox.hidden = false;
  }

  function renderCrisis() {
    var X = C.crisis;
    var region = el('section');
    region.setAttribute('aria-labelledby', 'crisis-heading');
    var h = el('h2', null, X.heading);
    h.id = 'crisis-heading';
    region.appendChild(h);
    region.appendChild(el('p', null, X.intro));
    region.appendChild(phoneList(X.services));
    crisisBox.appendChild(region);
  }

  /* A list of services, each with a tap-to-call link */
  function phoneList(services) {
    var ul = el('ul', 'services');
    services.forEach(function (s) {
      var li = el('li');
      /* "NHS 111" and "999" already contain their number, so don't repeat it */
      var linkText = s.name.indexOf(s.phone) === -1 ? s.name + ' ' + s.phone : s.name;
      var a = el('a', null, linkText);
      a.href = 'tel:' + s.phone.replace(/\s+/g, '');
      li.appendChild(a);
      li.appendChild(document.createTextNode(': ' + s.detail));
      ul.appendChild(li);
    });
    return ul;
  }

  /* ---------- Tell the parent page how tall we are ----------
     Squarespace embeds us in an iframe, and an iframe can't size itself to its
     content. So we measure ourselves and post the number to the parent, which
     has a small script (see docs/squarespace-embed.html) that applies it.
     The message contains only a number: no personal data. */

  var lastHeight = 0;
  function postHeight() {
    var height = Math.ceil(widget.getBoundingClientRect().height);
    if (height === lastHeight) return;
    lastHeight = height;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'ldc-petloss-height', height: height }, '*');
    }
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(postHeight).observe(widget);   // fires whenever our size changes
  }
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);

  /* ---------- Go ----------
     Starts collapsed to the small teaser box if CFG.startCollapsed is true,
     or if this embed's src URL has ?start=collapsed (which also overrides
     CFG.startCollapsed to false via ?start=open). The teaser itself carries
     no crisis info; ensureCrisis() runs as soon as it's expanded. */
  var startParam = new URLSearchParams(window.location.search).get('start');
  var startCollapsed = startParam ? startParam === 'collapsed' : !!CFG.startCollapsed;

  if (startCollapsed) {
    showTeaser();
  } else {
    ensureCrisis();
    showIntro();
  }
  postHeight();
})();
