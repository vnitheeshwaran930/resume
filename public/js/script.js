/**
 * Nitheeshwaran V. - Personal Portfolio & Resume
 * Interactive Client Script (Vanilla JavaScript ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Theme Toggle (Dark / Light Mode)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check saved theme in localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
            themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        } else {
            themeIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
            themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
    }

    // ----------------------------------------------------------------------
    // 2. Sticky Header & Mobile Hamburger Menu
    // ----------------------------------------------------------------------
    const siteHeader = document.getElementById('siteHeader');
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header scroll background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    });

    // Toggle mobile menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            if (isActive) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ----------------------------------------------------------------------
    // 3. Active Navigation Indicator (Scrollspy)
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightActiveNav);

    // ----------------------------------------------------------------------
    // 4. Dynamic Typewriter Effect for Hero
    // ----------------------------------------------------------------------
    const typingElement = document.getElementById('roleTypewriter');
    if (typingElement) {
        const phrases = [
            "Computer Science Engineering Student",
            "Aspiring Software Developer",
            "Full Stack Web Enthusiast",
            "Java & Python Programmer"
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 1800; // Pause at full phrase
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(typeLoop, typingSpeed);
        }

        typeLoop();
    }

    // ----------------------------------------------------------------------
    // 5. Skills Progress Fill & Category Filter Tabs
    // ----------------------------------------------------------------------
    const skillCards = document.querySelectorAll('.skill-card');
    const skillTabBtns = document.querySelectorAll('.skill-tab-btn');

    // Animate skill bars when in viewport
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fillBar = entry.target.querySelector('.skill-progress-fill');
                if (fillBar) {
                    const percent = fillBar.getAttribute('data-percent') || '85';
                    fillBar.style.width = `${percent}%`;
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));

    // Tab Filtering
    skillTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            skillTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCategory = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    // Re-trigger bar fill
                    const fill = card.querySelector('.skill-progress-fill');
                    if (fill) fill.style.width = `${fill.getAttribute('data-percent')}%`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 6. Interactive Contact Form with AJAX fetch()
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            clearFormErrors();

            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            // Client-side quick validation
            let isValid = true;

            if (!name || name.length < 2) {
                showFieldError('contactName', 'Please enter your name (min 2 characters).');
                isValid = false;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFieldError('contactEmail', 'Please enter a valid email address.');
                isValid = false;
            }

            if (!subject || subject.length < 3) {
                showFieldError('contactSubject', 'Please enter a subject (min 3 characters).');
                isValid = false;
            }

            if (!message || message.length < 10) {
                showFieldError('contactMessage', 'Please enter a message (min 10 characters).');
                isValid = false;
            }

            if (!isValid) {
                showToast('error', 'Validation Error', 'Please correct the highlighted fields.');
                return;
            }

            // Disable button and show loading state
            setButtonLoading(true);

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showToast('success', 'Message sent successfully!', data.message || 'Message sent successfully!');
                    contactForm.reset();
                } else {
                    // Express-validator errors array
                    if (data.errors && Array.isArray(data.errors)) {
                        data.errors.forEach(err => {
                            const fieldId = `contact${err.field.charAt(0).toUpperCase() + err.field.slice(1)}`;
                            showFieldError(fieldId, err.msg);
                        });
                    }
                    showToast('error', 'Submission Failed', data.message || 'Unable to send your message right now. Please try again later.');
                }
            } catch (err) {
                console.error('Contact Form Fetch Error:', err);
                showToast('error', 'Submission Failed', 'Unable to send your message right now. Please try again later.');
            } finally {
                setButtonLoading(false);
            }
        });

        // Clear error on input change
        ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group');
                    if (group) group.classList.remove('has-error');
                });
            }
        });
    }

    function showFieldError(inputId, errorText) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const group = input.closest('.form-group');
        if (group) {
            group.classList.add('has-error');
            const errSpan = group.querySelector('.form-help-error');
            if (errSpan) errSpan.textContent = errorText;
        }
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-group.has-error').forEach(group => {
            group.classList.remove('has-error');
        });
    }

    function setButtonLoading(isLoading) {
        if (!formSubmitBtn) return;
        if (isLoading) {
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
        } else {
            formSubmitBtn.disabled = false;
            formSubmitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send Message`;
        }
    }

    // ----------------------------------------------------------------------
    // 7. Toast Notification System
    // ----------------------------------------------------------------------
    function showToast(type, title, message) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';

        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconClass}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        container.appendChild(toast);

        // Close on button click
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        // Auto remove after 5.5 seconds
        setTimeout(() => removeToast(toast), 5500);
    }

    function removeToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }

    // ----------------------------------------------------------------------
    // 8. Certificate Modal Handler
    // ----------------------------------------------------------------------
    const certModal = document.getElementById('certificateModal');
    const viewCertBtns = document.querySelectorAll('.btn-view-certificate');
    const closeCertBtns = document.querySelectorAll('.modal-close-trigger');
    const certIframe = document.getElementById('certIframe');

    viewCertBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const certPath = btn.getAttribute('data-cert') || 'assets/certificates/Scion_Internship_Certificate.pdf';
            if (certIframe) {
                certIframe.src = certPath;
            }
            if (certModal) {
                certModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeCertBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (certModal) {
                certModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modal on escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            certModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ----------------------------------------------------------------------
    // 9. Floating Scroll-to-Top Button
    // ----------------------------------------------------------------------
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
