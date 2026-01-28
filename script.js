const audioEl = document.getElementById("audio");
lucide.createIcons();

// Boot screen functionality - only show on first load or reload
function handleBootScreen() {
    const boot = document.getElementById("boot-screen");
    if (!boot) return; // If boot screen doesn't exist, skip
    
    // Check if coming from navigation (not first load/reload)
    const isNavigating = sessionStorage.getItem('hasVisited');
    
    if (isNavigating) {
        // Remove boot screen immediately if already visited
        boot.remove();
        startMusic();
    } else {
        // Show boot screen on first load
        setTimeout(() => {
            boot.style.transition = "opacity 0.6s ease";
            boot.style.opacity = "0";

            setTimeout(() => {
                boot.remove();
                startMusic();
            }, 600);
        }, 2600);
        
        // Mark as visited for this session
        sessionStorage.setItem('hasVisited', 'true');
    }
}

handleBootScreen();

// Music functionality
function startMusic() {
    audioEl.volume = 0.6;
    audioEl.loop = true;
    audioEl.play().catch(() => {});
}

// Create floating particles
function createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.setProperty('--drift', (Math.random() - 0.5) * 100 + 'px');
        particle.style.animation = `particleFloat ${15 + Math.random() * 20}s linear infinite`;
        particle.style.animationDelay = Math.random() * 10 + 's';
        document.body.appendChild(particle);
    }
}

createParticles();

// Cursor trail effect
let trails = [];
const trailCount = 5;

for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({
        element: trail,
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0
    });
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrails() {
    trails.forEach((trail, index) => {
        if (index === 0) {
            trail.targetX = mouseX;
            trail.targetY = mouseY;
        } else {
            trail.targetX = trails[index - 1].x;
            trail.targetY = trails[index - 1].y;
        }

        trail.x += (trail.targetX - trail.x) * 0.2;
        trail.y += (trail.targetY - trail.y) * 0.2;

        trail.element.style.left = trail.x + 'px';
        trail.element.style.top = trail.y + 'px';
        trail.element.style.opacity = 0.5 - (index * 0.1);
        trail.element.style.transform = `scale(${1 - index * 0.15})`;
    });

    requestAnimationFrame(animateTrails);
}

animateTrails();

// Navigation functionality
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

// Create page transition overlay
const transitionOverlay = document.createElement('div');
transitionOverlay.className = 'page-transition';
document.body.appendChild(transitionOverlay);

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetPage = button.getAttribute('data-page');

        // Update active nav button
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update active page
        pages.forEach(page => page.classList.remove('active'));
        const targetPageElement = document.getElementById(targetPage);
        
        if (targetPageElement) {
            targetPageElement.classList.add('active');
        } else {
            // Mark as visited before navigating
            sessionStorage.setItem('hasVisited', 'true');
            
            // Show transition overlay
            transitionOverlay.classList.add('active');
            
            // Navigate after short delay
            setTimeout(() => {
                if (targetPage === 'home') {
                    window.location.href = 'index.html';
                } else if (targetPage === 'portfolio') {
                    window.location.href = 'about.html';
                } else if (targetPage === 'contact') {
                    window.location.href = 'contact.html';
                }
            }, 300);
        }

        // Animate skill bars when portfolio page is shown
        if (targetPage === 'portfolio') {
            setTimeout(() => {
                const skillBars = document.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    bar.classList.add('animate');
                });
            }, 100);
        }
    });
});

// Fade out transition overlay on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        transitionOverlay.classList.remove('active');
    }, 100);
});

// Animate skill bars on page load if portfolio is active
window.addEventListener('load', () => {
    const portfolioPage = document.getElementById('portfolio');
    if (portfolioPage && portfolioPage.classList.contains('active')) {
        setTimeout(() => {
            const skillBars = document.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                bar.classList.add('animate');
            });
        }, 100);
    }
});

// Experience item hover effect with ripple
const experienceItems = document.querySelectorAll('.experience-item');
experienceItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.background = 'rgba(232, 229, 181, 0.03)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.background = 'transparent';
    });
});

// Add ripple effect to cards
function createRipple(event) {
    const card = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(232, 229, 181, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';

    card.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Apply ripple to interactive elements
document.querySelectorAll('.info-card, .contact-card, .experience-card').forEach(card => {
    card.addEventListener('click', createRipple);
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.profile-card, .info-card, .experience-card, .contact-card');

    cards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed * 0.1);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// Typing animation
const typingElement = document.querySelector(".typing-text");
if (typingElement) {
    const nameText = "s4rthk";
    let charIndex = 0;

    function startTyping() {
        typingElement.textContent = "";
        charIndex = 0;

        function typeChar() {
            if (charIndex < nameText.length) {
                typingElement.textContent += nameText.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 150); // Typing speed
            }
        }

        typeChar();
    }

    startTyping();
    setInterval(startTyping, 5000);
}

// Smooth reveal on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.info-card, .experience-item, .contact-card').forEach(el => {
    observer.observe(el);
});

// Scroll progress bar
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});
