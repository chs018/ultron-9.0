/* ==================== MAIN INTERACTIVE FEATURES ==================== */

// ===== CUSTOM PIXEL CURSOR =====
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Change cursor on clickable elements
    const clickables = document.querySelectorAll('a, button, .nav-link, .btn, .filter-btn');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-blocks">
                <div class="loading-block"></div>
                <div class="loading-block"></div>
                <div class="loading-block"></div>
            </div>
            <h2 class="loading-text">GENERATING WORLD...</h2>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    document.body.insertBefore(loadingScreen, document.body.firstChild);
    
    // Animate loading progress
    const progress = loadingScreen.querySelector('.loading-progress');
    gsap.to(progress, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => loadingScreen.remove()
            });
        }
    });
}

// ===== BACKGROUND MUSIC TOGGLE =====
function initMusicToggle() {
    const musicToggle = document.createElement('button');
    musicToggle.className = 'music-toggle';
    musicToggle.innerHTML = '🔇';
    musicToggle.title = 'Toggle Background Music';
    document.body.appendChild(musicToggle);
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        musicToggle.innerHTML = isPlaying ? '🔊' : '🔇';
        // Note: Actual audio implementation would require audio files
        console.log('Music toggle:', isPlaying ? 'ON' : 'OFF');
    });
}

// ===== LOGO EASTER EGGS =====
let logoClickCount = 0;
let logoClickTimeout = null;

function initLogoEasterEgg() {
    const logos = document.querySelectorAll('.logo');
    
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            
            console.log('Logo clicked! Count:', logoClickCount);
            
            // Reset counter after 3 seconds of no clicks
            clearTimeout(logoClickTimeout);
            logoClickTimeout = setTimeout(() => {
                logoClickCount = 0;
            }, 3000);
            
            // Bounce animation
            gsap.to(logo, {
                y: -20,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(logo, { y: 0, duration: 0.2, ease: 'bounce.out' });
                }
            });
            
            if (logoClickCount === 5) {
                // Easter egg: Color change rainbow effect
                console.log('🎉 EASTER EGG ACTIVATED!');
                
                const colors = ['#FF9F1C', '#D62828', '#3CB043', '#7EC8E3', '#FF9F1C'];
                let colorIndex = 0;
                
                const colorInterval = setInterval(() => {
                    logo.style.color = colors[colorIndex];
                    colorIndex++;
                    if (colorIndex >= colors.length * 3) {
                        clearInterval(colorInterval);
                        logo.style.color = '#FF9F1C';
                        logoClickCount = 0;
                    }
                }, 100);
                
                // Scale animation
                gsap.to(logo, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'power2.out',
                    yoyo: true,
                    repeat: 5
                });
            }
        });
    });
}

// ===== BUTTON CLICK SOUND EFFECTS =====
function initSoundEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual feedback
            gsap.to(btn, {
                scale: 0.9,
                duration: 0.1,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(btn, { scale: 1, duration: 0.1, ease: 'power2.out' });
                }
            });
            // Note: Actual sound would require audio files
            console.log('Button click sound!');
        });
    });
}

// ===== INITIALIZE ALL ENHANCEMENTS =====
window.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initCustomCursor();
    initMusicToggle();
    initLogoEasterEgg();
    initSoundEffects();
});

// ===== MOBILE NAVIGATION TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate toggle button
        gsap.to(menuToggle, {
            duration: 0.2,
            rotation: navLinks.classList.contains('active') ? 90 : 0,
            ease: 'power1.out'
        });
    });

    // Close menu when link is clicked
    const navItems = navLinks.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            gsap.to(menuToggle, {
                duration: 0.2,
                rotation: 0,
                ease: 'power1.out'
            });
        });
    });
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.href.split('/').pop();
    
    navLinks.forEach(link => {
        const linkPage = link.href.split('/').pop();
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

updateActiveNav();

// ===== COUNTDOWN TIMER =====
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    // Set target date to January 15, 2025, 10:00 AM
    const targetDate = new Date('2025-01-15T10:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Event has started
            const items = countdownElement.querySelectorAll('.countdown-value');
            items.forEach(item => item.textContent = '00');
            const labels = countdownElement.querySelectorAll('.countdown-label');
            labels.forEach(label => {
                if (label.textContent === 'DAYS') {
                    label.parentElement.innerHTML = '<div class="countdown-value">🎉</div><div class="countdown-label">LIVE NOW!</div>';
                }
            });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const items = countdownElement.querySelectorAll('.countdown-value');
        if (items[0]) items[0].textContent = String(days).padStart(2, '0');
        if (items[1]) items[1].textContent = String(hours).padStart(2, '0');
        if (items[2]) items[2].textContent = String(minutes).padStart(2, '0');
        if (items[3]) items[3].textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

initCountdown();

// ===== EVENT FILTER FUNCTIONALITY =====
function initEventFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            // Animate cards
            eventCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    gsap.to(card, {
                        duration: 0.3,
                        opacity: 1,
                        pointerEvents: 'auto',
                        ease: 'power2.out'
                    });
                    card.style.display = 'block';
                } else {
                    gsap.to(card, {
                        duration: 0.3,
                        opacity: 0.3,
                        pointerEvents: 'none',
                        ease: 'power2.out'
                    });
                }
            });
        });
    });
}

initEventFilter();

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        
        // Animate submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        gsap.to(submitBtn, {
            duration: 0.2,
            scale: 0.95,
            ease: 'back.out',
            onComplete: () => {
                submitBtn.textContent = '✓ SENT!';
                submitBtn.style.backgroundColor = '#3CB043';

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    gsap.to(submitBtn, {
                        duration: 0.2,
                        scale: 1,
                        ease: 'back.out'
                    });
                }, 3000);
            }
        });

        console.log('Form submitted:', {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        });
    });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(i => {
                if (i !== item && i.classList.contains('active')) {
                    i.classList.remove('active');
                    gsap.to(i.querySelector('.faq-answer'), {
                        duration: 0.3,
                        opacity: 0,
                        height: 0,
                        ease: 'power1.inOut'
                    });
                }
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                gsap.fromTo(answer,
                    { opacity: 0, height: 0 },
                    { opacity: 1, height: 'auto', duration: 0.3, ease: 'power1.inOut' }
                );
            } else {
                item.classList.remove('active');
                gsap.to(answer, {
                    duration: 0.3,
                    opacity: 0,
                    height: 0,
                    ease: 'power1.inOut'
                });
            }
        });
    });
}

initFAQ();

// ===== CURSOR CUSTOMIZATION =====
document.addEventListener('mousemove', (e) => {
    // Change cursor on hover elements
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
    
    if (hoveredElement && (hoveredElement.classList.contains('btn') || 
        hoveredElement.classList.contains('nav-link') ||
        hoveredElement.classList.contains('social-link'))) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
});

// ===== CLICK SOUND EFFECT (optional) =====
function playClickSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Enable click sounds on buttons (optional - can be toggled)
const enableSounds = false; // Set to true to enable sounds

if (enableSounds) {
    buttons.forEach(btn => {
        btn.addEventListener('click', playClickSound);
    });
}

// ===== EASTER EGG - LOGO CLICK =====
let logoClicks = 0;
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', () => {
        logoClicks++;

        if (logoClicks === 5) {
            // Trigger special animation
            gsap.to('body', {
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                backgroundColor: '#FF9F1C',
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.to('body', {
                        duration: 0.5,
                        backgroundColor: '#2E2E2E'
                    });
                }
            });

            logoClicks = 0;
        }
    });
}

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '⬆️';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: #3CB043;
    color: #1E1E1E;
    border: 3px solid #1E1E1E;
    padding: 15px 20px;
    font-family: 'Press Start 2P', cursive;
    font-size: 16px;
    border-radius: 0;
    cursor: pointer;
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    box-shadow: 4px 4px 0 #4A4A4A;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.pointerEvents = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    gsap.to(window, {
        duration: 0.8,
        scrollTo: 0,
        ease: 'power2.inOut'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    gsap.to(scrollToTopBtn, {
        duration: 0.2,
        scale: 1.1,
        boxShadow: '6px 6px 0 #4A4A4A',
        ease: 'power1.out'
    });
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    gsap.to(scrollToTopBtn, {
        duration: 0.2,
        scale: 1,
        boxShadow: '4px 4px 0 #4A4A4A',
        ease: 'power1.out'
    });
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    gsap.fromTo('.navbar',
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
});

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', () => {
    // Refresh AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

console.log('✓ Main.js loaded - All interactive features enabled');
