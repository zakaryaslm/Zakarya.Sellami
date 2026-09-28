'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-navigation');
  const closeMenu = () => { menu.setAttribute('aria-expanded','false'); nav.classList.remove('is-open'); };
  header.classList.add('menu-enhanced');
  menu.hidden = false;
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    nav.classList.toggle('is-open',open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
  });
  matchMedia('(max-width:780px)').addEventListener('change',closeMenu);
  const filters = document.querySelector('.project-filters');
  const cards = [...document.querySelectorAll('.project-card')];
  filters.hidden = false;
  filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
    let count = 0;
    cards.forEach(card => {
      const visible = button.dataset.filter === 'all' || card.dataset.category.split(' ').includes(button.dataset.filter);
      card.hidden = !visible;
      card.classList.toggle('filter-enter',visible);
      if(visible) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} project${count === 1 ? '' : 's'} shown`;
  }));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const enter = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting) { entry.target.classList.add('just-entered'); enter.unobserve(entry.target); }
    }), {threshold:0.2});
    document.querySelectorAll('.section-heading').forEach(el => enter.observe(el));
  }
  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const current = link.hash === '#' + entry.target.id;
          link.classList.toggle('active',current);
          if(current) link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      });
    },{rootMargin:'-10% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
});

// Enhance the readable project summaries with keyboard-accessible detail views.
document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('.project-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    let opener;
    document.querySelectorAll('.project-card').forEach(card => {
      const body = card.querySelector('.project-body');
      const heading = body.querySelector('h3');
      const title = heading.textContent;
      const details = body.querySelector('details');
      const content = document.createElement('div');
      const h2 = document.createElement('h2');
      h2.id = 'dialog-title'; h2.textContent = title;
      content.append(body.querySelector('.project-meta').cloneNode(true), h2);
      body.querySelectorAll(':scope > p:not(.project-meta), :scope > .tags').forEach(el => content.append(el.cloneNode(true)));
      if (details) {
        const subheading = document.createElement('h3'); subheading.textContent = 'Approach';
        content.append(subheading);
        details.querySelectorAll('p').forEach(el => content.append(el.cloneNode(true)));
        details.hidden = true;
      }
      const link = body.querySelector('.project-link');
      if (link) content.append(link.cloneNode(true));
      const open = event => {
        opener = event.currentTarget;
        dialog.querySelector('.dialog-body').replaceChildren(...[...content.children].map(el => el.cloneNode(true)));
        dialog.showModal(); document.body.classList.add('dialog-open');
      };
      const titleButton = document.createElement('button');
      titleButton.type = 'button'; titleButton.className = 'project-title-button'; titleButton.textContent = title;
      titleButton.setAttribute('aria-haspopup','dialog'); titleButton.addEventListener('click',open);
      heading.replaceChildren(titleButton);
      const button = document.createElement('button'); button.type = 'button'; button.className = 'project-open';
      button.innerHTML = 'View project <span aria-hidden="true">↗</span>';
      button.setAttribute('aria-label',`View project: ${title}`); button.setAttribute('aria-haspopup','dialog');
      button.addEventListener('click',open); body.append(button);
    });
    dialog.querySelector('.dialog-close').addEventListener('click',() => dialog.close());
    dialog.addEventListener('click',event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close',() => { document.body.classList.remove('dialog-open'); opener?.focus(); });
  }

  const canvas = document.querySelector('.hero-network');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const hero = canvas.parentElement;
  const toggle = hero.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, frame = 0, last = 0, visible = true, paused = false;
  let pointer = null;
  const points = Array.from({length:34}, () => ({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.000025,vy:(Math.random()-.5)*.000025}));
  function draw(delta = 0) {
    ctx.clearRect(0,0,width,height);
    points.forEach(p => {
      p.x += p.vx*delta; p.y += p.vy*delta;
      if(p.x < 0 || p.x > 1) {p.vx *= -1;p.x=Math.max(0,Math.min(1,p.x));}
      if(p.y < 0 || p.y > 1) {p.vy *= -1;p.y=Math.max(0,Math.min(1,p.y));}
    });
    points.forEach((p,i) => {
      const x=p.x*width,y=p.y*height;
      ctx.fillStyle='rgba(74,112,156,.30)';ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();
      const neighbors=points.slice(i+1).map(q=>({x:q.x*width,y:q.y*height}));
      if(pointer) neighbors.push(pointer);
      neighbors.forEach(q=>{
        const distance=Math.hypot(x-q.x,y-q.y),range=165;
        if(distance>=range)return;
        ctx.strokeStyle=`rgba(74,112,156,${.16*(1-distance/range)})`;ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(q.x,q.y);ctx.stroke();
      });
    });
  }
  function tick(time) {
    frame=0;
    if(time-last>=32){draw(last?Math.min(time-last,64):0);last=time;}
    if(visible&&!paused&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame=0; last=0;
    toggle.hidden=reduced.matches;
    if(visible&&!paused&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);
    else draw();
  }
  function resize() {
    width=hero.clientWidth;height=hero.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize',resize);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(hero);
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=hero.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};}});
  hero.addEventListener('pointerleave',()=>{pointer=null;});
  toggle.addEventListener('click',()=>{
    paused=!paused;toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Play background animation':'Pause background animation');
    toggle.firstElementChild.textContent=paused?'▶':'Ⅱ';sync();
  });
  reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
  resize();sync();
});
