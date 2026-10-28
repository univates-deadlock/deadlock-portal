'use strict';

(() => {
  function initMobileNavigation() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const menuButton = header.querySelector('.site-header__toggle');
    const navigation = header.querySelector('.site-header__nav');
    if (!menuButton || !navigation) return;

    function setMenuOpen(isOpen) {
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
      navigation.classList.toggle('is-open', isOpen);
    }

    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!expanded);
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
        setMenuOpen(false);
        menuButton.focus();
      }
    });

    window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
      if (event.matches) setMenuOpen(false);
    });
  }

  function initCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-year]').forEach(element => {
      element.textContent = year;
    });
  }

  function initScrollReveal() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('is-motion-ready');
    const observer = new IntersectionObserver(
      (entries, instance) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 36px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }

  initMobileNavigation();
  initCurrentYear();
  initScrollReveal();
})();
