/* ==========================================================================
   CUTE BIRTHDAY SURPRISE WEBSITE - MOBILE & TOUCH OPTIMIZED JS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. WEB AUDIO SYNTHESIZER (HAPPY BIRTHDAY MELODY)
     ------------------------------------------------------------------------ */
  class BirthdayAudio {
    constructor() {
      this.audioCtx = null;
      this.isPlaying = false;
      this.noteTimeout = null;
      
      this.notes = [
        { note: 261.63, duration: 300 }, // C4
        { note: 261.63, duration: 300 }, // C4
        { note: 293.66, duration: 600 }, // D4
        { note: 261.63, duration: 600 }, // C4
        { note: 349.23, duration: 600 }, // F4
        { note: 329.63, duration: 1000 },// E4

        { note: 261.63, duration: 300 }, // C4
        { note: 261.63, duration: 300 }, // C4
        { note: 293.66, duration: 600 }, // D4
        { note: 261.63, duration: 600 }, // C4
        { note: 392.00, duration: 600 }, // G4
        { note: 349.23, duration: 1000 },// F4

        { note: 261.63, duration: 300 }, // C4
        { note: 261.63, duration: 300 }, // C4
        { note: 523.25, duration: 600 }, // C5
        { note: 440.00, duration: 600 }, // A4
        { note: 349.23, duration: 600 }, // F4
        { note: 329.63, duration: 600 }, // E4
        { note: 293.66, duration: 800 }, // D4

        { note: 466.16, duration: 300 }, // Bb4
        { note: 466.16, duration: 300 }, // Bb4
        { note: 440.00, duration: 600 }, // A4
        { note: 349.23, duration: 600 }, // F4
        { note: 392.00, duration: 600 }, // G4
        { note: 349.23, duration: 1200 } // F4
      ];
      this.currentIndex = 0;
    }

    init() {
      try {
        if (!this.audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioCtx = new AudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
      } catch (err) {
        console.log('Audio init prevented:', err);
      }
    }

    playNote(freq, duration) {
      if (!this.audioCtx || !this.isPlaying) return;

      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (duration / 1000) * 0.9);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + duration / 1000);
      } catch (e) {
        console.log('Error playing note:', e);
      }
    }

    startMelody() {
      this.init();
      this.isPlaying = true;
      this.currentIndex = 0;
      this.step();
    }

    step() {
      if (!this.isPlaying) return;

      const current = this.notes[this.currentIndex];
      this.playNote(current.note, current.duration);

      this.currentIndex = (this.currentIndex + 1) % this.notes.length;
      
      const gap = current.duration + 50;
      this.noteTimeout = setTimeout(() => this.step(), gap);
    }

    stop() {
      this.isPlaying = false;
      if (this.noteTimeout) {
        clearTimeout(this.noteTimeout);
      }
    }

    playChime() {
      this.init();
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
          try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.5);
          } catch (e) {}
        }, idx * 100);
      });
    }
  }

  const bdayAudio = new BirthdayAudio();

  // Audio Toggle Button
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const toggleMusic = (e) => {
    e.stopPropagation();
    bdayAudio.init();
    if (bdayAudio.isPlaying) {
      bdayAudio.stop();
      musicToggleBtn.classList.remove('playing');
    } else {
      bdayAudio.startMelody();
      musicToggleBtn.classList.add('playing');
    }
  };

  musicToggleBtn.addEventListener('click', toggleMusic);


  /* ------------------------------------------------------------------------
     2. CANVAS CONFETTI SYSTEM
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const confettiPieces = [];
  const colors = ['#FF477E', '#FFB703', '#FF85A1', '#B5838D', '#E8D7FF', '#FF9F1C', '#00F5D4'];

  class Confetti {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : -20;
      this.size = Math.random() * 7 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 3.5 + 1.5;
      this.speedX = Math.random() * 3 - 1.5;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 5 - 2.5;
      this.shape = Math.random() > 0.3 ? 'circle' : 'rect';
      this.opacity = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.02) + this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y > height + 20) {
        this.opacity = 0;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function launchConfettiBurst(count = 80, originX = width / 2, originY = height / 3) {
    for (let i = 0; i < count; i++) {
      const p = new Confetti(originX, originY);
      p.speedX = (Math.random() - 0.5) * 12;
      p.speedY = (Math.random() - 0.7) * 12;
      confettiPieces.push(p);
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, width, height);

    for (let i = confettiPieces.length - 1; i >= 0; i--) {
      const p = confettiPieces[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        confettiPieces.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();


  /* ------------------------------------------------------------------------
     3. INTRO GIFT UNBOXING INTERACTION (MOBILE TOUCH SUPPORT)
     ------------------------------------------------------------------------ */
  const introScreen = document.getElementById('intro-screen');
  const giftBox = document.getElementById('gift-box');
  const giftContainer = document.querySelector('.gift-container');
  const mainContent = document.getElementById('main-content');
  let isOpened = false;

  function openGift(e) {
    if (isOpened) return;
    isOpened = true;

    // Direct touch gesture initializes AudioContext on Mobile iOS/Android
    bdayAudio.init();
    bdayAudio.playChime();

    giftBox.classList.add('open');

    // Calculate center coordinates
    const rect = giftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    launchConfettiBurst(120, centerX, centerY);

    // Auto-start music
    setTimeout(() => {
      bdayAudio.startMelody();
      musicToggleBtn.classList.add('playing');
    }, 300);

    // Smooth transition
    setTimeout(() => {
      introScreen.classList.add('fade-out');
      mainContent.classList.remove('hidden');
      
      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 700);
    }, 1000);
  }

  giftContainer.addEventListener('click', openGift);


  /* ------------------------------------------------------------------------
     4. INTERACTIVE CAKE & CANDLE BLOWING
     ------------------------------------------------------------------------ */
  const candles = document.querySelectorAll('.candle');
  const blowBtn = document.getElementById('blow-candles-btn');
  const wishCard = document.getElementById('wish-unlocked-card');
  const rekindleBtn = document.getElementById('rekindle-btn');
  let blownCount = 0;

  function extinguishCandle(candle) {
    if (!candle.classList.contains('extinguished')) {
      candle.classList.add('extinguished');
      blownCount++;

      bdayAudio.playChime();

      if (blownCount === candles.length) {
        onAllCandlesBlown();
      }
    }
  }

  candles.forEach(candle => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      extinguishCandle(candle);
    });
  });

  blowBtn.addEventListener('click', () => {
    candles.forEach(candle => extinguishCandle(candle));
  });

  function onAllCandlesBlown() {
    launchConfettiBurst(180, width / 2, height / 2);
    blowBtn.style.display = 'none';
    wishCard.classList.remove('hidden-wish');
  }

  rekindleBtn.addEventListener('click', () => {
    candles.forEach(candle => candle.classList.remove('extinguished'));
    blownCount = 0;
    wishCard.classList.add('hidden-wish');
    blowBtn.style.display = 'inline-flex';
  });


  /* ------------------------------------------------------------------------
     5. POLAROID GALLERY & LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  const polaroids = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const lightboxLikeBtn = document.getElementById('lightbox-like-btn');
  const likeCountSpan = document.getElementById('like-count');

  polaroids.forEach(card => {
    const heartBtn = card.querySelector('.heart-btn');
    
    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      heartBtn.classList.toggle('liked');
      const icon = heartBtn.querySelector('i');
      if (heartBtn.classList.contains('liked')) {
        icon.className = 'fas fa-heart text-pink';
        const rect = heartBtn.getBoundingClientRect();
        launchConfettiBurst(20, rect.left, rect.top);
      } else {
        icon.className = 'far fa-heart';
      }
    });

    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      const sub = card.getAttribute('data-sub');

      lightboxImg.src = imgSrc;
      lightboxTitle.textContent = caption;
      lightboxDesc.textContent = sub;
      likeCountSpan.textContent = Math.floor(Math.random() * 15) + 8;

      lightboxModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  lightboxLikeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    let currentLikes = parseInt(likeCountSpan.textContent);
    likeCountSpan.textContent = currentLikes + 1;
    bdayAudio.playChime();
    launchConfettiBurst(25, window.innerWidth / 2, window.innerHeight / 2);
  });


  /* ------------------------------------------------------------------------
     6. FLIP CARDS INTERACTION
     ------------------------------------------------------------------------ */
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (card.classList.contains('flipped')) {
        bdayAudio.playChime();
      }
    });
  });


  /* ------------------------------------------------------------------------
     7. ENVELOPE / LETTER UNBOXING
     ------------------------------------------------------------------------ */
  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
    if (envelope.classList.contains('open')) {
      bdayAudio.playChime();
      const rect = envelope.getBoundingClientRect();
      launchConfettiBurst(50, rect.left + rect.width / 2, rect.top);
    }
  });


  /* ------------------------------------------------------------------------
     8. FOOTER CELEBRATION BUTTON
     ------------------------------------------------------------------------ */
  const footerBtn = document.getElementById('footer-celebrate-btn');
  footerBtn.addEventListener('click', () => {
    launchConfettiBurst(250, width / 2, height / 2);
    bdayAudio.playChime();
  });

});
