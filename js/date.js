/**
 * date.js - Handles dynamic date display for the website
 * Updates copyright year and last modified date
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Update last modified date
    const lastModifiedElement = document.getElementById('last-modified');
    if (lastModifiedElement) {
        const lastModified = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        const formattedDate = lastModified.toLocaleDateString('en-US', options);
        lastModifiedElement.textContent = `Last Updated: ${formattedDate}`;
        
        // Add a timestamp to the console for debugging
        console.log(`Page last modified: ${document.lastModified}`);
    }

    // Set current year in the footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });

    // Set up a timer to update the current year (in case the page is open at midnight)
    setInterval(() => {
        const newYear = new Date().getFullYear();
        if (newYear !== currentYear) {
            window.location.reload();
        }
    }, 3600000); // Check every hour
});
