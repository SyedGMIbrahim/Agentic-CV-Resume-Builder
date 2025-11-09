// 🚀 Micro-interactions and Cool Effects for Resume Builder

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// BACKGROUND PARTICLE SYSTEM
// ==========================================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.animationId = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.createParticles();
        this.animate();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'background-particles';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(this.container);
    }

    createParticles() {
        const particleCount = 50;
        const types = ['type-1', 'type-2', 'type-3'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const type = types[Math.floor(Math.random() * types.length)];
            
            particle.className = `particle ${type}`;
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-duration: ${5 + Math.random() * 5}s;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }

        // Create glowing orbs
        this.createGlowingOrbs();
    }

    createGlowingOrbs() {
        const orbData = [
            { class: 'orb-1', size: 80, color: 'rgba(0, 217, 255, 0.3)' },
            { class: 'orb-2', size: 120, color: 'rgba(107, 70, 193, 0.2)' },
            { class: 'orb-3', size: 60, color: 'rgba(20, 184, 166, 0.3)' }
        ];

        orbData.forEach((orb, index) => {
            const orbElement = document.createElement('div');
            orbElement.className = `glowing-orb ${orb.class}`;
            orbElement.style.cssText = `
                position: absolute;
                width: ${orb.size}px;
                height: ${orb.size}px;
                background: radial-gradient(circle, ${orb.color}, transparent);
                border-radius: 50%;
                filter: blur(2px);
                left: ${20 + index * 30}%;
                top: ${20 + index * 20}%;
                animation: pulseGlow ${4 + index}s ease-in-out infinite;
                animation-delay: ${index * 0.7}s;
            `;
            this.container.appendChild(orbElement);
        });
    }

    animate() {
        this.particles.forEach((particle, index) => {
            const speed = 0.5 + (index % 3) * 0.3;
            const currentTop = parseFloat(particle.style.top) || 0;
            const newTop = (currentTop + speed) % 100;
            particle.style.top = newTop + '%';
            
            // Add slight horizontal movement
            const currentLeft = parseFloat(particle.style.left) || 0;
            const horizontalDrift = Math.sin(Date.now() * 0.001 + index) * 0.1;
            particle.style.left = Math.max(0, Math.min(100, currentLeft + horizontalDrift)) + '%';
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// ==========================================
// BUTTON MICRO-INTERACTIONS
// ==========================================

class ButtonEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addRippleEffect();
        this.addButtonAnimations();
        this.addMagneticButtons();
    }

    addRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .stButton > button');
            if (!button) return;

            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(0, 217, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    addButtonAnimations() {
        const buttons = document.querySelectorAll('button, .stButton > button');
        buttons.forEach(button => {
            // Add press animation
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
                button.style.transition = 'transform 0.1s ease';
            });

            button.addEventListener('mouseup', () => {
                button.style.transform = 'scale(1)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });

            // Add glow on hover
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.6)';
                button.style.transition = 'all 0.3s ease';
            });

            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }

    addMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic, button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const maxMove = 10;
                const moveX = (x / rect.width) * maxMove;
                const moveY = (y / rect.height) * maxMove;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                button.style.transition = 'transform 0.1s ease-out';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0) scale(1)';
            });
        });
    }
}

// ==========================================
// INPUT FIELD EFFECTS
// ==========================================

class InputEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addFloatingLabels();
        this.addInputAnimations();
        this.addAutoResize();
    }

    addFloatingLabels() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.placeholder && !input.dataset.floatingLabel) {
                const label = document.createElement('label');
                label.textContent = input.placeholder;
                label.style.cssText = `
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94A3B8;
                    pointer-events: none;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    background: #1E293B;
                    padding: 0 4px;
                `;
                
                input.parentElement.style.position = 'relative';
                input.parentElement.appendChild(label);
                
                input.dataset.floatingLabel = 'true';
                
                input.addEventListener('focus', () => {
                    label.style.top = '0';
                    label.style.fontSize = '12px';
                    label.style.color = '#00D9FF';
                    label.style.transform = 'translateY(-50%)';
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.top = '50%';
                        label.style.fontSize = '14px';
                        label.style.color = '#94A3B8';
                    }
                });
                
                if (input.value) {
                    label.style.top = '0';
                    label.style.fontSize = '12px';
                    label.style.color = '#00D9FF';
                }
            }
        });
    }

    addInputAnimations() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                input.style.borderColor = '#00D9FF';
                input.style.transform = 'scale(1.02)';
                input.style.transition = 'all 0.3s ease';
            });
            
            input.addEventListener('blur', () => {
                input.style.boxShadow = '';
                input.style.borderColor = '';
                input.style.transform = 'scale(1)';
            });
        });
    }

    addAutoResize() {
        const textareas = document.querySelectorAll('textarea');
        
        textareas.forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }
}

// ==========================================
// CARD ANIMATIONS
// ==========================================

class CardEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addCardHoverEffects();
        this.addCardEntranceAnimations();
        this.addParallaxEffect();
    }

    addCardHoverEffects() {
        const cards = document.querySelectorAll('.stCard, .card-container');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0, 217, 255, 0.3), 0 0 60px rgba(107, 70, 193, 0.2)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }

    addCardEntranceAnimations() {
        const cards = document.querySelectorAll('.stCard, .card-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.animation = 'fadeInScale 0.6s ease-out';
                    }, index * 100);
                }
            });
        });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }

    addParallaxEffect() {
        const cards = document.querySelectorAll('.stCard, .card-container');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

class ScrollEffects {
    constructor() {
        this.init();
    }

    init() {
        this.addScrollReveal();
        this.addProgressIndicator();
        this.addSmoothScroll();
    }

    addScrollReveal() {
        const elements = document.querySelectorAll('.stCard, .section-header, .stButton');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-scale');
                    entry.target.style.opacity = '1';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }

    addProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #00D9FF, #6B46C1);
            z-index: 9999;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        }, 100));
    }

    addSmoothScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add smooth reveal for elements
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
}

// ==========================================
// CURSOR EFFECTS
// ==========================================

class CursorEffects {
    constructor() {
        this.cursor = null;
        this.trail = [];
        this.init();
    }

    init() {
        this.createCustomCursor();
        this.addCursorTrail();
        this.addHoverEffects();
    }

    createCustomCursor() {
        this.cursor = document.createElement('div');
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 217, 255, 0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(this.cursor);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX - 10 + 'px';
            this.cursor.style.top = e.clientY - 10 + 'px';
        });
    }

    addCursorTrail() {
        const trailCount = 5;
        
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${10 - i * 2}px;
                height: ${10 - i * 2}px;
                background: rgba(107, 70, 193, ${0.5 - i * 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: ${9998 - i};
                transition: all 0.2s ease;
            `;
            
            document.body.appendChild(trail);
            this.trail.push(trail);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateTrail = () => {
            this.trail.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = mouseX - (10 - index * 2) / 2 + 'px';
                    trail.style.top = mouseY - (10 - index * 2) / 2 + 'px';
                }, index * 50);
            });
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
    }

    addHoverEffects() {
        const hoverElements = document.querySelectorAll('button, a, .stButton, .card-container');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursor.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent)';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursor.style.background = 'radial-gradient(circle, rgba(0, 217, 255, 0.8), transparent)';
            });
        });
    }
}

// ==========================================
// THEME TOGGLE
// ==========================================

class ThemeManager {
    constructor() {
        this.isDarkMode = true;
        this.init();
    }

    init() {
        this.addThemeToggle();
        this.loadSavedTheme();
    }

    addThemeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '🌙';
        toggleButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00D9FF, #6B46C1);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.4);
        `;
        
        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
            toggleButton.innerHTML = this.isDarkMode ? '🌙' : '☀️';
            toggleButton.style.background = this.isDarkMode 
                ? 'linear-gradient(135deg, #00D9FF, #6B46C1)' 
                : 'linear-gradient(135deg, #F59E0B, #EF4444)';
        });
        
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.transform = 'scale(1.1) rotate(180deg)';
        });
        
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.transform = 'scale(1) rotate(0deg)';
        });
        
        document.body.appendChild(toggleButton);
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('light-mode', !this.isDarkMode);
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
        
        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { isDarkMode: this.isDarkMode } 
        }));
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.isDarkMode = false;
            document.body.classList.add('light-mode');
        }
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    window.particleSystem = new ParticleSystem();
    
    // Initialize button effects
    window.buttonEffects = new ButtonEffects();
    
    // Initialize input effects
    window.inputEffects = new InputEffects();
    
    // Initialize card effects
    window.cardEffects = new CardEffects();
    
    // Initialize scroll effects
    window.scrollEffects = new ScrollEffects();
    
    // Initialize cursor effects (optional - can be disabled for performance)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.cursorEffects = new CursorEffects();
    }
    
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    console.log('🚀 All micro-interactions loaded successfully!');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.particleSystem) {
        window.particleSystem.destroy();
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .light-mode {
        --bg-primary: #F8FAFC;
        --bg-secondary: #E2E8F0;
        --text-primary: #1E293B;
        --text-secondary: #475569;
        --primary-cyan: #0891B2;
        --primary-purple: #7C3AED;
    }
    
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);