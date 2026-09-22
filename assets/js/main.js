/* AMFAHHZ Cambridge Academy - site interactions */
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  // Mobile menu
  if (toggle && nav) {
    var setMenu = function (open) {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      var open = !document.body.classList.contains('nav-open');
      setMenu(open);
      if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // "We teach" marquee: pause / play button
  var marqueeBtn = document.querySelector('.marquee-toggle');
  if (marqueeBtn) {
    marqueeBtn.addEventListener('click', function () {
      var paused = marqueeBtn.getAttribute('aria-pressed') !== 'true';
      marqueeBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      document.querySelector('.marquee').classList.toggle('is-paused', paused);
    });
  }

  // Header shadow on scroll
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // FAQ: keep only one answer open at a time
  document.querySelectorAll('.faq').forEach(function (group) {
    var all = group.querySelectorAll('details');
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  // Enquiry form: when data-endpoint holds a Google Apps Script URL, send the form there
  // (works on GitHub Pages or any host). With no endpoint the form posts normally (Netlify Forms).
  var form = document.querySelector('form[data-endpoint]');
  if (form && form.getAttribute('data-endpoint')) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var btnLabel = submitBtn.querySelector('.btn-label');
    var labelText = btnLabel.textContent;
    var setStatus = function (msg, type) {
      statusEl.className = 'form-status' + (type ? ' is-' + type : '');
      statusEl.innerHTML = msg;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var trap = form.querySelector('[name="bot-field"]');
      if (trap && trap.value) return;

      var data = new URLSearchParams(new FormData(form));
      data.append('page', window.location.href);

      submitBtn.disabled = true;
      btnLabel.textContent = 'Sending…';
      setStatus('Sending your enquiry…', '');

      fetch(form.getAttribute('data-endpoint'), { method: 'POST', body: data })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          if (res.result !== 'success') throw new Error(res.error || 'Failed');
          setStatus('Thank you! Your enquiry has been sent.', 'success');
          window.location.href = form.getAttribute('action');
        })
        .catch(function () {
          submitBtn.disabled = false;
          btnLabel.textContent = labelText;
          setStatus('Sorry, your enquiry could not be sent. Please try again, or message us on ' +
            '<a href="https://wa.me/923111418064" target="_blank" rel="noopener">WhatsApp</a>.', 'error');
        });
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
