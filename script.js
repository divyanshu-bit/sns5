// Global variables
let currentTestimonial = 1;
let isLoading = false;

// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Initialize animations after loading
        setTimeout(() => {
            initializeAnimations();
            createParticles();
        }, 500);
    }, 2000);
});

// Smooth scrolling function
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar scroll effect and active link
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 20);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 20);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters when stats section comes into view
            if (entry.target.classList.contains('stats-container')) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
            }
        }
    });
}, observerOptions);

// Fallback: Trigger stats animation on page load if already in view
window.addEventListener('load', () => {
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const rect = statsContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < windowHeight && rect.bottom >= 0) {
            const counters = statsContainer.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
            });
        }
    }
});

// Initialize animations
function initializeAnimations() {
    // Add scroll animation classes to elements
    const animateElements = document.querySelectorAll(`
        .product-card, .value-card, .feature-item, .quality-point, 
        .stats-container, .application-card, .timeline-item,
        .testimonial-card, .gallery-item, .feature-card
    `);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Create floating particles for hero section
function createParticles() {
    const heroParticles = document.getElementById('heroParticles');
    if (!heroParticles) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${6 + Math.random() * 8}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        heroParticles.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-40px) translateX(-5px);
            opacity: 1;
        }
        75% {
            transform: translateY(-20px) translateX(-10px);
            opacity: 0.7;
        }
    }
`;
document.head.appendChild(particleStyle);

// Product card interactions
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg)';
    });
});

// Value card interactions
document.querySelectorAll('.value-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'rotateY(180deg) scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.value-icon');
        if (icon) {
            icon.style.transform = 'rotateY(0deg) scale(1)';
        }
    });
});

// Testimonials functionality
function changeTestimonial(direction) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Remove active class from current testimonial
    cards[currentTestimonial - 1].classList.remove('active');
    dots[currentTestimonial - 1].classList.remove('active');
    
    // Calculate new testimonial index
    currentTestimonial += direction;
    if (currentTestimonial > cards.length) currentTestimonial = 1;
    if (currentTestimonial < 1) currentTestimonial = cards.length;
    
    // Add active class to new testimonial
    cards[currentTestimonial - 1].classList.add('active');
    dots[currentTestimonial - 1].classList.add('active');
}

function currentTestimonialSet(n) {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Remove active class from current testimonial
    cards[currentTestimonial - 1].classList.remove('active');
    dots[currentTestimonial - 1].classList.remove('active');
    
    // Set new testimonial
    currentTestimonial = n;
    cards[currentTestimonial - 1].classList.add('active');
    dots[currentTestimonial - 1].classList.add('active');
}

// Auto-rotate testimonials
setInterval(() => {
    changeTestimonial(1);
}, 6000);

// Gallery filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Form handling with enhanced validation
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const formData = new FormData(form);
    
    // Validate form
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderBottomColor = '#ef4444';
            setTimeout(() => {
                field.style.borderBottomColor = '';
            }, 3000);
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    isLoading = true;
    submitBtn.classList.add('loading');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        isLoading = false;
        submitBtn.classList.remove('loading');
    }
});

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${icons[type]}</div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        min-width: 300px;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
        }
        .notification-content {
            flex: 1;
        }
        .notification-message {
            font-size: 14px;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 6000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-rivet');
    const speed = 0.5;
    
    parallaxElements.forEach((element, index) => {
        const yPos = -(scrolled * speed * (index + 1) * 0.1);
        const rotation = scrolled * 0.1 * (index + 1);
        element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
    
    // 3D rivet rotation on scroll
    const rivet3d = document.querySelector('.rivet-3d');
    if (rivet3d) {
        const scrollPercent = scrolled / (document.body.scrollHeight - window.innerHeight);
        const rotation = scrollPercent * 720;
        rivet3d.style.transform = `rotateY(${rotation}deg) rotateX(15deg)`;
    }
});

// Magnetic effect for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Ripple effect for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced scroll animations with stagger effect
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.addElements('.product-card', 'slideInUp', 0.1);
        this.addElements('.value-card', 'slideInUp', 0.15);
        this.addElements('.feature-item', 'slideInLeft', 0.1);
        this.addElements('.application-card', 'slideInUp', 0.12);
        this.addElements('.gallery-item', 'slideInUp', 0.08);
        
        this.observe();
    }
    
    addElements(selector, animation, delay = 0) {
        document.querySelectorAll(selector).forEach((el, index) => {
            this.elements.push({
                element: el,
                animation: animation,
                delay: delay * index
            });
        });
    }
    
    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = this.elements.find(item => item.element === entry.target);
                    if (item) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, item.delay * 1000);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach(item => {
            observer.observe(item.element);
        });
    }
}

// Initialize enhanced scroll animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});

// Add CSS for enhanced scroll animations
const scrollAnimationStyles = document.createElement('style');
scrollAnimationStyles.textContent = `
    .product-card,
    .value-card,
    .feature-item,
    .application-card,
    .gallery-item {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .feature-item {
        transform: translateX(-50px);
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translate(0, 0) !important;
    }
`;
document.head.appendChild(scrollAnimationStyles);

// Form field animations
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
        if (!field.value) {
            field.parentElement.classList.remove('focused');
        }
    });
    
    // Check if field has value on page load
    if (field.value) {
        field.parentElement.classList.add('focused');
    }
});

// Smooth reveal animation for timeline items
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = `all 0.6s ease ${index * 0.2}s`;
    timelineObserver.observe(item);
});

// Add loading states for interactive elements
document.querySelectorAll('.product-card, .value-card, .application-card').forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// Initialize quality particles animation
function initQualityParticles() {
    const qualityParticles = document.querySelector('.quality-particles');
    if (!qualityParticles) return;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(245, 158, 11, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: qualityParticleFloat ${10 + Math.random() * 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 6}s;
        `;
        qualityParticles.appendChild(particle);
    }
}

// Add quality particles animation CSS
const qualityParticleStyle = document.createElement('style');
qualityParticleStyle.textContent = `
    @keyframes qualityParticleFloat {
        0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
        }
        33% {
            transform: translateY(-30px) translateX(20px) scale(1.2);
            opacity: 1;
        }
        66% {
            transform: translateY(-60px) translateX(-15px) scale(0.8);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(qualityParticleStyle);

// Initialize quality particles when page loads
setTimeout(() => {
    initQualityParticles();
}, 1500);

// Add hover effects for certification badges
document.querySelectorAll('.cert-item, .cert-badge').forEach(cert => {
    cert.addEventListener('mouseenter', () => {
        cert.style.transform = 'scale(1.05)';
        cert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    cert.addEventListener('mouseleave', () => {
        cert.style.transform = 'scale(1)';
        cert.style.boxShadow = '';
    });
});

// Add typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Performance optimization: Throttle scroll events
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
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Existing scroll functionality here
}, 20)); // Optimized performance

console.log('SNS Industries website loaded! 🏭');

document.addEventListener('DOMContentLoaded', () => {
    let currentBannerIndex = 0;
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const dotsContainer = document.querySelector('.banner-dots');

    // Create dots dynamically
    bannerSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('banner-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentBannerIndex = index;
            showBannerSlide(currentBannerIndex);
            updateDots(currentBannerIndex);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.banner-dot');

    function showBannerSlide(index) {
        bannerSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        updateDots(index);
    }

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextBannerSlide() {
        currentBannerIndex = (currentBannerIndex + 1) % bannerSlides.length;
        showBannerSlide(currentBannerIndex);
    }

    // Auto rotate banner every 5 seconds
    setInterval(nextBannerSlide, 5000);
});
