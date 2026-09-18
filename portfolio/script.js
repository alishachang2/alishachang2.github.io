/* ============================================================
   Alisha Chang — Portfolio
   Renders every section from data.json, then wires up the
   project modal, scrollspy, and scroll reveal.
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const pad = (n) => String(n).padStart(2, '0');

/** el('div', {class:'card'}, [child, 'text']) */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style') node.setAttribute('style', v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

const tagRow = (list) => el('div', { class: 'tag-row' },
  list.map(t => el('span', { class: 'tag', text: t })));

const linkBtn = (label, href, cls) => el('a', {
  class: 'btn btn-md' + (cls ? ' ' + cls : ''),
  href, target: '_blank', rel: 'noopener'
}, [label + ' ', el('span', { class: 'arrow-sm', text: '↗' })]);

/* ---------- intro ---------- */

function renderIntro(p, contacts) {
  const photo = $('#hero-photo');
  photo.src = p.photo;
  photo.alt = p.name;
  if (p.photoPosition) photo.style.objectPosition = p.photoPosition;

  $('.spine').textContent = p.vertical;
  $('.name').textContent = p.name;
  $('#hero-bio').textContent = p.bio;

  const tag = $('#hero-tagline');
  p.tagline.forEach((line, i) => {
    if (i) tag.append(el('br'));
    tag.append(document.createTextNode(line));
  });

  $('#hero-contacts').append(
    ...contacts.map(c => el('a', {
      class: 'icon-btn', href: c.href, target: '_blank', rel: 'noopener', 'aria-label': c.name
    }, [c.glyph, el('span', { class: 'tip', text: c.name })])),
    el('a', { class: 'btn', href: p.resume, target: '_blank', rel: 'noopener' },
      ['Résumé ', el('span', { class: 'arrow-sm', text: '↗' })])
  );

  $('#nav-resume').href = p.resume;
}

/* ---------- projects ---------- */

function renderProjects(list, openModal) {
  $('#projects-count').textContent = pad(list.length);

  $('#project-grid').append(...list.map(p => {
    const thumb = el('div', { class: 'project-thumb' });
    if (p.image) {
      const img = el('img', { src: p.image, alt: p.title });
      if (p.imagePosition) img.style.objectPosition = p.imagePosition;
      if (p.imageZoom && p.imageZoom !== 1) {
        img.style.transform = `scale(${p.imageZoom})`;
        img.style.transformOrigin = p.imagePosition || '50% 50%';
      }
      thumb.append(img);
    } else {
      thumb.append(el('span', { class: 'slot', text: p.slot || 'screenshot.png' }));
    }

    const card = el('button', { class: 'card project reveal', type: 'button' }, [
      thumb,
      el('div', { class: 'project-meta' }, [
        el('span', { class: 'title', text: p.title }),
        el('span', { class: 'meta', text: p.meta })
      ]),
      el('div', { class: 'project-cue' }, [
        el('span', { text: p.video ? 'Watch demo' : 'Read more' }),
        el('span', { class: 'arrow', text: '↗' })
      ])
    ]);
    card.addEventListener('click', () => openModal(p));
    return card;
  }));
}

/* ---------- experience ---------- */

function renderExperience(list) {
  $('#experience-count').textContent = pad(list.length);
  $('#timeline').append(...list.map(e => el('div', {
    class: 'job' + (e.placeholder ? ' is-placeholder' : '')
  }, [
    el('span', { class: 'period', text: e.period }),
    el('div', { class: 'job-body' }, [
      el('span', { class: 'role', text: e.role }),
      el('span', { class: 'org', text: e.org }),
      el('p', { class: 'line', text: e.line })
    ])
  ])));
}

/* ---------- about & background ---------- */

function renderAbout(about) {
  $('#about-text').textContent = about.paragraph;

  $('#skills-grid').append(...about.skills.map(g => el('div', { class: 'skill-group' }, [
    el('span', { class: 'group-name', text: g.name }),
    el('div', { class: 'items' }, g.items.map(t => el('span', { text: t })))
  ])));

  $('#about-side').append(...about.cards.map(c => el('div', { class: 'card bg-card reveal' }, [
    el('h3', { class: 'label', text: c.name }),
    el('div', {
      class: 'bg-list',
      style: `grid-template-columns:${c.columns};row-gap:${c.rowGap}`
    }, c.items.map(i => el('div', { class: 'bg-item' }, [
      el('span', { class: 'item-label', text: i.label }),
      el('span', { class: 'item-note', text: i.note })
    ])))
  ])));
}

/* ---------- off the clock ---------- */

function renderCreative(creative) {
  $('#creative-count').textContent = pad(creative.photos.length);
  $('#creative-blurb').textContent = creative.blurb;

  $('#photo-grid').append(...creative.photos.map(c => {
    const img = el('img', { src: c.image, alt: c.title });
    if (c.position) img.style.objectPosition = c.position;
    const fig = el('figure', {
      class: 'photo reveal' + (c.span === 2 ? ' span-2' : ''),
      style: `aspect-ratio:${c.ratio}`
    }, [
      img,
      el('figcaption', {}, [
        el('span', { class: 'title', text: c.title }),
        el('span', { class: 'medium', text: c.meta })
      ])
    ]);
    return fig;
  }));
}

/* ---------- footer ---------- */

function renderFooter(p) {
  $('#footer-name').textContent = p.name;
  const email = $('#footer-email');
  email.textContent = p.email;
  email.href = 'mailto:' + p.email;
  $('#footer-meta').textContent = `${p.location} · ${p.availability}`;
  $('#footer-links').append(
    linkBtn('GitHub', p.links.github),
    linkBtn('LinkedIn', p.links.linkedin),
    linkBtn('Résumé', p.resume)
  );
}

/* ---------- nav ---------- */

function renderNav(nav) {
  $('#navlinks').append(...nav.bar.map(n => el('a', {
    href: '#' + n.target, text: n.label, 'data-covers': n.covers.join(' ')
  })));

  $('#rail-links').append(...nav.rail.map(n => el('a', { href: '#' + n.target }, [
    el('span', { class: 'tick' }),
    el('span', { text: n.label })
  ])));
}

/* ---------- modal ---------- */

function initModal() {
  const overlay = $('#overlay');

  const close = () => { overlay.hidden = true; document.body.style.overflow = ''; };

  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  $('#modal-close').addEventListener('click', close);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return function open(p) {
    const hero = $('#modal-hero');
    hero.replaceChildren();
    if (p.image) {
      const img = el('img', { src: p.image, alt: p.title });
      if (p.imagePosition) img.style.objectPosition = p.imagePosition;
      if (p.imageZoom && p.imageZoom !== 1) {
        img.style.transform = `scale(${p.imageZoom})`;
        img.style.transformOrigin = p.imagePosition || '50% 50%';
      }
      hero.append(img);
    } else {
      hero.append(el('span', { class: 'slot', text: p.slot || 'screenshot.png' }));
    }

    $('#modal-meta').textContent = p.meta;
    $('#modal-title').textContent = p.title;
    $('#modal-desc').textContent = p.description;
    $('#modal-tags').replaceChildren(...p.tags.map(t => el('span', { class: 'tag', text: t })));

    const links = [];
    if (p.site) links.push(linkBtn('Live site', p.site));
    if (p.github) links.push(linkBtn('GitHub', p.github));
    if (p.video) links.push(linkBtn('Demo video', p.video, 'btn-ghost'));
    if (!links.length) links.push(el('span', { class: 'no-links', text: 'Links to be added' }));
    $('#modal-links').replaceChildren(...links);

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  };
}

/* ---------- behavior ---------- */

/** Highlight the nav entry for whichever section is crossing the middle.
 *  IntersectionObserver is the primary path; a scroll pass is the fallback
 *  for contexts where IO never fires. */
function initScrollspy() {
  const barLinks = Array.from(document.querySelectorAll('#navlinks a'));
  const railLinks = Array.from(document.querySelectorAll('#rail-links a'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!sections.length) return;

  const mark = (id) => {
    for (const a of railLinks) a.classList.toggle('is-active', a.hash === '#' + id);
    for (const a of barLinks) {
      const covers = (a.dataset.covers || '').split(' ');
      a.classList.toggle('is-active', covers.includes(id));
    }
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) mark(e.target.id);
  }, { rootMargin: '-45% 0px -45% 0px' });
  for (const sec of sections) io.observe(sec);

  const onScroll = () => {
    const mid = window.innerHeight / 2;
    let best = null, bestDist = Infinity;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const dist = Math.abs((r.top + r.bottom) / 2 - mid);
      if (dist < bestDist) { bestDist = dist; best = sec.id; }
    }
    if (best) mark(best);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  requestAnimationFrame(onScroll);
}

/** Fade elements in as they enter view.
 *  Fail-safe: anything already on screen is revealed immediately, so the page
 *  can never paint blank even if IntersectionObserver never fires. */
function initReveal() {
  const nodes = Array.from(document.querySelectorAll('.reveal'));
  if (!nodes.length) return;

  const show = (elm) => elm.classList.add('is-in');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach(show);
    return;
  }

  const below = nodes.filter(n => n.getBoundingClientRect().top > window.innerHeight * 0.92);
  for (const n of nodes) if (!below.includes(n)) show(n);
  if (!below.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) if (e.isIntersecting) { show(e.target); obs.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  for (const n of below) io.observe(n);

  const onScroll = () => {
    for (const n of below) {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.96 && r.bottom > 0) show(n);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  requestAnimationFrame(onScroll);

  setTimeout(() => below.forEach(show), 4000);
}

/* ---------- boot ---------- */

async function init() {
  let data;
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
    data = await res.json();
  } catch (err) {
    console.error('Could not load data.json —', err);
    console.error('If you opened index.html directly, run a local server: python3 -m http.server');
    document.querySelectorAll('.reveal').forEach(n => n.classList.add('is-in'));
    return;
  }

  const openModal = initModal();

  renderNav(data.nav);
  renderIntro(data.profile, data.contacts);
  renderProjects(data.projects, openModal);
  renderExperience(data.experience);
  renderAbout(data.about);
  renderCreative(data.creative);
  renderFooter(data.profile);

  initScrollspy();
  initReveal();
}

init();
