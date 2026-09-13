/* =========================================================
   RITHIKA S — FRIENDSHIP BIRTHDAY CELEBRATION
   main.js — Voice Birthday Wish & 3D Interactive Features
   ========================================================= */

(function () {
  'use strict';

  // ── 1. Heavy Hero Paper Rain Confetti Generator ────────────
  const canvas = document.getElementById('confetti-canvas');
  let ctx, width, height, particles = [];

  function initCanvas() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 3 + 1.8,
        size: Math.random() * 9 + 5,
        color: ['#ff4b82', '#e11d48', '#ff69b4', '#f43f5e', '#ffb6c1', '#ffffff', '#ffcc00'][Math.floor(Math.random() * 7)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 6 - 3
      });
    }

    animateConfetti();
  }

  function resizeCanvas() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;

    particles.forEach((p) => {
      p.y += p.vy;
      p.x += Math.sin(p.y * 0.02) + p.vx;
      p.rotation += p.rotSpeed;

      const particleScreenY = p.y - scrollY;
      let alpha = 1;
      if (particleScreenY > height * 0.85 || scrollY > 350) {
        alpha = 0.25;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      if (p.y > height + scrollY + 40) {
        p.y = scrollY - 20;
        p.x = Math.random() * width;
      }
    });

    requestAnimationFrame(animateConfetti);
  // ── 2. Hero Voice Player Autoplay Logic ────────────────────
  let hasVoicePlayed = false;

  function fallbackVoicePlay() {
    try {
      const audio = new Audio('assets/audio/whatsapp-voice-wish.mp4');
      audio.volume = 1.0;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          hasVoicePlayed = true;
        }).catch(() => {
          hasVoicePlayed = false;
        });
      }
    } catch(e) {
      hasVoicePlayed = false;
    }
  }

  window.playVoiceWish = function() {
    if (hasVoicePlayed) return;

    const voiceAudio = document.getElementById('gokul-voice-audio');
    if (voiceAudio) {
      voiceAudio.volume = 1.0;
      voiceAudio.muted = false;
      const playPromise = voiceAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hasVoicePlayed = true;
        }).catch((err) => {
          hasVoicePlayed = false;
        });
      } else {
        hasVoicePlayed = true;
      }
    } else {
      fallbackVoicePlay();
    }
  };

  const interactionEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'mousemove', 'scroll', 'keydown'];
  interactionEvents.forEach(evt => {
    window.addEventListener(evt, () => window.playVoiceWish(), { passive: true });
    document.addEventListener(evt, () => window.playVoiceWish(), { passive: true });
  });

  window.playVoiceWish();
  window.addEventListener('load', () => window.playVoiceWish());
  document.addEventListener('DOMContentLoaded', () => window.playVoiceWish());
  setTimeout(() => window.playVoiceWish(), 200);
  setTimeout(() => window.playVoiceWish(), 800);

  // ── 3. 5-Photo Shuffling Card Stack Logic ─────────────────
  const photoStack = document.getElementById('photo-stack');
  if (photoStack) {
    const cards = Array.from(photoStack.querySelectorAll('.shuffle-photo-card'));
    const totalCards = cards.length;
    const classes = ['active', 'next-1', 'next-2', 'next-3', 'next-4'];
    let currentIndex = 0;

    function shuffleCards() {
      cards.forEach((card, index) => {
        card.classList.remove('active', 'next-1', 'next-2', 'next-3', 'next-4');
        const pos = (index - currentIndex + totalCards) % totalCards;
        if (pos < classes.length) {
          card.classList.add(classes[pos]);
        }
      });
      currentIndex = (currentIndex + 1) % totalCards;
    }

    // Auto shuffle every 2.5 seconds
    shuffleCards();
    setInterval(shuffleCards, 2500);

    // Manual shuffle on click
    photoStack.addEventListener('click', shuffleCards);
  }

  // ── 4. Strict Interactive Folder Opening & Closing ────────
  const foldersView      = document.getElementById('folders-view');
  const memoriesGrid     = document.getElementById('memories-grid');
  const activeFolderBar  = document.getElementById('active-folder-bar');
  const currentHeading   = document.getElementById('current-folder-heading');
  const backToFoldersBtn = document.getElementById('back-to-folders-btn');

  const folderNames = {
    'cute': '💖 Cute Moments Folder',
    'calls': '📞 Call Chronicles Folder',
    'videos': '🎤 Her Voice Folder',
    'fun': '😂 Fun Folder'
  };

  function openFolderCategory(folderKey) {
    if (!folderKey) return;

    if (foldersView) {
      foldersView.classList.add('hidden');
      foldersView.style.display = 'none';
    }

    if (activeFolderBar) {
      activeFolderBar.classList.remove('hidden');
      activeFolderBar.style.display = 'flex';
    }

    if (memoriesGrid) {
      memoriesGrid.classList.remove('hidden');
      memoriesGrid.style.display = 'grid';
    }

    if (currentHeading) {
      currentHeading.textContent = folderNames[folderKey] || '📁 Folder View';
    }

    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
      const cardFolder = card.getAttribute('data-folder');
      if (cardFolder === folderKey) {
        card.classList.remove('hidden-folder');
        card.style.display = 'block';
      } else {
        card.classList.add('hidden-folder');
        card.style.display = 'none';
      }
    });

    if (activeFolderBar) {
      activeFolderBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeFolderView() {
    if (memoriesGrid) {
      memoriesGrid.classList.add('hidden');
      memoriesGrid.style.display = 'none';
    }

    if (activeFolderBar) {
      activeFolderBar.classList.add('hidden');
      activeFolderBar.style.display = 'none';
    }

    if (foldersView) {
      foldersView.classList.remove('hidden');
      foldersView.style.display = 'grid';
    }

    if (foldersView) {
      foldersView.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Delegate clicks on foldersView container for 100% click reliability
  if (foldersView) {
    foldersView.addEventListener('click', (e) => {
      const card = e.target.closest('[data-open-folder]');
      if (card) {
        const folderKey = card.getAttribute('data-open-folder');
        openFolderCategory(folderKey);
      }
    });
  }

  if (backToFoldersBtn) {
    backToFoldersBtn.addEventListener('click', closeFolderView);
  }

  // ── 5. Memory Lightbox Modal ──────────────────────────────
  const memoryCards          = document.querySelectorAll('.memory-card');
  const lightboxModal        = document.getElementById('lightbox-modal');
  const lightboxClose        = document.getElementById('lightbox-close');
  const lightboxImg          = document.getElementById('lightbox-img');
  const lightboxVideo        = document.getElementById('lightbox-video');
  const lightboxCaption      = document.getElementById('lightbox-caption');
  const lightboxDownloadLink = document.getElementById('lightbox-download-link');

  function openLightbox(type, src, caption) {
    if (!lightboxModal) return;
    
    lightboxImg.classList.add('hidden');
    lightboxVideo.classList.add('hidden');
    lightboxImg.src = '';
    lightboxVideo.src = '';

    if (type === 'video') {
      lightboxVideo.src = src;
      lightboxVideo.classList.remove('hidden');
    } else {
      lightboxImg.src = src;
      lightboxImg.classList.remove('hidden');
    }

    lightboxCaption.textContent = caption || '';

    if (lightboxDownloadLink && src) {
      lightboxDownloadLink.href = src;
      const fileName = src.substring(src.lastIndexOf('/') + 1);
      lightboxDownloadLink.setAttribute('download', fileName);
    }

    lightboxModal.classList.remove('hidden');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.add('hidden');
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxImg.src = '';
  }

  memoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Prevent opening lightbox if user clicked directly on a download button
      if (e.target.closest('.memory-download-btn')) return;

      const type = card.getAttribute('data-type') || 'image';
      const src = card.getAttribute('data-src');
      const caption = card.getAttribute('data-caption');
      if (src) {
        openLightbox(type, src, caption);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // ── 5. Strict Native Multi-Color Emoji Auto-Wrapper ───────
  function autoWrapEmojis(root = document.body) {
    if (!root) return;
    const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/u;
    const emojiGlobal = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
          const parent = node.parentNode;
          if (!parent) return NodeFilter.FILTER_SKIP;
          if (['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_SKIP;
          if (parent.classList && parent.classList.contains('emoji')) return NodeFilter.FILTER_SKIP;
          return emojiRegex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      }
    );

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const val = node.nodeValue;
      if (!val) return;

      const fragment = document.createDocumentFragment();
      let lastIdx = 0;
      let match;

      while ((match = emojiGlobal.exec(val)) !== null) {
        const emojiStr = match[0];
        const matchIdx = match.index;

        if (matchIdx > lastIdx) {
          fragment.appendChild(document.createTextNode(val.substring(lastIdx, matchIdx)));
        }

        const span = document.createElement('span');
        span.className = 'emoji';
        span.textContent = emojiStr;
        fragment.appendChild(span);

        lastIdx = emojiGlobal.lastIndex;
      }

      if (lastIdx < val.length) {
        fragment.appendChild(document.createTextNode(val.substring(lastIdx)));
      }

      if (node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    autoWrapEmojis();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
    // Autoplay voice blessing in English automatically on load & setup gesture fallback
    autoPlayVoiceWish();
    setupAutoplayGestures();
  });

})();
