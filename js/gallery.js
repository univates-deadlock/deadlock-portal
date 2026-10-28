'use strict';

(() => {
  const gallery = document.querySelector('#project-gallery');
  const links = [...document.querySelectorAll('.project-art')];
  if (!gallery || typeof gallery.showModal !== 'function' || !links.length) return;

  const image = gallery.querySelector('.gallery-image');
  const title = gallery.querySelector('#gallery-title');
  const count = gallery.querySelector('#gallery-count');
  let selected = 0;
  let trigger = null;

  function showProject(index) {
    selected = (index + links.length) % links.length;
    const link = links[selected];
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    title.textContent = link.closest('.project-card').querySelector('h3').textContent.trim();
    count.textContent = `${selected + 1} de ${links.length}`;
  }

  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'project-gallery');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      showProject(index);
      gallery.showModal();
      document.documentElement.classList.add('gallery-open');
    });
  });

  gallery.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
  gallery.querySelector('.gallery-previous').addEventListener('click', () => showProject(selected - 1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => showProject(selected + 1));
  gallery.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Tab') {
      const controls = [...gallery.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if ((event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showProject(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  gallery.addEventListener('click', event => {
    if (event.target !== gallery) return;
    const bounds = gallery.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) gallery.close();
  });
  gallery.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    trigger?.focus({ preventScroll: true });
  });
})();
