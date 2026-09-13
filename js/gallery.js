/* =========================================================
   gallery.js — Lightbox & Media Gallery Interaction
   ========================================================= */

(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxBg = document.getElementById('lightbox-bg');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');

  function openLightbox(type, src, caption) {
    if (!lightbox) return;
    lightbox.classList.remove('hidden');

    if (type === 'video') {
      lightboxImg.classList.add('hidden');
      lightboxVideo.classList.remove('hidden');
      lightboxVideo.src = src;
      lightboxVideo.play().catch(() => {});
    } else {
      lightboxVideo.classList.add('hidden');
      lightboxVideo.pause();
      lightboxImg.classList.remove('hidden');
      lightboxImg.src = src;
    }

    if (lightboxCaption) lightboxCaption.textContent = caption || '';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);

  document.querySelectorAll('.media-video, .card-3d-item').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      const type = card.dataset.type || 'video';
      const caption = card.dataset.caption || '';
      if (src) openLightbox(type, src, caption);
    });
  });

  window.openMediaLightbox = openLightbox;
})();
