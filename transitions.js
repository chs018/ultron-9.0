/* ==================== GSAP PAGE TRANSITIONS ==================== */

// Initialize AOS (Animate On Scroll) with enhanced settings
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out-cubic',
        once: false,
        mirror: true,
        offset: 100,
        delay: 50
    });
}

// ===== PAGE TRANSITION EFFECTS =====
const pageTransitionDuration = 0.6;

function transitionToPage(url) {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #2E2E2E, #4A4A4A);
        z-index: 9999;
        transform: translateY(-100%);
    `;
    document.body.appendChild(overlay);
    
    // Slide down transition
    gsap.to(overlay, {
        y: 0,
        duration: pageTransitionDuration,
        ease: 'power3.inOut',
        onComplete: () => {
            window.location.href = url;
        }
    });
}

// Enhanced fade in on page load with slide effect
window.addEventListener('load', () => {
    gsap.fromTo('body', 
        { opacity: 0, y: 20 },
        { 
            opacity: 1, 
            y: 0,
            duration: pageTransitionDuration, 
            ease: 'power2.out' 
        }
    );
    
    // Stagger animation for main elements
    gsap.from('.hero, .page-header', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.2
    });
});

// ===== LINK CLICK HANDLERS =====
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a[href*=".html"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only apply transition if navigating to different page
            if (link.href.split('/').pop() !== window.location.href.split('/').pop()) {
                e.preventDefault();
                transitionToPage(link.href);
            }
        });
    });
});

// ===== BUTTON ANIMATIONS =====
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            duration: 0.1,
            scale: 1.05,
            ease: 'power1.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.1,
            scale: 1,
            ease: 'power1.out'
        });
    });

    btn.addEventListener('click', () => {
        gsap.to(btn, {
            duration: 0.1,
            scale: 0.95,
            ease: 'power1.out',
            onComplete: () => {
                gsap.to(btn, {
                    duration: 0.1,
                    scale: 1,
                    ease: 'power1.out'
                });
            }
        });
    });
});

// ===== CARD HOVER ANIMATIONS =====
const cards = document.querySelectorAll('.feature-card, .event-card, .track-card, .team-card, .contributor-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            scale: 1.02,
            boxShadow: '8px 8px 0 var(--torch-orange)',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            scale: 1,
            boxShadow: '5px 5px 0 var(--slate-gray)',
            ease: 'power2.out'
        });
    });
});

// ===== FLOATING ANIMATION FOR HERO BLOCKS =====
const blocks = document.querySelectorAll('.block');
blocks.forEach((block, index) => {
    gsap.to(block, {
        y: 30,
        duration: 3 + (index * 0.5),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });
});

// ===== HERO TITLE ANIMATION =====
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    gsap.fromTo(heroTitle,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    // Pulse animation
    gsap.to(heroTitle, {
        textShadow: '5px 5px 0 #2E2E2E, -2px -2px 0 #D62828',
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });
}

// ===== SUBTITLE ANIMATION =====
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    gsap.fromTo(subtitle,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
}

// ===== SECTION SCROLL ANIMATIONS =====
const sections = document.querySelectorAll('section');
sections.forEach((section, index) => {
    const title = section.querySelector('.section-title');
    if (title) {
        gsap.fromTo(title,
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                    markers: false
                }
            }
        );
    }
});

// ===== STAGGER ANIMATION FOR GRID ITEMS =====
gsap.utils.toArray('.feature-card, .stat-card, .event-card, .track-card').forEach((card) => {
    gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 75%',
                scrub: 0.5,
                markers: false
            }
        }
    );
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('.minecraft-bg');
    
    if (hero && bg) {
        const scrollY = window.scrollY;
        bg.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// ===== NUMBER COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2) {
    let start = 0;
    const increment = target / (duration * 60);
    
    const interval = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 1000 / 60);
}

// Animate stat numbers when visible
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

window.addEventListener('scroll', () => {
    if (!statsAnimated && statNumbers.length > 0) {
        const rect = statNumbers[0].getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            statsAnimated = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.textContent.replace(/\D/g, ''));
                if (target) {
                    animateCounter(el, target);
                }
            });
        }
    }
});

// ===== TEXT REVEAL ANIMATION =====
const cardTexts = document.querySelectorAll('.card-text');
cardTexts.forEach(text => {
    gsap.fromTo(text,
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: text,
                start: 'top 90%',
                end: 'top 70%',
                scrub: 0.5,
                markers: false
            }
        }
    );
});

console.log('✓ Transitions.js loaded - Smooth page animations enabled');
