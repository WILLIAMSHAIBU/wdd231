// navigation.js - JavaScript for responsive navigation menu

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('show');
    });

    // Close menu when a link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 600) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('show');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('header') && window.innerWidth < 600) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('show');
        }
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && window.innerWidth < 600) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('show');
            hamburger.focus();
        }
    });
});
