/**
 * IRONPULSE ELITE - Interactive Logic & Micro-animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Web Audio API High-Tech Sound FX Synthesizer
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playUiSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx || audioCtx.state === 'suspended') {
        audioCtx?.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'beep') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'neural') {
        // Deep aggressive adrenaline bass drop + treble strike
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      // Audio not permitted or unsupported
    }
  }

  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        audioToggleBtn.classList.add('active');
        audioToggleBtn.querySelector('.audio-label').textContent = 'FX ON';
        audioToggleBtn.querySelector('.audio-icon').textContent = '🔊';
        initAudio();
        playUiSound('beep');
        showToast('Audio Feedback Enabled');
      } else {
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.querySelector('.audio-label').textContent = 'FX OFF';
        audioToggleBtn.querySelector('.audio-icon').textContent = '🔇';
        showToast('Audio Feedback Muted');
      }
    });
  }

  // =========================================================================
  // 2. Interactive Chalk Dust & Ember Particle Canvas
  // =========================================================================
  const canvas = document.getElementById('heroParticleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 2.8 + 0.8;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.isEmber = Math.random() > 0.65; // 35% glowing red embers, 65% chalk
        this.alpha = Math.random() * 0.6 + 0.2;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 3;
          this.y += (dy / dist) * force * 3;
        }

        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isEmber) {
          ctx.fillStyle = `rgba(255, 42, 58, ${this.alpha})`;
          ctx.shadowColor = 'rgba(255, 42, 58, 0.8)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.4})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 55; i++) {
      const p = new Particle();
      p.y = Math.random() * height; // initial spread
      particles.push(p);
    }

    const heroEl = document.getElementById('hero');
    heroEl.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroEl.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // =========================================================================
  // 3. Hero Training Mode Switcher (Hypertrophy / Power / Recovery)
  // =========================================================================
  const modeData = {
    hypertrophy: {
      statusText: 'PROTOCOL 01 ACTIVE • HYPERTROPHY OVERLOAD',
      title: 'FORGED IN <br><span class="text-gradient">MECHANICAL TENSION.</span><br>UNSTOPPABLE.',
      subtitle: 'Welcome to the premier biomechanical athletic facility. Engineered for hypertrophy-obsessed lifters and high-performance humans who refuse mediocrity.',
      m1: '98.4%', l1: 'Fiber Recruitment',
      m2: '164 <small>BPM</small>', l2: 'Heart Rate Peak',
      m3: '75 <small>SEC</small>', l3: 'Rest Interval',
      m4: 'TIER-1', l4: 'Biometric Pass',
      hudVal: '98%', hudLbl: 'PUMP INDEX',
      depthText: 'HYPERTROPHY',
      protocolTag: 'HYPERTROPHY'
    },
    powerlifting: {
      statusText: 'PROTOCOL 02 ACTIVE • ABSOLUTE LOAD MAXIMUM',
      title: 'SHATTER THE BAR.<br><span class="text-gradient">UNBROKEN VELOCITY.</span><br>PURE POWER.',
      subtitle: 'Olympic calibrated power cages, monolifts, and Eleiko competition bars. Engineered for athletes moving colossal tonnage.',
      m1: '585 <small>LBS</small>', l1: 'Max Benchmark',
      m2: '0.82 <small>m/s</small>', l2: 'Bar Path Velocity',
      m3: 'RPE 9.5', l3: 'Neural Load',
      m4: 'COMP-READY', l4: 'Status',
      hudVal: '0.82', hudLbl: 'm/s VELOCITY',
      depthText: 'POWERLIFT',
      protocolTag: 'POWERLIFT'
    },
    recovery: {
      statusText: 'PROTOCOL 03 ACTIVE • CRYOGENIC CELLULAR RESET',
      title: 'SUB-ZERO RECOVERY.<br><span class="text-gradient">CELLULAR RENEWAL.</span><br>ZERO FATIGUE.',
      subtitle: 'Clinical 38°F cold plunges, infrared cedar saunas, and hyperbaric oxygen chambers. Recover at twice the speed of standard training.',
      m1: '38°F', l1: 'Cold Plunge Temp',
      m2: '88 <small>ms</small>', l2: 'HRV Index',
      m3: '99.2%', l3: 'Tissue Oxygen',
      m4: 'OPTIMIZED', l4: 'Biometric Status',
      hudVal: '38°F', hudLbl: 'CRYO TEMP',
      depthText: 'RECOVERY',
      protocolTag: 'BIO-CRYO'
    }
  };

  const modeTabBtns = document.querySelectorAll('.mode-tab-btn');
  const heroDynamicTitle = document.getElementById('heroDynamicTitle');
  const heroDynamicSubtitle = document.getElementById('heroDynamicSubtitle');
  const heroStatusText = document.getElementById('heroStatusText');
  const statMetric1 = document.getElementById('statMetric1');
  const statLabel1 = document.getElementById('statLabel1');
  const statMetric2 = document.getElementById('statMetric2');
  const statLabel2 = document.getElementById('statLabel2');
  const statMetric3 = document.getElementById('statMetric3');
  const statLabel3 = document.getElementById('statLabel3');
  const statMetric4 = document.getElementById('statMetric4');
  const statLabel4 = document.getElementById('statLabel4');
  const hudCenterVal = document.getElementById('hudCenterVal');
  const hudCenterLbl = document.querySelector('.hud-center-lbl');
  const depthTitle = document.getElementById('depthTitle');
  const hudProtocolTag = document.getElementById('hudProtocolTag');

  modeTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modeKey = btn.getAttribute('data-mode');
      const data = modeData[modeKey];
      if (!data) return;

      playUiSound('click');
      modeTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Crossfade transition
      heroDynamicTitle.style.opacity = '0.3';
      heroDynamicSubtitle.style.opacity = '0.3';

      setTimeout(() => {
        heroStatusText.textContent = data.statusText;
        heroDynamicTitle.innerHTML = data.title;
        heroDynamicSubtitle.textContent = data.subtitle;

        statMetric1.innerHTML = data.m1;
        statLabel1.textContent = data.l1;
        statMetric2.innerHTML = data.m2;
        statLabel2.textContent = data.l2;
        statMetric3.innerHTML = data.m3;
        statLabel3.textContent = data.l3;
        statMetric4.innerHTML = data.m4;
        statLabel4.textContent = data.l4;

        if (hudCenterVal) hudCenterVal.textContent = data.hudVal;
        if (hudCenterLbl) hudCenterLbl.textContent = data.hudLbl;
        if (depthTitle) depthTitle.textContent = data.depthText;
        if (hudProtocolTag) hudProtocolTag.textContent = data.protocolTag;

        heroDynamicTitle.style.opacity = '1';
        heroDynamicSubtitle.style.opacity = '1';
      }, 150);
    });
  });

  // =========================================================================
  // 4. "Ignite Neural Drive" Button (Screen Pulse + Audio)
  // =========================================================================
  const btnNeuralDrive = document.getElementById('btnNeuralDrive');
  if (btnNeuralDrive) {
    btnNeuralDrive.addEventListener('click', () => {
      playUiSound('neural');
      document.body.classList.remove('screen-pulse');
      void document.body.offsetWidth; // trigger reflow
      document.body.classList.add('screen-pulse');

      showToast('⚡ NEURAL DRIVE IGNITED • ADRENALINE AT 100%');

      setTimeout(() => {
        document.body.classList.remove('screen-pulse');
      }, 500);
    });
  }

  // =========================================================================
  // 5. Sticky Navbar & Active Section Tracking
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 6. 3D Tilt Card Effect on Hero Visual
  // =========================================================================
  const heroVisualStage = document.getElementById('heroVisualStage');
  const heroCard3D = document.getElementById('heroCard3D');

  if (heroVisualStage && heroCard3D) {
    heroVisualStage.addEventListener('mousemove', (e) => {
      const rect = heroVisualStage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 14;

      heroCard3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisualStage.addEventListener('mouseleave', () => {
      heroCard3D.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
  }

  // Live Simulated Heartbeat Fluctuation
  const bpmCounter = document.getElementById('bpmCounter');
  if (bpmCounter) {
    setInterval(() => {
      const base = 164;
      const jitter = Math.floor(Math.random() * 7) - 3; // -3 to +3
      bpmCounter.textContent = base + jitter;
    }, 2400);
  }

  // =========================================================================
  // 4. Facility Showcase Data & Interactive Switcher
  // =========================================================================
  const facilitiesData = {
    iron: {
      badge: 'ZONE 01 // HEAVY LIFTING',
      tag: 'OLYMPIC & HYPERTROPHY',
      name: 'THE IRON VAULT',
      image: 'assets/images/iron_vault.jpg',
      desc: 'Equipped with calibrated steel competition plates, 12 custom power cages, monolifts, dumbbell racks spanning from 5 lbs to 200 lbs, and dedicated deadlift platforms with noise-damping acoustic rubber.',
      perks: [
        'Eleiko & Rogue Calibrated Competition Barbells',
        'Custom Matte Black Dumbbells up to 200 lbs',
        'Dual Cable Crossover & Jammer Arm Rigs',
        'Chalk Stations & Full Olympic Lifting Platforms'
      ]
    },
    cardio: {
      badge: 'ZONE 02 // SPRINT & CONDITIONING',
      tag: 'METABOLIC & BIOMETRICS',
      name: 'VELOCITY TURF & CARDIO',
      image: 'assets/images/cardio_turf.jpg',
      desc: 'A 60-meter high-density sprint turf track integrated with curved self-powered treadmills, assault bikes, prowler sleds, and real-time biometric telemetry displays for Vo2 max calibration.',
      perks: [
        '60m High-Velocity Sled & Sprint Turf Track',
        'Woodway & Technogym Curved Self-Powered Treadmills',
        'Concept2 Rowers, SkiErgs & Rogue Echo Bikes',
        'Heart Rate Zone HUD Sync with Wearable Monitors'
      ]
    },
    recovery: {
      badge: 'ZONE 03 // CONTRAST RECOVERY',
      tag: 'CLINICAL WELLNESS & HYPERBARIC',
      name: 'CRYO & BIO-RECOVERY SUITE',
      image: 'assets/images/hero_athlete.jpg', // High impact visual
      desc: 'Clinical-grade contrast therapy featuring 38°F dual cold plunge tubs, 180°F infrared cedar saunas, normatec compression therapy boots, and hyperbaric oxygen chambers to accelerate muscular recovery.',
      perks: [
        '38°F Continuous Ozone-Filtered Cold Plunge Tubs',
        'Medical-Grade Infrared Sauna Suites',
        'Normatec Dynamic Air Compression Boots',
        'Theragun Pro Recovery Stations & Foam Rolling Deck'
      ]
    }
  };

  const facilityTabBtns = document.querySelectorAll('.facility-tab-btn');
  const facilityActiveImg = document.getElementById('facilityActiveImg');
  const facilityZoneBadge = document.getElementById('facilityZoneBadge');
  const facilityTag = document.getElementById('facilityTag');
  const facilityName = document.getElementById('facilityName');
  const facilityDesc = document.getElementById('facilityDesc');
  const facilityPerks = document.getElementById('facilityPerks');

  facilityTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const zoneKey = btn.getAttribute('data-zone');
      const data = facilitiesData[zoneKey];
      if (!data) return;

      playUiSound('click');

      facilityTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Animate Card Change
      const displayCard = document.getElementById('facilityDisplayCard');
      displayCard.style.opacity = '0.4';
      displayCard.style.transform = 'scale(0.99)';

      setTimeout(() => {
        facilityActiveImg.src = data.image;
        facilityZoneBadge.textContent = data.badge;
        facilityTag.textContent = data.tag;
        facilityName.textContent = data.name;
        facilityDesc.textContent = data.desc;

        facilityPerks.innerHTML = data.perks
          .map((perk) => `<li><span>✓</span> ${perk}</li>`)
          .join('');

        displayCard.style.opacity = '1';
        displayCard.style.transform = 'scale(1)';
      }, 180);
    });
  });

  // =========================================================================
  // 5. Training Programs Filter
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      programCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 6. Interactive Biometric & Macro Calculator Engine
  // =========================================================================
  const fitnessCalcForm = document.getElementById('fitnessCalcForm');
  const goalButtons = document.querySelectorAll('.goal-btn');
  let selectedGoal = 'recomp';

  goalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      goalButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGoal = btn.getAttribute('data-goal');
      calculateMacros();
    });
  });

  if (fitnessCalcForm) {
    fitnessCalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playUiSound('beep');
      calculateMacros();
      showToast('Athletic Macro Blueprint Recalculated!');
    });

    // Also recalculate live on input changes
    fitnessCalcForm.querySelectorAll('input, select').forEach((input) => {
      input.addEventListener('change', () => calculateMacros());
    });
  }

  function calculateMacros() {
    const gender = document.getElementById('calcGender').value;
    const age = parseFloat(document.getElementById('calcAge').value) || 25;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 80;
    const height = parseFloat(document.getElementById('calcHeight').value) || 180;
    const activity = parseFloat(document.getElementById('calcActivity').value) || 1.55;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let tdee = Math.round(bmr * activity);

    let targetCalories = tdee;
    let goalNote = '';
    let proteinGrams = 0;
    let fatGrams = 0;
    let carbsGrams = 0;
    let programMatch = 'Anabolic Hypertrophy 5.0';

    if (selectedGoal === 'cut') {
      targetCalories = tdee - 500;
      proteinGrams = Math.round(weight * 2.3); // high protein to preserve muscle
      fatGrams = Math.round(weight * 0.75);
      const remainingCals = targetCalories - (proteinGrams * 4 + fatGrams * 9);
      carbsGrams = Math.max(50, Math.round(remainingCals / 4));
      goalNote = 'Aggressive Fat Oxidation with Strict Lean Muscle Retention';
      programMatch = 'Shed & Shred Velocity';
    } else if (selectedGoal === 'bulk') {
      targetCalories = tdee + 400;
      proteinGrams = Math.round(weight * 2.0);
      fatGrams = Math.round(weight * 1.0);
      const remainingCals = targetCalories - (proteinGrams * 4 + fatGrams * 9);
      carbsGrams = Math.round(remainingCals / 4);
      goalNote = 'Maximal Anabolic Surplus for Lean Tissue Accretion';
      programMatch = 'Titan Raw Strength';
    } else {
      // Recomp
      targetCalories = tdee;
      proteinGrams = Math.round(weight * 2.2);
      fatGrams = Math.round(weight * 0.9);
      const remainingCals = targetCalories - (proteinGrams * 4 + fatGrams * 9);
      carbsGrams = Math.round(remainingCals / 4);
      goalNote = 'Simultaneous Fat Reduction and Neuromuscular Hypertrophy';
      programMatch = 'Anabolic Hypertrophy 5.0';
    }

    // Update DOM
    document.getElementById('resCalories').textContent = targetCalories.toLocaleString();
    document.getElementById('resGoalNote').textContent = goalNote;
    document.getElementById('resProtein').textContent = `${proteinGrams}g (${proteinGrams * 4} kcal)`;
    document.getElementById('resCarbs').textContent = `${carbsGrams}g (${carbsGrams * 4} kcal)`;
    document.getElementById('resFats').textContent = `${fatGrams}g (${fatGrams * 9} kcal)`;
    document.getElementById('resProgramMatch').textContent = programMatch;

    // Macro Percentages for Bars
    const totalMacroCals = proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9;
    const pPct = Math.round(((proteinGrams * 4) / totalMacroCals) * 100);
    const cPct = Math.round(((carbsGrams * 4) / totalMacroCals) * 100);
    const fPct = Math.round(((fatGrams * 9) / totalMacroCals) * 100);

    document.getElementById('barProtein').style.width = `${pPct}%`;
    document.getElementById('barCarbs').style.width = `${cPct}%`;
    document.getElementById('barFats').style.width = `${fPct}%`;
  }

  // Initial calculation
  calculateMacros();

  // =========================================================================
  // 7. Membership Billing Toggle (Monthly vs Annual)
  // =========================================================================
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  const priceVals = document.querySelectorAll('.price-val');

  if (billingToggle) {
    // Default checked (Annual)
    billingToggle.checked = true;

    billingToggle.addEventListener('change', () => {
      playUiSound('click');
      const isAnnual = billingToggle.checked;

      if (isAnnual) {
        annualLabel.classList.add('active');
        monthlyLabel.classList.remove('active');
      } else {
        monthlyLabel.classList.add('active');
        annualLabel.classList.remove('active');
      }

      priceVals.forEach((valEl) => {
        valEl.style.transform = 'scale(0.8)';
        valEl.style.opacity = '0.3';

        setTimeout(() => {
          const newPrice = isAnnual
            ? valEl.getAttribute('data-annual')
            : valEl.getAttribute('data-monthly');
          valEl.textContent = newPrice;
          valEl.style.transform = 'scale(1)';
          valEl.style.opacity = '1';
        }, 150);
      });
    });
  }

  // =========================================================================
  // 8. Toast Notifications
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
