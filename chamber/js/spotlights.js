/**
 * Chamber of Commerce - Member Spotlights
 * Displays featured member spotlights on the home page
 */

// DOM Elements
const spotlightContainer = document.getElementById('spotlight-container');

// Configuration
const MEMBERS_URL = 'data/members.json';
const SPOTLIGHT_COUNT = 3; // Number of spotlights to show
const MEMBERSHIP_LEVELS = {
    1: 'NP Member',
    2: 'Bronze',
    3: 'Silver',
    4: 'Gold'
};

/**
 * Fetches member data from JSON file
 * @returns {Promise<Array>} Array of member objects or empty array on error
 */
async function getMembers() {
    try {
        const response = await fetch(MEMBERS_URL, {
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
        return [];
    }
}

/**
 * Formats a phone number for display
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
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
 * Creates HTML for a spotlight card
 * @param {Object} member - Member data
 * @returns {string} HTML string for the spotlight card
 */
function createSpotlightCard(member) {
    if (!member) return '';

    return `
        <div class="spotlight-card">
            <div class="spotlight-header">
                <h3>${member.name || 'Business Name'}</h3>
                <span class="membership-badge ${getMembershipClass(member.membershipLevel)}">
                    ${MEMBERSHIP_LEVELS[member.membershipLevel] || 'Member'}
                </span>
            </div>
            
            <div class="spotlight-content">
                ${member.imageUrl ? 
                    `<img src="${member.imageUrl}" alt="${member.name || 'Business'} logo" loading="lazy">` : 
                    '<div class="placeholder-logo">' + (member.name ? member.name.charAt(0) : 'B') + '</div>'
                }
                
                <div class="spotlight-details">
                    ${member.address ? `<p><i class="fas fa-map-marker-alt"></i> ${member.address}</p>` : ''}
                    ${member.phone ? `<p><i class="fas fa-phone"></i> ${formatPhoneNumber(member.phone)}</p>` : ''}
                    ${member.website ? `<p><i class="fas fa-globe"></i> <a href="${member.website.startsWith('http') ? '' : 'https://'}${member.website}" target="_blank" rel="noopener">Website</a></p>` : ''}
                </div>
            </div>
            
            ${member.additionalInfo ? `<div class="spotlight-footer">${member.additionalInfo}</div>` : ''}
        </div>
    `;
}

/**
 * Returns the appropriate CSS class for the membership level
 * @param {number} level - Membership level
 * @returns {string} CSS class name
 */
function getMembershipClass(level) {
    const classes = {
        1: 'np-member',
        2: 'bronze',
        3: 'silver',
        4: 'gold'
    };
    return classes[level] || '';
}

/**
 * Displays member spotlights
 * @param {Array} members - Array of all members
 */
function displaySpotlights(members) {
    if (!spotlightContainer) return;
    
    // Filter for Gold and Silver members only
    const eligibleMembers = members.filter(member => 
        member.membershipLevel >= 3 // 3 = Silver, 4 = Gold
    );
    
    if (eligibleMembers.length === 0) {
        spotlightContainer.innerHTML = '<p>No featured members to display.</p>';
        return;
    }
    
    // Randomly select members (up to SPOTLIGHT_COUNT)
    const selectedMembers = [];
    const maxMembers = Math.min(SPOTLIGHT_COUNT, eligibleMembers.length);
    
    // Create a copy of the array to avoid modifying the original
    const availableMembers = [...eligibleMembers];
    
    for (let i = 0; i < maxMembers; i++) {
        if (availableMembers.length === 0) break;
        
        // Get a random index
        const randomIndex = Math.floor(Math.random() * availableMembers.length);
        // Add the member to selected and remove from available
        selectedMembers.push(availableMembers.splice(randomIndex, 1)[0]);
    }
    
    // Generate HTML for spotlights
    spotlightContainer.innerHTML = selectedMembers.map(createSpotlightCard).join('');
}

/**
 * Initializes the spotlights
 */
async function initSpotlights() {
    if (!spotlightContainer) return;
    
    try {
        const members = await getMembers();
        displaySpotlights(members);
    } catch (error) {
        console.error('Error initializing spotlights:', error);
        spotlightContainer.innerHTML = '<p>Unable to load featured members. Please try again later.</p>';
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with spotlights
    if (document.querySelector('.spotlights')) {
        initSpotlights();
    }
});
