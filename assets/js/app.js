// TriAxis Solutions - Core JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('52B9kiZOIb0es1SLM'); 
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize AOS Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Side Drawer)
    const setupMobileMenu = () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.getElementById('menu-overlay');
        const navItems = document.querySelectorAll('.nav-links a');
        
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        };

        if (menuBtn && navLinks && overlay) {
            menuBtn.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', toggleMenu);
            
            // Close menu when clicking a link
            navItems.forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        toggleMenu();
                    }
                }, { passive: true });
            });
        }
    };

    setupMobileMenu();



    // Clients Data & Rendering
    const clients = [
        { name: 'HNB Assurance PLC.' },
        { name: 'HNB General Insurance Limited.' },
        { name: 'Trinity Asia (Pvt) Ltd.' },
        { name: 'Timex Garments (Pvt) Ltd.' },
        { name: 'SilverMill Natural Beverages (Pvt) Ltd.' },
        { name: 'Smart Dragon Lanka (Pvt) Ltd.' },
        { name: 'Swiss Lanka Commodities (Pvt) Ltd.' },
        { name: 'Sisili Hanaro Encare (Pvt) Ltd.' },
        { name: 'Island Designs Giftware.' }
    ];

    const renderClients = () => {
        const clientTrack = document.getElementById('client-track');
        if (!clientTrack) return;

        // Duplicate the list for infinite scroll effect
        const fullList = [...clients, ...clients];
        
        clientTrack.innerHTML = fullList.map((client, index) => `
            <div class="client-item" ${index < clients.length ? 'data-aos="fade-up"' : ''}>
                <span>${client.name}</span>
            </div>
        `).join('');
    };
    renderClients();

    // Stats Animation
    const animateCounters = () => {
        const stats = [
            { id: 'count-projects', target: 500, suffix: '+' },
            { id: 'count-visitors', target: 1250, suffix: '+' },
            { id: 'count-years', target: 10, suffix: '+' },
            { id: 'count-satisfaction', target: 100, suffix: '%' }
        ];

        stats.forEach(stat => {
            const el = document.getElementById(stat.id);
            if (!el) return;

            let count = 0;
            const duration = 2000;
            const increment = Math.ceil(stat.target / (duration / 20));

            const timer = setInterval(() => {
                count += increment;
                if (count >= stat.target) {
                    el.innerText = stat.target + stat.suffix;
                    clearInterval(timer);
                } else {
                    el.innerText = count + stat.suffix;
                }
            }, 20);
        });
    };

    // Use Intersection Observer for stats
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm && typeof emailjs !== 'undefined') {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Sending...';
            lucide.createIcons();
            btn.disabled = true;

            // EmailJS sendForm
            // Service ID: service_o1c8aru
            emailjs.sendForm('service_o1c8aru', 'template_eublc0p', contactForm)
                .then(() => {
                    btn.innerHTML = '<i data-lucide="check-circle"></i> Sent Successfully';
                    btn.style.background = '#10b981';
                    lucide.createIcons();
                    contactForm.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        lucide.createIcons();
                    }, 3000);
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    btn.innerHTML = '<i data-lucide="alert-circle"></i> Failed to Send';
                    btn.style.background = '#ef4444';
                    lucide.createIcons();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                        lucide.createIcons();
                    }, 3000);
                });
        });
    }

    // Visitor Counter (Static as requested)
    const visitorElement = document.getElementById('visitor-count');
    if (visitorElement) {
        // Increment logic removed as per user request to stop 'fake' count
    }
});
