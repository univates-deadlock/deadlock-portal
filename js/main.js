'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Abrir menu');
  navigation?.classList.remove('is-open');
}

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
  navigation?.classList.toggle('is-open', !expanded);
});

navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const year = String(new Date().getFullYear());
document.querySelectorAll('[data-year]').forEach(element => { element.textContent = year; });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver((entries, instance) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        instance.unobserve(entry.target);
      }
    }
  }, { threshold: 0.1, rootMargin: '0px 0px 36px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
