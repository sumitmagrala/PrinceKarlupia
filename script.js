/* ==========================================================================
   HAPPY BIRTHDAY DR. PRINCE KARLUPIA - INTERACTIVE SCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- STATE & AUDIO SYNTHESIZER ---
    let audioCtx = null;
    let isPlayingMusic = false;
    let musicInterval = null;

    // Initialize Web Audio Context on user interaction
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play a synthesizer note
    function playTone(freq, type, duration, delay = 0) {
        if (!audioCtx) return;
        setTimeout(() => {
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) {
                console.log(e);
            }
        }, delay * 1000);
    }

    // Play Happy Birthday Melody using Web Audio API
    function playHappyBirthdaySong() {
        if (isPlayingMusic) {
            stopHappyBirthdaySong();
            return;
        }

        initAudio();
        isPlayingMusic = true;
        document.getElementById('music-toggle').classList.add('playing');
        document.querySelector('#music-toggle .btn-tooltip').textContent = 'Pause Song 🎵';

        // Happy Birthday notes (frequency in Hz and duration)
        const notes = [
            { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.2 },
            { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 },
            { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 0.8 },
            { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.5 }
        ];

        let currentTime = 0;
        notes.forEach(note => {
            playTone(note.f, 'triangle', note.d, currentTime);
            currentTime += note.d + 0.1;
        });

        // Loop song after completion
        musicInterval = setTimeout(() => {
            if (isPlayingMusic) {
                isPlayingMusic = false;
                playHappyBirthdaySong();
            }
        }, (currentTime + 1) * 1000);
    }

    function stopHappyBirthdaySong() {
        isPlayingMusic = false;
        if (musicInterval) clearTimeout(musicInterval);
        document.getElementById('music-toggle').classList.remove('playing');
        document.querySelector('#music-toggle .btn-tooltip').textContent = 'Play Song 🎵';
    }

    // Play Sound Effects
    function playHeartbeatSFX() {
        initAudio();
        playTone(60, 'sine', 0.15, 0);
        playTone(50, 'sine', 0.2, 0.15);
    }

    function playPopSFX() {
        initAudio();
        playTone(400, 'sine', 0.08, 0);
        playTone(800, 'sine', 0.1, 0.05);
    }

    function playConfettiSFX() {
        initAudio();
        [523, 659, 783, 1046].forEach((f, i) => playTone(f, 'sine', 0.3, i * 0.08));
    }

    // --- CONTROLS LISTENERS ---
    document.getElementById('music-toggle').addEventListener('click', () => {
        playHappyBirthdaySong();
    });

    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    });


    // --- STAGE 1: ECG CANVAS ANIMATION & UNLOCK ---
    const ecgCanvas = document.getElementById('ecg-canvas');
    const ecgCtx = ecgCanvas.getContext('2d');
    let ecgX = 0;
    let ecgPoints = [];

    function resizeEcg() {
        if (!ecgCanvas) return;
        ecgCanvas.width = ecgCanvas.offsetWidth;
        ecgCanvas.height = ecgCanvas.offsetHeight;
    }
    window.addEventListener('resize', resizeEcg);
    resizeEcg();

    function drawECG() {
        if (!ecgCanvas) return;
        const w = ecgCanvas.width;
        const h = ecgCanvas.height;
        const centerY = h / 2;

        ecgCtx.fillStyle = 'rgba(9, 19, 29, 0.15)';
        ecgCtx.fillRect(0, 0, w, h);

        ecgCtx.lineWidth = 2.5;
        ecgCtx.strokeStyle = '#00d2fc';
        ecgCtx.shadowBlur = 10;
        ecgCtx.shadowColor = '#00d2fc';

        ecgCtx.beginPath();
        
        let y = centerY;
        // Simulate ECG heartbeat peak every ~100px
        const cycle = ecgX % 140;
        if (cycle > 40 && cycle < 46) y = centerY - 15; // P wave
        else if (cycle >= 46 && cycle < 50) y = centerY + 10; // Q wave
        else if (cycle >= 50 && cycle < 60) y = centerY - 45; // R wave (big spike)
        else if (cycle >= 60 && cycle < 66) y = centerY + 25; // S wave
        else if (cycle >= 75 && cycle < 85) y = centerY - 12; // T wave
        else y = centerY + (Math.random() * 2 - 1);

        ecgPoints.push({ x: ecgX, y: y });
        if (ecgPoints.length > w / 2) ecgPoints.shift();

        for (let i = 0; i < ecgPoints.length - 1; i++) {
            const p1 = ecgPoints[i];
            const p2 = ecgPoints[i + 1];
            ecgCtx.moveTo(p1.x % w, p1.y);
            ecgCtx.lineTo(p2.x % w, p2.y);
        }
        ecgCtx.stroke();

        ecgX += 3;
        if (cycle === 52) playHeartbeatSFX(); // Thump sound on R wave peak

        requestAnimationFrame(drawECG);
    }
    drawECG();

    // Unlock Button Event
    document.getElementById('btn-start-surprise').addEventListener('click', () => {
        playPopSFX();
        document.getElementById('stage-intro').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Auto-play song if allowed
        setTimeout(() => playHappyBirthdaySong(), 500);
        // Trigger initial celebratory confetti burst
        launchConfetti();
    });


    // --- BACKGROUND FLOATING PARTICLES CANVAS ---
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');
    let particles = [];

    function resizeBg() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeBg);
    resizeBg();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * bgCanvas.width;
            this.y = bgCanvas.height + Math.random() * 100;
            this.size = Math.random() * 14 + 10;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.symbol = ['❤️', '🩺', '✨', '💊', '🎂', '💖'][Math.floor(Math.random() * 6)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -30) this.reset();
        }

        draw() {
            bgCtx.globalAlpha = this.opacity;
            bgCtx.font = `${this.size}px sans-serif`;
            bgCtx.fillText(this.symbol, this.x, this.y);
        }
    }

    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }

    function animateBgParticles() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateBgParticles);
    }
    animateBgParticles();


    // --- PHYSICS CONFETTI CANVAS ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiPieces = [];

    function resizeConfetti() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfetti);
    resizeConfetti();

    class ConfettiPiece {
        constructor(x, y) {
            this.x = x || Math.random() * confettiCanvas.width;
            this.y = y || Math.random() * confettiCanvas.height * 0.3;
            this.size = Math.random() * 10 + 6;
            this.color = ['#00c9a7', '#00d2fc', '#ff5e7e', '#ffc75f', '#845ec2', '#ffffff'][Math.floor(Math.random() * 6)];
            this.vx = (Math.random() - 0.5) * 12;
            this.vy = Math.random() * -10 - 4;
            this.gravity = 0.3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
        }

        update() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.rotation += this.rotSpeed;
            this.opacity -= 0.008;
        }

        draw() {
            if (this.opacity <= 0) return;
            confettiCtx.save();
            confettiCtx.globalAlpha = this.opacity;
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = this.color;
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    function launchConfetti() {
        playConfettiSFX();
        for (let i = 0; i < 120; i++) {
            confettiPieces.push(new ConfettiPiece(window.innerWidth / 2, window.innerHeight / 2));
        }
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiPieces = confettiPieces.filter(p => p.opacity > 0);
        confettiPieces.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateConfetti);
    }
    animateConfetti();


    // --- SECTION 2: CANDLE BLOWING LOGIC ---
    const blowBtn = document.getElementById('btn-blow-candle');
    const candles = document.querySelectorAll('.candle');
    const wishBanner = document.getElementById('wish-message');

    blowBtn.addEventListener('click', () => {
        candles.forEach(c => c.classList.add('blown'));
        wishBanner.classList.remove('hidden');
        launchConfetti();
    });

    candles.forEach(c => {
        c.addEventListener('click', () => {
            c.classList.add('blown');
            playPopSFX();
            // If all candles blown
            const remaining = document.querySelectorAll('.candle:not(.blown)');
            if (remaining.length === 0) {
                wishBanner.classList.remove('hidden');
                launchConfetti();
            }
        });
    });


    // --- SECTION 3: SMART PHOTO GALLERY LOADER ---
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Candidates for images provided by user or saved locally
    const imageList = [
        { src: '1.jpg', caption: 'Dr. Prince Karlupia 🩺', fallback: 'doctor_celebration.jpg' },
        { src: '2.jpg', caption: 'Healing & Smiling ✨', fallback: 'doctor_birthday.jpg' },
        { src: '3.jpg', caption: 'Royal Doctor Vibes 👑', fallback: 'demo1.jpg' },
        { src: '4.jpg', caption: 'Moments of Joy 🎉', fallback: 'demo2.jpg' },
        { src: '5.jpg', caption: 'Special Birthday Memories 💖', fallback: 'medical_heart.jpg' },
        { src: 'doctor_birthday.jpg', caption: 'Happy Birthday Doctor! 🎂', fallback: 'doctor_celebration.jpg' },
        { src: 'demo1.jpg', caption: 'Dr. Prince in Action 🩺', fallback: 'doctor_celebration.jpg' },
        { src: 'demo2.jpg', caption: 'Unforgettable Smiles 😄', fallback: 'doctor_birthday.jpg' }
    ];

    // Filter duplicates and render polaroid cards
    const renderGallery = () => {
        galleryGrid.innerHTML = '';
        
        imageList.forEach((item, index) => {
            const rot = (Math.random() * 8 - 4).toFixed(1);
            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.style.setProperty('--rotation', rot);

            card.innerHTML = `
                <div class="tape-corner"></div>
                <div class="polaroid-img-wrapper">
                    <img src="${item.src}" alt="${item.caption}" loading="lazy">
                </div>
                <div class="polaroid-caption">${item.caption}</div>
            `;

            const img = card.querySelector('img');
            img.onerror = () => {
                // If primary src (e.g. 1.jpg) fails to load, use fallback!
                if (item.fallback && img.src.indexOf(item.fallback) === -1) {
                    img.src = item.fallback;
                } else {
                    // Hide card if both fail
                    card.style.display = 'none';
                }
            };

            // Click to open Lightbox
            card.addEventListener('click', () => {
                openLightbox(img.src, item.caption);
            });

            galleryGrid.appendChild(card);
        });
    };

    renderGallery();


    // --- LIGHTBOX MODAL ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');

    function openLightbox(src, caption) {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.remove('hidden');
    }

    lightboxClose.addEventListener('click', () => lightboxModal.classList.add('hidden'));
    lightboxModal.querySelector('.modal-backdrop').addEventListener('click', () => lightboxModal.classList.add('hidden'));


    // --- SECTION 4: HAPPINESS PILLS MODAL MESSAGES ---
    const pillMessages = {
        '1': {
            title: 'Dose #1: 100% Smile Guarantee 😃',
            icon: '<i class="fa-solid fa-heart text-pink"></i>',
            text: 'Your kindness and warm smile have a 100% proven cure rate for bad days! May your own day be filled with infinite reasons to laugh and smile.'
        },
        '2': {
            title: 'Dose #2: Zero Work Stress 💊',
            icon: '<i class="fa-solid fa-prescription text-teal"></i>',
            text: 'Official Doctor Order: Today you are strictly forbidden to worry about hospital shifts, patient files, or medical alarms. Time to relax and enjoy your birthday!'
        },
        '3': {
            title: 'Dose #3: Stethoscope of Joy 🩺',
            icon: '<i class="fa-solid fa-stethoscope text-amber"></i>',
            text: 'May your stethoscope always hear good news, your pulse stay steady with excitement, and your heart stay overflowing with love.'
        },
        '4': {
            title: 'Dose #4: Royal Treatment 👑',
            icon: '<i class="fa-solid fa-crown text-amber"></i>',
            text: 'Happy Birthday Prince! You aren\'t just a great doctor, you are royalty to everyone who knows you. Enjoy your royal day!'
        },
        '5': {
            title: 'Dose #5: Infinite Health & Success 🌟',
            icon: '<i class="fa-solid fa-award text-teal"></i>',
            text: 'Here\'s to a fantastic new year of groundbreaking medical milestones, brilliant achievements, and abundant happiness!'
        },
        '6': {
            title: 'Dose #6: Birthday Cake Overdose 🎂',
            icon: '<i class="fa-solid fa-cake-candles text-pink"></i>',
            text: 'Side effects of this dose include: extreme happiness, sweet cake cravings, and an abundance of warm birthday wishes!'
        }
    };

    const pillModal = document.getElementById('pill-modal');
    const modalTitle = document.getElementById('modal-pill-title');
    const modalIcon = document.getElementById('modal-pill-icon');
    const modalContent = document.getElementById('modal-pill-content');
    const pillCards = document.querySelectorAll('.pill-card');

    pillCards.forEach(pill => {
        pill.addEventListener('click', () => {
            playPopSFX();
            const id = pill.getAttribute('data-pill');
            const data = pillMessages[id];

            modalTitle.textContent = data.title;
            modalIcon.innerHTML = data.icon;
            modalContent.textContent = data.text;

            pillModal.classList.remove('hidden');
            launchConfetti();
        });
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => pillModal.classList.add('hidden'));
    document.getElementById('modal-ok-btn').addEventListener('click', () => pillModal.classList.add('hidden'));
    pillModal.querySelector('.modal-backdrop').addEventListener('click', () => pillModal.classList.add('hidden'));


    // --- SECTION 5: WISH BOARD SUBMISSION ---
    const wishForm = document.getElementById('wish-form');
    const pinnedWishesGrid = document.getElementById('pinned-wishes');

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playPopSFX();

        const name = document.getElementById('wish-name').value.trim();
        const icon = document.getElementById('wish-icon').value;
        const text = document.getElementById('wish-text').value.trim();

        if (!name || !text) return;

        const colorClasses = ['note-color-1', 'note-color-2', 'note-color-3', 'note-color-4'];
        const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
        const rot = (Math.random() * 10 - 5).toFixed(1);

        const newNote = document.createElement('div');
        newNote.className = `wish-note ${randomColor}`;
        newNote.style.setProperty('--rotation', rot);

        newNote.innerHTML = `
            <div class="pin"></div>
            <div class="note-header">
                <span class="note-icon">${icon}</span>
                <strong>${name}</strong>
            </div>
            <p>"${text}"</p>
            <small>Pinned just now ✨</small>
        `;

        pinnedWishesGrid.prepend(newNote);
        wishForm.reset();
        launchConfetti();
    });

});
