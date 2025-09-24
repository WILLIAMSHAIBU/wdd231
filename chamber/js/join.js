// Set the form timestamp when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp in the hidden field
    document.getElementById('timestamp').value = Date.now();
    
    // Initialize modals
    initModals();
    
    // Animate membership cards on page load
    animateMembershipCards();
    
    // Add form validation
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }
});

// Initialize modals for membership details
function initModals() {
    // Get the modal
    const modal = document.getElementById('membershipModal');
    if (!modal) return;
    
    // Get the <span> element that closes the modal
    const span = document.querySelector('.close');
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Add click event to all learn more buttons
    const learnMoreBtns = document.querySelectorAll('.btn-learn-more');
    learnMoreBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const level = this.closest('.membership-card').dataset.level;
            showMembershipDetails(level);
        });
    });
}

// Show membership details in modal
function showMembershipDetails(level) {
    const modal = document.getElementById('membershipModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    // Define membership details
    const membershipDetails = {
        'np': {
            title: 'NP Membership (Non-Profit)',
            price: 'Free',
            benefits: [
                'Business listing in our online directory',
                'Access to member-only events',
                'Monthly newsletter',
                'Discounts on chamber events',
                'Access to member resources'
            ],
            description: 'Perfect for non-profit organizations looking to connect with the local business community.'
        },
        'bronze': {
            title: 'Bronze Membership',
            price: '$250/year',
            benefits: [
                'All NP benefits, plus:', 
                '5% discount on all chamber events',
                'Quarterly training sessions',
                'Business referral program',
                'Social media mentions',
                'Access to member-only job board'
            ],
            description: 'Great for small businesses looking to grow their network and gain visibility.'
        },
        'silver': {
            title: 'Silver Membership',
            price: '$500/year',
            benefits: [
                'All Bronze benefits, plus:',
                '10% discount on all chamber events',
                'Monthly training and workshops',
                'Featured in our monthly newsletter',
                'Priority event registration',
                'Business spotlight opportunity',
                'Access to premium resources'
            ],
            description: 'Ideal for growing businesses looking for increased visibility and networking opportunities.'
        },
        'gold': {
            title: 'Gold Membership',
            price: '$1,000/year',
            benefits: [
                'All Silver benefits, plus:',
                '20% discount on all chamber events',
                'Weekly training and workshops',
                'Featured homepage spotlight',
                'Priority support',
                'VIP event invitations',
                'Dedicated account manager',
                'Premium business listing with logo',
                'Speaking opportunities at events'
            ],
            description: 'Our premium membership for businesses seeking maximum visibility and leadership in the community.'
        }
    };
    
    // Update modal content
    const details = membershipDetails[level];
    modalTitle.textContent = details.title;
    
    let html = `
        <div class="membership-modal-content">
            <p class="membership-price">${details.price}</p>
            <p class="membership-description">${details.description}</p>
            <h3>Benefits Include:</h3>
            <ul class="membership-benefits-list">
                ${details.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
            <button class="btn btn-primary select-membership" data-level="${level}">Select ${details.title.split(' ')[0]}</button>
        </div>
    `;
    
    modalContent.innerHTML = html;
    modal.style.display = "block";
    
    // Add event listener to select button
    const selectBtn = document.querySelector('.select-membership');
    if (selectBtn) {
        selectBtn.addEventListener('click', function() {
            // Check the corresponding radio button
            const radioBtn = document.querySelector(`input[name="membership"][value="${level}"]`);
            if (radioBtn) {
                radioBtn.checked = true;
                // Scroll to the membership selection
                radioBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            modal.style.display = "none";
        });
    }
}

// Animate membership cards on page load
function animateMembershipCards() {
    const cards = document.querySelectorAll('.membership-card');
    
    // Set initial state (invisible and translated down)
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
    });
    
    // Trigger animation after a short delay
    setTimeout(() => {
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Form validation
function validateForm() {
    const form = document.getElementById('joinForm');
    const firstName = form.querySelector('#firstName');
    const lastName = form.querySelector('#lastName');
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const businessName = form.querySelector('#businessName');
    const membership = form.querySelector('input[name="membership"]:checked');
    
    let isValid = true;
    
    // Reset error states
    document.querySelectorAll('.error').forEach(el => el.remove());
    
    // Validate first name
    if (!firstName.value.trim()) {
        showError(firstName, 'Please enter your first name');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        showError(lastName, 'Please enter your last name');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showError(email, 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!phone.value.trim()) {
        showError(phone, 'Please enter your phone number');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate business name
    if (!businessName.value.trim()) {
        showError(businessName, 'Please enter your business name');
        isValid = false;
    }
    
    // Validate membership level
    if (!membership) {
        const membershipField = form.querySelector('.membership-levels');
        showError(membershipField, 'Please select a membership level');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(field, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    error.style.color = '#e74c3c';
    error.style.fontSize = '0.8rem';
    error.style.marginTop = '0.25rem';
    
    // Insert after the field
    field.parentNode.insertBefore(error, field.nextSibling);
    
    // Highlight the field
    field.style.borderColor = '#e74c3c';
    
    // Remove error on input
    field.addEventListener('input', function clearError() {
        error.remove();
        field.style.borderColor = '';
        field.removeEventListener('input', clearError);
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation helper
function isValidPhone(phone) {
    // Simple validation - at least 10 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
}
