/**
 * Chamber of Commerce - Directory Page
 * Implements responsive member directory with grid/list view toggle
 */

// DOM Elements
const membersURL = 'data/members.json';
const directory = document.getElementById('memberDirectory');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');

/**
 * Fetches member data from JSON file
 * @returns {Promise<Array>} Array of member objects or empty array on error
 */
async function getMembers() {
    try {
        const response = await fetch(membersURL, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.members || [];
    } catch (error) {
        console.error('Error fetching member data:', error);
        showError('Failed to load member directory. Please check your connection and try again.');
        return [];
    }
}

/**
 * Displays error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    directory.innerHTML = `
        <div class="error-message" role="alert" aria-live="assertive">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="window.location.reload()" aria-label="Retry loading">
                <i class="fas fa-sync-alt"></i> Try Again
            </button>
        </div>
    `;
}

/**
 * Formats a phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = ('' + phone).replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    // Return original if format doesn't match
    return phone;
}

/**
 * Displays members in the specified view
 * @param {Array} members - Array of member objects
 * @param {string} view - View mode ('grid' or 'list')
 */
function displayMembers(members, view = 'grid') {
    if (!members || !Array.isArray(members) || members.length === 0) {
        directory.innerHTML = '<p class="no-members">No members found.</p>';
        return;
    }

    // Set the appropriate class for the view
    directory.className = `member-directory ${view}-view`;
    
    // Generate member cards
    directory.innerHTML = members.map(member => createMemberCard(member, view)).join('');
    
    // Update ARIA attributes for accessibility
    updateViewAccessibility(view);
}

/**
 * Creates HTML for a member card
 * @param {Object} member - Member data
 * @param {string} view - Current view mode
 * @returns {string} HTML string for the member card
 */
function createMemberCard(member, view) {
    const { name, address, phone, website, image, category, joinDate, description, membershipLevel } = member;
    
    // Determine membership level
    const { levelText, levelClass } = getMembershipLevel(membershipLevel);
    
    // Format data
    const formattedPhone = formatPhoneNumber(phone);
    const formattedDate = new Date(joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Base template for both views
    let template = `
        <article class="member-card" data-membership-level="${membershipLevel}">
            <div class="member-logo" ${view === 'list' ? 'hidden' : ''}>
                <img src="images/directory/${image}" 
                     alt="${name} Logo" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='images/placeholder.jpg'"
                     width="300"
                     height="200">
            </div>
            <div class="member-info">
                <h3>${name}</h3>
                <div class="member-meta">
                    <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${address}</p>
                    <p><i class="fas fa-phone" aria-hidden="true"></i> 
                        <a href="tel:${phone.replace(/[^0-9+]/g, '')}" aria-label="Call ${name}">
                            ${formattedPhone}
                        </a>
                    </p>
                    <p><i class="fas fa-globe" aria-hidden="true"></i> 
                        <a href="${website}" target="_blank" rel="noopener noreferrer" 
                           aria-label="Visit ${name} website">
                            Visit Website
                        </a>
                    </p>
                    <p><i class="fas fa-tag" aria-hidden="true"></i> ${category}</p>
                    <p class="member-since">
                        <i class="far fa-calendar-alt" aria-hidden="true"></i> 
                        Member since ${formattedDate}
                    </p>
                </div>
                <div class="member-level ${levelClass}" aria-label="${levelText} member">
                    ${levelText} Member
                </div>
                <p class="member-description">${description}</p>
            </div>
        </article>
    `;
    
    return template;
}

/**
 * Determines membership level information
 * @param {number} level - Membership level number
 * @returns {Object} Level text and class
 */
function getMembershipLevel(level) {
    const levels = {
        1: { text: 'Bronze', class: 'bronze' },
        2: { text: 'Silver', class: 'silver' },
        3: { text: 'Gold', class: 'gold' }
    };
    
    return levels[level] || { text: 'Member', class: 'member' };
}

/**
 * Updates accessibility attributes when view changes
 * @param {string} view - Current view mode
 */
function updateViewAccessibility(view) {
    const isGridView = view === 'grid';
    
    // Update button states
    gridViewBtn.setAttribute('aria-pressed', isGridView);
    listViewBtn.setAttribute('aria-pressed', !isGridView);
    
    // Update live region for screen readers
    const liveRegion = document.getElementById('viewStatus') || createLiveRegion();
    liveRegion.textContent = `View changed to ${view} view`;
    
    // Focus management for better keyboard navigation
    if (isGridView) {
        gridViewBtn.focus();
    } else {
        listViewBtn.focus();
    }
}

/**
 * Creates a live region for accessibility announcements
 * @returns {HTMLElement} The created live region element
 */
function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'viewStatus';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
    return liveRegion;
}

/**
 * Toggles between grid and list view
 * @param {string} view - View to switch to ('grid' or 'list')
 */
function toggleView(view) {
    if (view === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        directory.classList.remove('list-view');
        directory.classList.add('grid-view');
        localStorage.setItem('directoryView', 'grid');
    } else {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        directory.classList.remove('grid-view');
        directory.classList.add('list-view');
        localStorage.setItem('directoryView', 'list');
    }
    
    // Update display with current view
    const members = Array.from(directory.querySelectorAll('.member-card'));
    if (members.length > 0) {
        displayMembers(members, view);
    }
}

/**
 * Initializes the directory page
 */
async function init() {
    try {
        // Show loading state
        directory.innerHTML = '<div class="loading">Loading directory...</div>';
        
        // Load members
        const members = await getMembers();
        
        // Get saved view preference or default to grid
        const savedView = localStorage.getItem('directoryView') || 'grid';
        
        // Sort members by name (case insensitive)
        members.sort((a, b) => a.name.localeCompare(b.name, 'en', {sensitivity: 'base'}));
        
        // Display members
        displayMembers(members, savedView);
        
        // Set initial view
        toggleView(savedView);
        
    } catch (error) {
        console.error('Initialization error:', error);
        showError('An error occurred while initializing the directory.');
    }
}

// Event Listeners with error handling
try {
    // View toggle buttons
    gridViewBtn.addEventListener('click', () => toggleView('grid'));
    listViewBtn.addEventListener('click', () => toggleView('list'));
    
    // Keyboard navigation for view toggles
    [gridViewBtn, listViewBtn].forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (['Enter', ' '].includes(e.key)) {
                e.preventDefault();
                const view = btn.id.replace('View', '').toLowerCase();
                toggleView(view);
            }
        });
    });
    
    // Initialize on DOM content loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
} catch (error) {
    console.error('Error setting up event listeners:', error);
    showError('An error occurred while setting up the page.');
}
