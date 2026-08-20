/* ---------------------------------------------------------------
   Hero flyover reel
   Drop drone clips in /videos and list them here in play order.
   Each clip plays once, crossfades into the next, and the reel
   loops forever. Any number of clips works — add or remove lines.
   See videos/README.md for encoding settings.
--------------------------------------------------------------- */
// Ordered by time of day: midday, then golden hour, then dusk.
const HERO_CLIPS = [
  'videos/waco-brazos.mp4',
  'videos/waco-silos.mp4',
  'videos/waco-suspension-bridge.mp4',
  'videos/waco-alico-sunset.mp4'
];

const FADE_MS = 1400; // must match the .hero-video opacity transition

function initHeroReel() {
  const hero = document.querySelector('.hero');
  const layers = document.querySelectorAll('.hero-media .hero-video');
  if (!hero || layers.length < 2 || !HERO_CLIPS.length) return;

  // Respect motion preferences and metered connections — the still photo stays.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;

  let clipIndex = 0;
  let activeLayer = 0;
  let started = false;

  // A failure before anything has played (missing file, unsupported codec,
  // blocked autoplay) leaves the hero exactly as it was without the video.
  // Once the reel is running, a hiccup on a queued clip must NOT tear down
  // the clip currently on screen — advance() handles that case instead.
  const abort = () => {
    if (started) return;
    hero.classList.remove('has-video');
    layers.forEach((layer) => {
      layer.classList.remove('is-active');
      layer.removeAttribute('src');
    });
  };

  layers.forEach((layer) => {
    layer.addEventListener('error', abort);
    layer.addEventListener('playing', () => {
      started = true;
      hero.classList.add('has-video');
      layer.classList.add('is-active');
    });
  });

  const play = (layer) => {
    const attempt = layer.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(abort);
  };

  const advance = () => {
    const current = layers[activeLayer];
    const next = layers[(activeLayer + 1) % 2];

    // A single clip has nowhere to go — just restart it in place.
    // Same when the queued clip failed to load: replaying what we already
    // have on screen beats crossfading into a broken layer.
    if (HERO_CLIPS.length === 1 || next.error) {
      current.currentTime = 0;
      play(current);
      return;
    }

    play(next);
    next.classList.add('is-active');
    current.classList.remove('is-active');
    activeLayer = (activeLayer + 1) % 2;

    // Once the outgoing layer is hidden, queue the clip after this one on it.
    window.setTimeout(() => {
      current.pause();
      clipIndex = (clipIndex + 1) % HERO_CLIPS.length;
      current.src = HERO_CLIPS[(clipIndex + 1) % HERO_CLIPS.length];
      current.load();
    }, FADE_MS);
  };

  layers.forEach((layer) => layer.addEventListener('ended', advance));

  layers[0].src = HERO_CLIPS[0];
  if (HERO_CLIPS.length === 1) {
    layers[0].loop = true;
  } else {
    layers[1].src = HERO_CLIPS[1];
    layers[1].load();
  }

  play(layers[0]);
}

initHeroReel();

// Sticky header height -> --header-h, which drives both the scroll-margin on
// anchor targets and the min-height of the full-screen sections. Measured
// rather than hard-coded so it stays correct if the header's contents change.
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const setHeaderHeight = () => {
    const h = Math.round(siteHeader.getBoundingClientRect().height);
    if (h) document.documentElement.style.setProperty('--header-h', h + 'px');
  };

  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);
  // The logo is an SVG with an intrinsic size, but re-measure once everything
  // has loaded in case a webfont or image settles at a different height.
  window.addEventListener('load', setHeaderHeight);
}

// Same-page links scroll themselves rather than leaving it to the browser.
// Two things move under a native jump on a phone: Safari collapses its toolbar
// during the scroll, which resizes every dvh-sized section beneath it, and the
// mobile menu closes at the same moment. Either one lands the section a hundred
// pixels off. So: scroll, wait for it to stop, then correct whatever moved.
const headerHeight = () =>
  siteHeader ? Math.round(siteHeader.getBoundingClientRect().height) : 0;

const offsetFor = (target) =>
  Math.round(target.getBoundingClientRect().top + window.scrollY - headerHeight());

const scrollToTarget = (target, smooth) => {
  const jump = (behavior) => window.scrollTo({
    top: Math.max(0, offsetFor(target)),
    behavior
  });

  jump(smooth ? 'smooth' : 'auto');

  // Wait for the scroll to settle, then close the gap the resize opened up.
  // Two corrections is plenty; the second only ever moves a pixel or two.
  let corrections = 0;
  let lastY = window.scrollY;
  let stillFor = 0;
  const deadline = performance.now() + 2000;

  const check = () => {
    if (window.scrollY === lastY) stillFor += 1;
    else { stillFor = 0; lastY = window.scrollY; }

    if (stillFor > 4) {
      const drift = Math.round(target.getBoundingClientRect().top) - headerHeight();
      if (Math.abs(drift) > 1 && corrections < 2) {
        corrections += 1;
        stillFor = 0;
        window.scrollBy({ top: drift, behavior: 'auto' });
      } else {
        return;
      }
    }
    if (performance.now() < deadline) requestAnimationFrame(check);
  };
  requestAnimationFrame(check);
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  if (!id) return;

  link.addEventListener('click', (event) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    scrollToTarget(target, !reducedMotion.matches);
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });
});

// Arriving on a deep link lands the same way, once layout has settled.
window.addEventListener('load', () => {
  const id = window.location.hash.slice(1);
  const target = id && document.getElementById(id);
  if (target) scrollToTarget(target, false);
});

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Accordion (FAQ) — each .accordion group opens independently
document.querySelectorAll('.accordion-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const panel = button.nextElementSibling;
    const group = button.closest('.accordion');

    group.querySelectorAll('.accordion-toggle').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false');
      btn.nextElementSibling.style.maxHeight = null;
    });

    if (!expanded) {
      button.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// Service detail modal — cards open a window instead of dropping open in place
const serviceModal = document.getElementById('service-modal');

if (serviceModal) {
  const modalTitle = document.getElementById('service-modal-title');
  const modalBody = document.getElementById('service-modal-body');
  const modalWindow = serviceModal.querySelector('.modal-window');
  let lastFocused = null;

  const openService = (card) => {
    const source = document.getElementById(card.dataset.service);
    if (!source) return;

    lastFocused = card;
    modalTitle.textContent = card.querySelector('h3').textContent;
    modalBody.innerHTML = source.innerHTML;

    serviceModal.hidden = false;
    document.body.classList.add('modal-open');
    // Next frame so the opening transition has a state to animate from.
    requestAnimationFrame(() => serviceModal.classList.add('is-open'));
    modalWindow.focus();
  };

  const closeService = () => {
    serviceModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => { serviceModal.hidden = true; }, 200);
    // preventScroll: the modal's own "Request a Consultation" link closes the
    // window and scrolls to Contact — refocusing the card would yank the page
    // back up mid-scroll.
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  };

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => openService(card));
  });

  serviceModal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeService);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !serviceModal.hidden) closeService();
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
