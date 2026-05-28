// TriAxis Solutions - Core JavaScript Logic

window.onerror = function (message, source, lineno, colno, error) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.background = '#ef4444';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '1.5rem';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '15px';
    errorDiv.style.lineHeight = '1.6';
    errorDiv.style.borderBottom = '4px solid #b91c1c';
    errorDiv.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    errorDiv.innerHTML = `<strong>⚠️ JS Runtime Error Detected:</strong><br>${message}<br><br><strong>File:</strong> ${source}<br><strong>Line:</strong> ${lineno} | <strong>Column:</strong> ${colno}<br><br>Please copy this message and send it to me so I can fix it instantly!`;
    document.body.appendChild(errorDiv);
    return false;
};

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
            duration: 800,
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

        if (!menuBtn || !navLinks || !overlay) return;

        let isMenuOpen = false;
        let isToggling = false; // Prevent double-fire from touchstart + click

        const openMenu = () => {
            isMenuOpen = true;
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            menuBtn.setAttribute('aria-expanded', 'true');
            const icon = menuBtn.querySelector('i');
            if (icon) { icon.setAttribute('data-lucide', 'x'); lucide.createIcons(); }
        };

        const closeMenu = () => {
            isMenuOpen = false;
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            menuBtn.setAttribute('aria-expanded', 'false');
            const icon = menuBtn.querySelector('i');
            if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
        };

        const toggleMenu = () => {
            if (isToggling) return;
            isToggling = true;
            setTimeout(() => { isToggling = false; }, 350);
            isMenuOpen ? closeMenu() : openMenu();
        };

        // touchstart fires 300ms before click on mobile - use it for instant response
        // preventDefault stops the ghost click that causes double-toggle
        menuBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleMenu();
        }, { passive: false });

        // click handles desktop + fallback for non-touch devices
        menuBtn.addEventListener('click', toggleMenu);

        // Close on overlay tap/click
        overlay.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeMenu();
        }, { passive: false });
        overlay.addEventListener('click', closeMenu);

        // Close menu when a nav link is tapped
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) closeMenu();
            }, { passive: true });
        });
    };

    setupMobileMenu();



    // Clients Data & Rendering (Fallback default list)
    const defaultClients = [
        { name: 'HNB Assurance PLC.' },
        { name: 'HNB General Insurance Limited.' },
        { name: 'Trinity Asia (Pvt) Ltd.' },
        { name: 'Timex Garments (Pvt) Ltd.' },
        { name: 'SilverMill Natural Beverages (Pvt) Ltd.' },
        { name: 'Smart Dragon Lanka (Pvt) Ltd.' },
        { name: 'Swiss Lanka Commodities (Pvt) Ltd.' },
        { name: 'Sisili Hanaro Encare (Pvt) Ltd.' },
        { name: 'Island Designs Giftware.' },
        { name: 'SGS Lanka (Pvt) Ltd.' },
        { name: 'Samuel 7 Restaurant & Bar.' }
    ];

    const renderClients = async () => {
        const clientTrack = document.getElementById('client-track');
        if (!clientTrack) return;

        let activeClients = [];

        try {
            const response = await fetch('assets/data/clients.json');
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    activeClients = data;
                }
            }
        } catch (error) {
            console.warn('Failed to fetch clients.json (possibly local CORS). Trying script fallback.', error);
        }

        // If fetch failed or was empty, try the loaded clients.js global variable, then hardcoded defaults
        if (activeClients.length === 0) {
            activeClients = (window.triaxisClients && Array.isArray(window.triaxisClients) && window.triaxisClients.length > 0)
                ? window.triaxisClients
                : defaultClients;
        }

        // Duplicate the list multiple times for infinite scroll seamless effect
        // Use 6 copies for longer seamless loop on large screens
        const fullList = [...activeClients, ...activeClients, ...activeClients, ...activeClients, ...activeClients, ...activeClients];
        
        clientTrack.innerHTML = fullList.map((client) => `
            <div class="client-item">
                <span>${client.name}</span>
            </div>
        `).join('');
        // Setup interactive drag, touch, and hover scrolling behavior with premium controls
        const setupCarouselInteractions = () => {
            const carousel = document.querySelector('.client-carousel');
            if (!carousel) return;

            let isDragging = false;
            let startX = 0;
            let scrollLeftStart = 0;
            let isPaused = false;
            const scrollSpeed = 0.5; // auto-scroll speed (px per frame)
            let resumeTimeout = null;

            // Start the carousel in the middle of the track on load
            // This provides plenty of scrolling room in both directions for perfect infinite loops
            const setInitialPosition = () => {
                const singleWidth = clientTrack.scrollWidth / 6;
                if (singleWidth > 0) {
                    carousel.scrollLeft = singleWidth * 2;
                }
            };
            
            // Wait for full page load (fonts & styles) for 100% correct layout dimensions
            if (document.readyState === 'complete') {
                setInitialPosition();
            } else {
                window.addEventListener('load', setInitialPosition);
            }

            // ── Seamless wrap function ──────────────────────────────────
            const checkWrap = () => {
                const singleWidth = clientTrack.scrollWidth / 6;
                if (singleWidth === 0) return;
                
                // If it goes past copy 4, shift back by one copy
                if (carousel.scrollLeft >= singleWidth * 4) {
                    carousel.scrollLeft -= singleWidth;
                    if (isDragging) {
                        scrollLeftStart -= singleWidth;
                    }
                } 
                // If it goes before copy 2, shift forward by one copy
                else if (carousel.scrollLeft <= singleWidth * 1) {
                    carousel.scrollLeft += singleWidth;
                    if (isDragging) {
                        scrollLeftStart += singleWidth;
                    }
                }
            };

            // ── Auto Scroll (shared for all devices) ──────────────────────────
            const autoScroll = () => {
                if (!isPaused && !isDragging) {
                    carousel.scrollLeft += scrollSpeed;
                }
                
                checkWrap();
                requestAnimationFrame(autoScroll);
            };

            // ── Hover Pause (mouse only - completely avoids sticky touch emulation pause) ──
            carousel.addEventListener('pointerenter', (e) => {
                if (e.pointerType === 'mouse') {
                    isPaused = true;
                }
            });
            carousel.addEventListener('pointerleave', (e) => {
                if (e.pointerType === 'mouse') {
                    if (!isDragging) isPaused = false;
                }
            });

            // ── Drag & Touch (unified via Pointer Events) ─────────────────────
            carousel.addEventListener('pointerdown', (e) => {
                if (e.button === 2) return; // Ignore right clicks
                
                isDragging = true;
                isPaused = true;
                carousel.classList.add('grabbing');
                
                // Keep tracking pointer even if it leaves the element bounds
                try {
                    carousel.setPointerCapture(e.pointerId);
                } catch (err) {}
                
                startX = e.pageX - carousel.offsetLeft;
                scrollLeftStart = carousel.scrollLeft;
            });

            carousel.addEventListener('pointermove', (e) => {
                if (!isDragging) return;
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 1.5;
                carousel.scrollLeft = scrollLeftStart - walk;
            });

            const handlePointerUp = (e) => {
                if (!isDragging) return;
                isDragging = false;
                carousel.classList.remove('grabbing');
                
                try {
                    carousel.releasePointerCapture(e.pointerId);
                } catch (err) {}

                // Resume auto-scroll after a brief delay
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => {
                    if (!isDragging) isPaused = false;
                }, 1000);
            };

            carousel.addEventListener('pointerup', handlePointerUp);
            carousel.addEventListener('pointercancel', handlePointerUp);

            // Helper to pause auto-scroll temporarily (used by nav buttons)
            const pauseAutoScroll = (duration = 2000) => {
                isPaused = true;
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => {
                    if (!isDragging) isPaused = false;
                }, duration);
            };

            // ── Navigation Buttons ─────────────────────────────────────────────
            const btnPrev = document.getElementById('carousel-prev');
            const btnNext = document.getElementById('carousel-next');

            if (btnPrev && btnNext) {
                // Scroll by 320px (approx 1.2 client cards) on click
                const scrollStep = 320; 

                btnPrev.addEventListener('click', () => {
                    pauseAutoScroll(2500);
                    carousel.scrollBy({
                        left: scrollStep,
                        behavior: 'smooth'
                    });
                });

                btnNext.addEventListener('click', () => {
                    pauseAutoScroll(2500);
                    carousel.scrollBy({
                        left: -scrollStep,
                        behavior: 'smooth'
                    });
                });
            }

            // Page Visibility API — resume when tab becomes active again
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && !isDragging) isPaused = false;
            });

            autoScroll();
        };

        setupCarouselInteractions();

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

            // EmailJS send (Safer mapping using the 'elements' collection)
            const templateParams = {
                name: contactForm.elements['name'].value,
                email: contactForm.elements['email'].value,
                message: contactForm.elements['message'].value,
                title: 'New Message from TriAxis Website',
                time: new Date().toLocaleString()
            };

            emailjs.send('service_o1c8aru', 'template_eublc0p', templateParams)
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
