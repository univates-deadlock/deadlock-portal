'use strict';

(() => {
  const gallery = document.querySelector('#project-gallery');
  const triggers = [...document.querySelectorAll('.project-card__preview')];
  if (!gallery || typeof gallery.showModal !== 'function' || !triggers.length) return;

  const image = gallery.querySelector('.project-gallery__image');
  const title = gallery.querySelector('.project-gallery__title');
  const count = gallery.querySelector('.project-gallery__count');
  const closeButton = gallery.querySelector('.project-gallery__control--close');
  const previousButton = gallery.querySelector('.project-gallery__control--prev');
  const nextButton = gallery.querySelector('.project-gallery__control--next');

  let selected = 0;
  let activeTrigger = null;

  function showProject(index) {
    selected = (index + triggers.length) % triggers.length;
    const link = triggers[selected];
    const previewImage = link.querySelector('.project-card__image');
    const cardTitle = link.closest('.project-card')?.querySelector('.project-card__title');

    image.src = link.href;
    image.alt = previewImage ? previewImage.alt : '';
    title.textContent = cardTitle ? cardTitle.textContent.replace(/\s+/g, ' ').trim() : '';
    count.textContent = `${selected + 1} de ${triggers.length}`;
  }

  triggers.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'project-gallery');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      activeTrigger = link;
      showProject(index);
      gallery.showModal();
      document.documentElement.classList.add('is-scroll-locked');
    });
  });

  closeButton?.addEventListener('click', () => gallery.close());
  previousButton?.addEventListener('click', () => showProject(selected - 1));
  nextButton?.addEventListener('click', () => showProject(selected + 1));

  gallery.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === 'Tab') {
      const controls = [...gallery.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)
      ) {
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
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      gallery.close();
    }
  });

  gallery.addEventListener('close', () => {
    document.documentElement.classList.remove('is-scroll-locked');
    activeTrigger?.focus({ preventScroll: true });
  });
})();
