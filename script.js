/* ═══════════════════════════════════════════════════════════
   AVNISH RAJ — PORTFOLIO SCRIPTS
   Scroll Animations · 3D Tilt · Tabs · Particles
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    initHeroInkReveal(reducedMotion);

    // Keep the rendered page recruiter-first while retaining the creative section markup.
    const skillsSection = document.getElementById('skills');
    const creativeSection = document.getElementById('creative');
    if (skillsSection && creativeSection) {
        skillsSection.after(creativeSection);
    }

    // ─── PARTICLES ───
    const particlesContainer = document.getElementById('hero-particles');
    if (particlesContainer && !reducedMotion) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 3 + 1 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = Math.random() * 8 + 6 + 's';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.background = Math.random() > 0.5
                ? 'rgba(0, 255, 255, 0.6)'
                : 'rgba(138, 43, 226, 0.5)';
            particlesContainer.appendChild(particle);
        }
    }

    // ─── NAVBAR SCROLL ───
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ─── HAMBURGER MENU ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── SCROLL REVEAL ───
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── 3D TILT ON PROJECT CARDS ───
    const tiltCards = document.querySelectorAll('[data-tilt]');

    if (hasFinePointer && !reducedMotion) tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // ─── TAB SWITCHING ───
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activateTab(btn);
        });

        btn.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            const currentIndex = [...tabBtns].indexOf(btn);
            const offset = event.key === 'ArrowRight' ? 1 : -1;
            const nextButton = tabBtns[(currentIndex + offset + tabBtns.length) % tabBtns.length];
            nextButton.focus();
            activateTab(nextButton);
        });
    });

    function activateTab(btn) {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => {
            const isActive = b === btn;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-selected', String(isActive));
        });

        tabContents.forEach(content => {
            const isActive = content.id === `tab-${targetTab}`;
            content.classList.toggle('active', isActive);
            content.hidden = !isActive;
            if (isActive) {
                content.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
            }
        });
    }

    tabContents.forEach(content => {
        content.hidden = !content.classList.contains('active');
    });

    // ─── COUNTER ANIMATION ───
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                let current = 0;
                const increment = target / 30;
                const duration = 1500;
                const step = duration / 30;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, step);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ─── SMOOTH SCROLL FOR NAV LINKS ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── ACTIVE NAV LINK ON SCROLL ───
    const sections = document.querySelectorAll('.section, .hero');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(s => sectionObserver.observe(s));
});

function initHeroInkReveal(reducedMotion) {
    const canvas = document.getElementById('hero-ink-canvas');
    const heroBg = canvas?.closest('.hero-bg');
    if (!canvas || !heroBg) return;

    if (reducedMotion) {
        heroBg.classList.add('ink-fallback');
        return;
    }

    heroBg.classList.add('ink-loading');

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        heroBg.classList.remove('ink-loading');
        heroBg.classList.add('ink-fallback');
        return;
    }

    const image = new Image();
    image.decoding = 'async';
    image.src = 'assets/profile-ink-reveal.jpg';

    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    if (!maskCtx || !imageCtx) {
        heroBg.classList.remove('ink-loading');
        heroBg.classList.add('ink-fallback');
        return;
    }

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let animationStart = 0;
    let isComplete = false;
    const duration = 3400;

    const blobs = [
        { x: 0.48, y: 0.34, r: 0.22, start: 0.02, span: 0.42, seed: 1.7 },
        { x: 0.59, y: 0.42, r: 0.3, start: 0.12, span: 0.42, seed: 4.4 },
        { x: 0.38, y: 0.55, r: 0.32, start: 0.18, span: 0.48, seed: 7.1 },
        { x: 0.68, y: 0.63, r: 0.33, start: 0.25, span: 0.44, seed: 2.9 },
        { x: 0.28, y: 0.42, r: 0.27, start: 0.3, span: 0.44, seed: 9.8 },
        { x: 0.78, y: 0.38, r: 0.24, start: 0.34, span: 0.4, seed: 5.5 },
        { x: 0.52, y: 0.52, r: 0.9, start: 0.56, span: 0.34, seed: 3.2 }
    ];

    image.addEventListener('load', () => {
        heroBg.classList.add('ink-ready');
        resizeCanvas();
        animationStart = performance.now();
        animationFrame = requestAnimationFrame(animate);
    }, { once: true });

    image.addEventListener('error', () => {
        heroBg.classList.remove('ink-loading');
        heroBg.classList.add('ink-fallback');
    }, { once: true });

    window.addEventListener('resize', () => {
        resizeCanvas();
        if (isComplete && width && height) drawFrame(1, 0);
    }, { passive: true });

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, Math.round(rect.width * dpr));
        height = Math.max(1, Math.round(rect.height * dpr));

        canvas.width = width;
        canvas.height = height;
        maskCanvas.width = width;
        maskCanvas.height = height;
        imageCanvas.width = width;
        imageCanvas.height = height;
    }

    function animate(now) {
        const elapsed = now - animationStart;
        const progress = Math.min(elapsed / duration, 1);
        drawFrame(progress, elapsed / 1000);

        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
            return;
        }

        isComplete = true;
        heroBg.classList.add('ink-complete');
        cancelAnimationFrame(animationFrame);
    }

    function drawFrame(progress, time) {
        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        imageCtx.clearRect(0, 0, width, height);
        drawCoverImage(imageCtx, image, width, height);

        maskCtx.clearRect(0, 0, width, height);
        maskCtx.save();
        maskCtx.filter = `blur(${Math.round(Math.max(width, height) * 0.018)}px)`;
        maskCtx.globalCompositeOperation = 'lighter';
        blobs.forEach(blob => drawBlob(blob, progress, time));
        maskCtx.restore();

        imageCtx.globalCompositeOperation = 'destination-in';
        imageCtx.drawImage(maskCanvas, 0, 0);
        imageCtx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.drawImage(imageCanvas, 0, 0);
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.08 * (1 - Math.min(progress, 0.9) / 0.9);
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    function drawBlob(blob, progress, time) {
        const localProgress = clamp((progress - blob.start) / blob.span, 0, 1);
        if (localProgress <= 0) return;

        const eased = easeOutCubic(localProgress);
        const base = Math.max(width, height);
        const radius = blob.r * base * eased * (1 + Math.sin(time * 2.1 + blob.seed) * 0.025);
        const centerX = blob.x * width + Math.sin(time * 1.7 + blob.seed) * radius * 0.035;
        const centerY = blob.y * height + Math.cos(time * 1.35 + blob.seed) * radius * 0.03;

        paintRadialInk(centerX, centerY, radius);

        for (let i = 0; i < 7; i++) {
            const angle = blob.seed + i * 1.27;
            const satelliteRadius = radius * (0.18 + (i % 3) * 0.045);
            const offset = radius * (0.45 + (i % 2) * 0.16);
            const x = centerX + Math.cos(angle + time * 0.16) * offset;
            const y = centerY + Math.sin(angle - time * 0.12) * offset * 0.72;
            paintRadialInk(x, y, satelliteRadius);
        }
    }

    function paintRadialInk(x, y, radius) {
        const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        gradient.addColorStop(0.56, 'rgba(255, 255, 255, 0.76)');
        gradient.addColorStop(0.82, 'rgba(255, 255, 255, 0.32)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(x, y, radius, 0, Math.PI * 2);
        maskCtx.fill();
    }

    function drawCoverImage(targetCtx, sourceImage, targetWidth, targetHeight) {
        const imageRatio = sourceImage.naturalWidth / sourceImage.naturalHeight;
        const targetRatio = targetWidth / targetHeight;
        const focusX = targetRatio < 0.8 ? 0.6 : 0.5;
        const focusY = 0.48;
        let sourceWidth = sourceImage.naturalWidth;
        let sourceHeight = sourceImage.naturalHeight;

        if (imageRatio > targetRatio) {
            sourceWidth = sourceImage.naturalHeight * targetRatio;
        } else {
            sourceHeight = sourceImage.naturalWidth / targetRatio;
        }

        const sourceX = (sourceImage.naturalWidth - sourceWidth) * focusX;
        const sourceY = (sourceImage.naturalHeight - sourceHeight) * focusY;
        targetCtx.drawImage(sourceImage, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function easeOutCubic(value) {
        return 1 - Math.pow(1 - value, 3);
    }
}
