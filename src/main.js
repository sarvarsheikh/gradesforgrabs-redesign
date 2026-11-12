import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. PLAYFUL WEB AUDIO SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playDeliBell() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [1046.5, 2093.0, 3135.9];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      const amp = 0.22 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    });
  }

  playSuccessFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const start = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.33);
    });
  }
}

const sound = new SoundFX();

// ==========================================
// 2. VIDEO CINEMA BENTO DATABASE
// ==========================================
const videoDatabase = [
  {
    id: 1,
    title: "Proof That Hard Work Still Wins 🙌",
    category: "turnaround",
    views: "2.8M",
    likes: 142800,
    platform: "TikTok",
    author: "@islandock1",
    thumbnail: "./assets/post-1.jpg",
    link: "https://www.tiktok.com/@islandock1/video/7611573521600253198",
    quote: "Marcus walked into the deli holding his report card with four straight A's. The entire shop paused and clapped for him.",
    description: "Every kid who walks through our doors with honest effort gets celebrated like a champion. Hard work never goes unseen at Zack's.",
    layout: "hero" // 7 cols x 2 rows
  },
  {
    id: 2,
    title: "When 15 Kids Bring Their Report Cards at Once!",
    category: "celebration",
    views: "4.1M",
    likes: 310500,
    platform: "TikTok",
    author: "@islandock1",
    thumbnail: "./assets/post-2.jpg",
    link: "https://www.tiktok.com/@islandock1/video/7503191921909746990",
    quote: "The deli counter turned into graduation day. Over 15 students packed into the shop waving their report cards!",
    description: "When one student wins, the entire block wins. Seeing them encourage each other to study and bring their grades in is what Grades for Grabs is all about.",
    layout: "tall" // 5 cols x 2 rows
  },
  {
    id: 4,
    title: "Island Ock on The Tamron Hall Show",
    category: "press",
    views: "3.4M",
    likes: 215000,
    platform: "National TV",
    author: "Tamron Hall Show",
    thumbnail: "./assets/island-ock-portrait.jpg",
    link: "https://gradesforgrabs.com/island-ock",
    quote: "Tamron Hall invited Island Ock to share the Grades for Grabs movement with millions of households across America.",
    description: "From our corner deli in Staten Island to national television—bringing recognition, scholarships, and dignity to students everywhere.",
    layout: "standard" // 4 cols
  },
  {
    id: 3,
    title: "Elijah’s Certificate of Honor",
    category: "turnaround",
    views: "1.9M",
    likes: 98400,
    platform: "TikTok",
    author: "@islandock1",
    thumbnail: "./assets/post-6.jpg",
    link: "https://www.instagram.com/reel/DaEDeNbgzof/",
    quote: "Elijah didn't bring a traditional report card, but two certificates of character and outstanding effort.",
    description: "Effort comes in many forms. Whether it's straight A's, turning a grade around, or showing integrity in class—we honor it all.",
    layout: "standard" // 4 cols
  },
  {
    id: 5,
    title: "Zack's Finest: The Breakfast of Champions",
    category: "celebration",
    views: "1.6M",
    likes: 87300,
    platform: "TikTok",
    author: "@islandock1",
    thumbnail: "./assets/post-3.jpg",
    link: "https://www.tiktok.com/@islandock1/video/7385508062519397663",
    quote: "Hot pastrami, egg & cheese, and a personalized motivational message written right on the sandwich foil.",
    description: "Before morning exams, kids stop by for energy, high-fives, and a reminder that someone in their neighborhood is rooting for them.",
    layout: "standard" // 4 cols
  }
];

function renderVideoBento(filter = 'all') {
  const container = document.getElementById('video-bento-container');
  if (!container) return;

  const filtered = filter === 'all' 
    ? videoDatabase 
    : videoDatabase.filter(v => v.category === filter);

  container.innerHTML = filtered.map(video => {
    const cardClass = video.layout === 'hero' 
      ? 'video-bento-hero' 
      : video.layout === 'tall' 
      ? 'video-bento-tall' 
      : 'video-bento-standard';

    return `
      <article class="${cardClass} bento-video-item" data-video-id="${video.id}" data-category="${video.category}">
        <div class="bento-media-wrap">
          <img src="${video.thumbnail}" alt="${video.title}" class="bento-media-img" loading="lazy">
          <div style="position: absolute; top: 1rem; left: 1rem; display: flex; gap: 0.5rem; z-index: 2;">
            <span class="badge-pill" style="font-size: 0.68rem; padding: 0.2rem 0.65rem;">
              <span class="badge-dot" style="background: var(--funky-coral);"></span>
              ${video.platform}
            </span>
            <span class="badge-pill badge-pill-yellow" style="font-size: 0.68rem; padding: 0.2rem 0.65rem;">
              ▶ ${video.views}
            </span>
          </div>
          <div class="bento-play-pill" aria-label="Play Reel">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </div>
        </div>

        <div class="bento-card-content">
          <div>
            <h3 class="bento-video-title">${video.title}</h3>
            <p class="bento-video-quote">“${video.quote}”</p>
          </div>
          <div class="bento-card-footer">
            <span class="bento-author-label">${video.author}</span>
            <button class="bento-heart-btn" data-liked="false" data-likes="${video.likes}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span class="likes-num">${(video.likes / 1000).toFixed(1)}k</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Animate bento entrance
  gsap.fromTo('.bento-video-item', 
    { opacity: 0, y: 35, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
  );

  attachBentoEvents();
}

function attachBentoEvents() {
  document.querySelectorAll('.bento-video-item').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.bento-heart-btn')) return;
      const vidId = parseInt(card.dataset.videoId);
      const video = videoDatabase.find(v => v.id === vidId);
      if (video) {
        sound.playPop();
        openModal(video);
      }
    });
  });

  document.querySelectorAll('.bento-heart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playPop();
      const countEl = btn.querySelector('.likes-num');
      const isLiked = btn.dataset.liked === 'true';
      let currentLikes = parseInt(btn.dataset.likes);

      if (!isLiked) {
        btn.dataset.liked = 'true';
        btn.style.color = '#EF4444';
        btn.style.borderColor = '#EF4444';
        btn.dataset.likes = currentLikes + 1;
        countEl.textContent = ((currentLikes + 1) / 1000).toFixed(1) + 'k';
        spawnFloatingHeart(btn);
      } else {
        btn.dataset.liked = 'false';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.dataset.likes = currentLikes - 1;
        countEl.textContent = ((currentLikes - 1) / 1000).toFixed(1) + 'k';
      }
    });
  });
}

function spawnFloatingHeart(parentEl) {
  const heart = document.createElement('div');
  heart.textContent = '❤️';
  heart.style.position = 'fixed';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '999999';
  heart.style.fontSize = '20px';
  const rect = parentEl.getBoundingClientRect();
  heart.style.left = `${rect.left + rect.width / 2}px`;
  heart.style.top = `${rect.top}px`;
  document.body.appendChild(heart);

  gsap.to(heart, {
    y: -45,
    opacity: 0,
    scale: 1.5,
    duration: 0.8,
    ease: 'power2.out',
    onComplete: () => heart.remove()
  });
}

// ==========================================
// 3. VIDEO THEATRE MODAL
// ==========================================
const videoModal = document.getElementById('video-modal');
const modalThumb = document.getElementById('modal-video-thumb');
const modalTitle = document.getElementById('modal-video-title');
const modalQuote = document.getElementById('modal-video-quote');
const modalDesc = document.getElementById('modal-video-desc');
const modalAuthor = document.getElementById('modal-video-author');
const modalViews = document.getElementById('modal-video-views');
const modalLink = document.getElementById('modal-video-link');
const modalConfettiBtn = document.getElementById('modal-celebrate-btn');

function openModal(video) {
  if (!videoModal) return;
  modalThumb.src = video.thumbnail;
  modalThumb.alt = video.title;
  modalTitle.textContent = video.title;
  modalQuote.textContent = `“${video.quote}”`;
  modalDesc.textContent = video.description;
  modalAuthor.textContent = `${video.author} • ${video.platform}`;
  modalViews.textContent = `▶ ${video.views} Views`;
  modalLink.href = video.link;

  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!videoModal) return;
  sound.playPop();
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
}

// ==========================================
// 4. REPORT CARD REWARD SIMULATOR
// ==========================================
const gradesState = {
  math: 'A+',
  english: 'A',
  science: 'B',
  history: 'A+',
  attendance: 'A+'
};

const gradeValues = {
  'A+': 4.0,
  'A': 3.8,
  'B+': 3.3,
  'B': 3.0,
  'Improved': 3.7
};

function calculateReward() {
  const values = Object.values(gradesState).map(g => gradeValues[g] || 3.0);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const effortScore = Math.min(100, Math.round((avg / 4.0) * 100));

  const scoreEl = document.getElementById('sim-effort-score');
  const tierEl = document.getElementById('sim-reward-tier');
  const rewardEl = document.getElementById('sim-reward-desc');

  if (scoreEl) scoreEl.textContent = `${effortScore}/100`;

  let tier = 'HONOR ROLL TIER';
  let rewardText = 'The Island Ock Special Hero Combo + Custom Gold Certificate';

  if (effortScore >= 94) {
    tier = '🌟 DELI LEGEND TIER';
    rewardText = 'Free Custom Pastrami/Turkey Hero + Snack Haul + Gold Ribbon + Entry in Tech Fund';
  } else if (effortScore >= 85) {
    tier = '🏆 GOLD EFFORT TIER';
    rewardText = 'Classic Deli Sandwich Combo + Island Ock Recognition Sticker + Certificate';
  } else {
    tier = '💪 COMMITTED EFFORT TIER';
    rewardText = 'Breakfast Roll & Drink + Encouragement Token + Most Improved Shoutout';
  }

  if (tierEl) tierEl.textContent = tier;
  if (rewardEl) rewardEl.textContent = rewardText;
}

// ==========================================
// 5. AESTHETIC PRESENTATION CURSOR
// ==========================================
function initAestheticCursor() {
  const dot = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');
  if (!dot || !follower || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    if (!isVisible) {
      isVisible = true;
      dot.classList.add('visible');
      follower.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.classList.remove('visible');
    follower.classList.remove('visible');
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;
    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states for elements
  document.querySelectorAll('a, button, .bento-video-item, .accolade-bento-card, .sticker-float').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.classList.contains('bento-video-item')) {
        follower.classList.add('cursor-view');
        follower.textContent = 'PLAY REEL ↗';
      } else if (el.classList.contains('accolade-bento-card')) {
        follower.classList.add('cursor-view');
        follower.textContent = 'INSPECT ↗';
      } else if (el.classList.contains('ring-bell-btn')) {
        follower.classList.add('cursor-hover');
        follower.textContent = 'RING 🔔';
      } else {
        follower.classList.add('cursor-hover');
        follower.textContent = '';
      }
    });

    el.addEventListener('mouseleave', () => {
      follower.classList.remove('cursor-hover');
      follower.classList.remove('cursor-view');
      follower.textContent = '';
    });
  });
}

// ==========================================
// 6. INITIALIZATION & REVEAL ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderVideoBento('all');
  initAestheticCursor();
  calculateReward();

  // Category filter tabs
  document.querySelectorAll('.cinema-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      document.querySelectorAll('.cinema-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      renderVideoBento(cat);
    });
  });

  // Deli Bell buttons
  document.querySelectorAll('.ring-bell-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playDeliBell();
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => btn.style.transform = '', 200);

      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD21E', '#FF5A36', '#00D084', '#6366F1', '#0A0A09']
      });
    });
  });

  // Sound toggle button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      sound.playPop();
      soundToggleBtn.textContent = sound.enabled ? '🔊' : '🔇';
    });
  }

  // Modal Close
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });
  }

  // Modal Celebrate Confetti Button
  if (modalConfettiBtn) {
    modalConfettiBtn.addEventListener('click', () => {
      sound.playSuccessFanfare();
      confetti({
        particleCount: 120,
        spread: 95,
        origin: { y: 0.5 },
        colors: ['#FFD21E', '#FF5A36', '#00D084', '#6366F1', '#0A0A09']
      });
    });
  }

  // Escape key for modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Grade Selector in Simulator
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      const subject = btn.dataset.subject;
      const grade = btn.dataset.grade;
      gradesState[subject] = grade;

      const parentRow = btn.closest('.sim-row');
      parentRow.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      calculateReward();
    });
  });

  // Student name in Simulator
  const studentNameInput = document.getElementById('sim-student-name');
  const certStudentName = document.getElementById('cert-student-name');
  if (studentNameInput && certStudentName) {
    studentNameInput.addEventListener('input', (e) => {
      certStudentName.textContent = e.target.value.trim() || 'Alex Johnson';
    });
  }

  // Claim reward in Simulator
  const claimBtn = document.getElementById('sim-claim-btn');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      sound.playSuccessFanfare();
      confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD21E', '#FF5A36', '#00D084', '#6366F1', '#0A0A09']
      });
    });
  }

  // Accolade Lightbox
  const accoladeModal = document.getElementById('accolade-modal');
  const accoladeModalImg = document.getElementById('accolade-modal-img');
  const accoladeCloseBtn = document.getElementById('accolade-close-btn');

  document.querySelectorAll('.accolade-bento-card').forEach(card => {
    card.addEventListener('click', () => {
      sound.playPop();
      const img = card.querySelector('img');
      if (img && accoladeModal && accoladeModalImg) {
        accoladeModalImg.src = img.src;
        accoladeModalImg.alt = img.alt;
        accoladeModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (accoladeCloseBtn && accoladeModal) {
    accoladeCloseBtn.addEventListener('click', () => {
      sound.playPop();
      accoladeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
    accoladeModal.addEventListener('click', (e) => {
      if (e.target === accoladeModal) {
        sound.playPop();
        accoladeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Role Switcher in Involvement
  const roleTabs = document.querySelectorAll('.involve-tab-btn');
  const roleSelect = document.getElementById('form-role-select');
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playPop();
      roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const role = tab.dataset.role;
      if (roleSelect) roleSelect.value = role;
    });
  });

  // Involvement Form Submit
  const involveForm = document.getElementById('involve-form');
  if (involveForm) {
    involveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playSuccessFanfare();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFD21E', '#FF5A36', '#00D084', '#6366F1', '#0A0A09']
      });
      const submitBtn = involveForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '✓ Message Sent! Welcome to the Movement';
        submitBtn.style.background = '#00D084';
        submitBtn.style.color = '#FFFFFF';
        submitBtn.style.borderColor = '#00D084';
      }
    });
  }

  // Audio snippet in Meet Island Ock
  const audioSampleBtn = document.getElementById('ock-audio-btn');
  if (audioSampleBtn) {
    audioSampleBtn.addEventListener('click', () => {
      sound.playDeliBell();
      audioSampleBtn.classList.toggle('playing');
      const isPlaying = audioSampleBtn.classList.contains('playing');
      audioSampleBtn.innerHTML = isPlaying ? '⏸' : '▶';
    });
  }

  // Sticky nav hide/show
  let lastScrollY = window.scrollY;
  const siteNav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (siteNav) {
      if (currentScrollY > 160 && currentScrollY > lastScrollY) {
        siteNav.style.transform = 'translate(-50%, -120%)';
      } else {
        siteNav.style.transform = 'translate(-50%, 0)';
      }
    }
    lastScrollY = currentScrollY;
  });

  // ==========================================
  // GSAP REVEAL ANIMATIONS FOR EACH SECTION
  // ==========================================
  
  // Hero Elements Staggered Reveal
  gsap.from('.hero-reveal', {
    y: 35,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out'
  });

  // Bento Metrics Staggered Cascade
  gsap.from('.bento-cell-clean', {
    scrollTrigger: {
      trigger: '.bento-metrics-grid',
      start: 'top 85%'
    },
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Metric Numbers Count-up
  document.querySelectorAll('.bento-metric-counter').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const obj = { val: 0 };
    gsap.to(obj, {
      scrollTrigger: {
        trigger: '.metrics-section',
        start: 'top 85%'
      },
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        counter.textContent = Math.round(obj.val);
      }
    });
  });

  // Editorial Section Reveal
  gsap.from('.editorial-reveal', {
    scrollTrigger: {
      trigger: '.editorial-section',
      start: 'top 80%'
    },
    y: 35,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Pillars Bento Cards Stagger
  gsap.from('.pillar-bento-card', {
    scrollTrigger: {
      trigger: '.pillars-grid',
      start: 'top 80%'
    },
    y: 45,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Founder Section Reveal
  gsap.from('.founder-reveal', {
    scrollTrigger: {
      trigger: '.founder-section',
      start: 'top 80%'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Accolades Grid Stagger
  gsap.from('.accolade-bento-card', {
    scrollTrigger: {
      trigger: '.accolades-bento-grid',
      start: 'top 85%'
    },
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out'
  });
});
