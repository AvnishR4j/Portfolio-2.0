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
    const hero = canvas?.closest('.hero');
    const heroBg = canvas?.closest('.hero-bg');
    if (!canvas || !hero || !heroBg) return;

    if (reducedMotion) {
        canvas.hidden = true;
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        canvas.hidden = true;
        return;
    }

    const image = new Image();
    image.decoding = 'async';
    image.src = 'assets/profile-ink-reveal.jpg';

    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    const imageCanvas = document.createElement('canvas');
    const imageCtx = imageCanvas.getContext('2d');
    const revealedCanvas = document.createElement('canvas');
    const revealedCtx = revealedCanvas.getContext('2d');
    if (!maskCtx || !imageCtx || !revealedCtx) {
        canvas.hidden = true;
        return;
    }

    let width = 0;
    let height = 0;
    let animationFrame = null;
    let lastTime = 0;
    let hasDrawnPortrait = false;
    const hasHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 768;
    const pointer = {
        x: 0.55,
        y: 0.48,
        targetX: 0.55,
        targetY: 0.48,
        strength: 0,
        targetStrength: hasHoverPointer ? 0 : 0.58,
        touchedAt: 0
    };

    image.addEventListener('load', () => {
        heroBg.classList.add('ink-ready');
        resizeCanvas();
        startAnimation();
    }, { once: true });

    image.addEventListener('error', () => {
        canvas.hidden = true;
    }, { once: true });

    window.addEventListener('resize', () => {
        resizeCanvas();
        hasDrawnPortrait = false;
    }, { passive: true });

    hero.addEventListener('pointerenter', (event) => {
        if (!hasHoverPointer) return;
        setPointerFromEvent(event);
        pointer.targetStrength = 0.95;
        startAnimation();
    });

    hero.addEventListener('pointermove', (event) => {
        if (!hasHoverPointer) return;
        setPointerFromEvent(event);
        pointer.targetStrength = 0.95;
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
        if (!hasHoverPointer) return;
        pointer.targetStrength = 0;
    });

    hero.addEventListener('touchstart', (event) => {
        setPointerFromTouch(event);
        pointer.targetStrength = 0.95;
        pointer.touchedAt = performance.now();
        startAnimation();
    }, { passive: true });

    hero.addEventListener('touchmove', (event) => {
        setPointerFromTouch(event);
        pointer.targetStrength = 0.95;
        pointer.touchedAt = performance.now();
    }, { passive: true });

    hero.addEventListener('touchend', () => {
        pointer.targetStrength = hasHoverPointer ? 0 : 0.52;
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
        revealedCanvas.width = width;
        revealedCanvas.height = height;
    }

    function startAnimation() {
        if (animationFrame !== null) return;
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
    }

    function animate(now) {
        const delta = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (!hasHoverPointer && now - pointer.touchedAt > 1200) {
            pointer.targetX = 0.5 + Math.sin(now / 2300) * 0.16;
            pointer.targetY = 0.45 + Math.cos(now / 2700) * 0.1;
            pointer.targetStrength = 0.56 + Math.sin(now / 1800) * 0.08;
        }

        pointer.x += (pointer.targetX - pointer.x) * Math.min(delta * 12, 1);
        pointer.y += (pointer.targetY - pointer.y) * Math.min(delta * 12, 1);
        pointer.strength += (pointer.targetStrength - pointer.strength) * Math.min(delta * 8, 1);

        drawFrame(now / 1000);

        if (hasHoverPointer && pointer.strength < 0.01 && pointer.targetStrength === 0) {
            ctx.clearRect(0, 0, width, height);
            animationFrame = null;
            return;
        }

        animationFrame = requestAnimationFrame(animate);
    }

    function drawFrame(time) {
        if (!width || !height) return;

        ctx.clearRect(0, 0, width, height);
        if (pointer.strength < 0.01) return;

        if (!hasDrawnPortrait) {
            imageCtx.clearRect(0, 0, width, height);
            drawPortraitScene(imageCtx, image, width, height);
            hasDrawnPortrait = true;
        }

        maskCtx.clearRect(0, 0, width, height);
        maskCtx.save();
        maskCtx.filter = `blur(${Math.round(Math.max(width, height) * 0.018)}px)`;
        maskCtx.globalCompositeOperation = 'lighter';
        drawHoverInk(time);
        maskCtx.restore();

        revealedCtx.clearRect(0, 0, width, height);
        revealedCtx.drawImage(imageCanvas, 0, 0);
        revealedCtx.globalCompositeOperation = 'destination-in';
        revealedCtx.drawImage(maskCanvas, 0, 0);
        revealedCtx.globalCompositeOperation = 'source-over';

        imageCtx.globalCompositeOperation = 'destination-in';
        imageCtx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.globalAlpha = Math.min(pointer.strength, 1);
        ctx.drawImage(revealedCanvas, 0, 0);
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.06 * pointer.strength;
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
    }

    function drawHoverInk(time) {
        const base = Math.min(width, height);
        const centerX = pointer.x * width;
        const centerY = pointer.y * height;
        const primaryRadius = base * (hasHoverPointer ? 0.24 : 0.34) * (0.72 + pointer.strength * 0.4);

        paintRadialInk(centerX, centerY, primaryRadius, 1);

        for (let i = 0; i < 8; i++) {
            const angle = i * 1.37 + time * (i % 2 ? -0.18 : 0.14);
            const wobble = Math.sin(time * 1.8 + i) * 0.08;
            const distance = primaryRadius * (0.34 + (i % 3) * 0.12 + wobble);
            const radius = primaryRadius * (0.22 + (i % 4) * 0.035);
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance * 0.78;
            paintRadialInk(x, y, radius, 0.72);
        }
    }

    function setPointerFromEvent(event) {
        const rect = canvas.getBoundingClientRect();
        pointer.targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        pointer.targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    }

    function setPointerFromTouch(event) {
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return;
        const rect = canvas.getBoundingClientRect();
        pointer.targetX = clamp((touch.clientX - rect.left) / rect.width, 0, 1);
        pointer.targetY = clamp((touch.clientY - rect.top) / rect.height, 0, 1);
    }

    function drawPortraitScene(targetCtx, sourceImage, targetWidth, targetHeight) {
        targetCtx.save();
        targetCtx.globalAlpha = 0.52;
        targetCtx.filter = `blur(${Math.round(Math.max(targetWidth, targetHeight) * 0.022)}px) brightness(0.64) saturate(1.12)`;
        drawCoverImage(targetCtx, sourceImage, targetWidth, targetHeight, 0.5, 0.42);
        targetCtx.restore();

        const frame = getPortraitFrame(sourceImage, targetWidth, targetHeight);
        targetCtx.save();
        targetCtx.globalAlpha = 0.96;
        targetCtx.filter = 'brightness(0.94) saturate(1.08) contrast(1.04)';
        targetCtx.shadowColor = 'rgba(0, 0, 0, 0.72)';
        targetCtx.shadowBlur = Math.max(targetWidth, targetHeight) * 0.035;
        targetCtx.drawImage(sourceImage, frame.x, frame.y, frame.width, frame.height);
        targetCtx.restore();
    }

    function getPortraitFrame(sourceImage, targetWidth, targetHeight) {
        const targetRatio = targetWidth / targetHeight;
        const imageRatio = sourceImage.naturalWidth / sourceImage.naturalHeight;
        const isTallViewport = targetRatio < 0.75;
        const portraitHeight = targetHeight * (isTallViewport ? 1.07 : 1.2);
        const portraitWidth = portraitHeight * imageRatio;
        const centerX = targetWidth * (isTallViewport ? 0.5 : 0.55);
        const centerY = targetHeight * (isTallViewport ? 0.5 : 0.54);

        return {
            x: centerX - portraitWidth / 2,
            y: centerY - portraitHeight / 2,
            width: portraitWidth,
            height: portraitHeight
        };
    }

    function paintRadialInk(x, y, radius, alpha) {
        const gradient = maskCtx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.98 * alpha})`);
        gradient.addColorStop(0.55, `rgba(255, 255, 255, ${0.76 * alpha})`);
        gradient.addColorStop(0.82, `rgba(255, 255, 255, ${0.28 * alpha})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(x, y, radius, 0, Math.PI * 2);
        maskCtx.fill();
    }

    function drawCoverImage(targetCtx, sourceImage, targetWidth, targetHeight, focusX = 0.5, focusY = 0.5) {
        const imageRatio = sourceImage.naturalWidth / sourceImage.naturalHeight;
        const targetRatio = targetWidth / targetHeight;
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
}
