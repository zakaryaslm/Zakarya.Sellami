document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  function closeMenu() {
    button.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }
  button.hidden = false;
  navbar.classList.add('menu-enhanced');
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      closeMenu(); button.focus();
    }
  });
  const mobile = matchMedia('(max-width: 700px)');
  mobile.addEventListener('change', closeMenu);
  const onScroll = () => navbar.classList.toggle('scrolled', scrollY > 25);
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if (!('IntersectionObserver' in window)) return;
  const sections = [...document.querySelectorAll('main section[id]')];
  const activeObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, {rootMargin:'-15% 0px -65% 0px', threshold:0});
  sections.forEach(section => activeObserver.observe(section));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0, rootMargin:'0px 0px 30px 0px'});
  document.querySelectorAll('.section-heading,.project-card,.education-item,.engagement-item').forEach(el => {
    el.classList.add('reveal-pending'); revealObserver.observe(el);
  });
});
