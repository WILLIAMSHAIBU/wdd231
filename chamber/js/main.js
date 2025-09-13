// Main JavaScript for Timbuktu Chamber of Commerce

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const primaryNav = document.getElementById('primaryNav');
const currentDate = document.getElementById('currentDate');
const currentYear = document.getElementById('currentYear');
const lastModified = document.getElementById('lastModified');
const banner = document.querySelector('.banner');
const closeBannerBtn = document.createElement('button');

// Toggle mobile menu
function toggleMenu() {
    document.body.classList.toggle('menu-open');
    primaryNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open');
    
    // Toggle aria-expanded attribute for accessibility
    const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true' || false;
    hamburgerBtn.setAttribute('aria-expanded', !expanded);
    
    // Prevent body scroll when menu is open
    if (primaryNav.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile menu when a nav link is clicked
function closeMenu() {
    document.body.classList.remove('menu-open');
    primaryNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Format and display current date
function displayCurrentDate() {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const today = new Date();
    currentDate.textContent = today.toLocaleDateString('en-US', options);
}

// Update copyright year
function updateCopyrightYear() {
    const year = new Date().getFullYear();
    currentYear.textContent = year;
}

// Display last modified date
function displayLastModified() {
    const lastModifiedDate = new Date(document.lastModified);
    lastModified.textContent = lastModifiedDate.toLocaleString();
}

// Show banner on specific days (Monday, Tuesday, Wednesday)
function showBanner() {
    const today = new Date().getDay();
    // Show banner on Monday (1), Tuesday (2), or Wednesday (3)
    if (today >= 1 && today <= 3) {
        banner.style.display = 'block';
    }
}

// Close banner
function closeBanner() {
    banner.style.display = 'none';
    // Set a cookie or localStorage to remember the user closed the banner
    localStorage.setItem('bannerClosed', 'true');
}

// Check if banner was previously closed
function checkBannerStatus() {
    if (localStorage.getItem('bannerClosed') === 'true') {
        banner.style.display = 'none';
    } else {
        showBanner();
    }
}

// Add close button to banner
function setupBannerCloseButton() {
    closeBannerBtn.textContent = '✕';
    closeBannerBtn.setAttribute('aria-label', 'Close banner');
    closeBannerBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: white;
    `;
    closeBannerBtn.addEventListener('click', closeBanner);
    banner.style.position = 'relative';
    banner.appendChild(closeBannerBtn);
}

// Initialize the application
function init() {
    // Set up event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('#primaryNav a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Set up banner
    if (banner) {
        setupBannerCloseButton();
        checkBannerStatus();
    }
    
    // Update dates
    displayCurrentDate();
    updateCopyrightYear();
    displayLastModified();
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            // If the image is already in the viewport, load it immediately
            if (img.getBoundingClientRect().top < window.innerHeight) {
                img.src = img.dataset.src;
            } else {
                // Otherwise, load it when it comes into view
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            observer.unobserve(img);
                        }
                    });
                });
                observer.observe(img);
            }
        });
    }
}

// Run the initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize events
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Add active class to current navigation link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || 
        (linkHref === 'index.html' && currentPage === '')) {
        link.classList.add('active');
    }
});

// Add a class to the body when JavaScript is enabled
document.documentElement.classList.add('js-enabled');
