// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item.active').forEach(el => {
            el.classList.remove('active');
            el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
            item.classList.add('active');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== Scroll Animations (Intersection Observer) =====
const fadeElements = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phone');
    const riderAge = document.getElementById('riderAge');
    const experience = document.getElementById('experience');

    let valid = true;

    [fullName, phone, riderAge, experience].forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            valid = false;
        }
    });

    // Phone validation — Israeli format
    const phoneRegex = /^0\d{8,9}$/;
    const cleanPhone = phone.value.replace(/[-\s]/g, '');
    if (cleanPhone && !phoneRegex.test(cleanPhone)) {
        phone.style.borderColor = '#e74c3c';
        valid = false;
    }

    // Age validation
    const age = parseInt(riderAge.value);
    if (age < 7 || age > 99) {
        riderAge.style.borderColor = '#e74c3c';
        valid = false;
    }

    if (!valid) return;

    // Build WhatsApp message with form data
    const notes = document.getElementById('notes').value;
    const expText = experience.options[experience.selectedIndex].text;

    let message = `היי, אני מתעניין/ת בשיעור ניסיון 🐴\n\n`;
    message += `שם: ${fullName.value}\n`;
    message += `טלפון: ${phone.value}\n`;
    message += `גיל הרוכב/ת: ${riderAge.value}\n`;
    message += `ניסיון: ${expText}\n`;
    if (notes.trim()) {
        message += `הערות: ${notes}\n`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/9720556629407?text=${encoded}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Show success modal
    successModal.classList.add('active');

    // Reset form
    contactForm.reset();
});

// Close modal on background click
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
    }
});
