// URL for the prophet data
const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

// Get the cards container
const cards = document.querySelector('#cards');

// Async function to fetch prophet data
async function getProphetData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayProphets(data.prophets);
    } catch (error) {
        console.error('Error fetching prophet data:', error);
        cards.innerHTML = '<p>Sorry, there was an error loading the prophet data. Please try again later.</p>';
    }
}

// Function to display prophets
const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create card elements
        const card = document.createElement('section');
        const fullName = document.createElement('h2');
        const portrait = document.createElement('img');
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        // Set the name
        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        
        // Set image attributes
        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} - ${prophet.order}th Latter-day President`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '340');
        portrait.setAttribute('height', '440');
        
        // Create and append additional info
        const birthDate = document.createElement('p');
        birthDate.innerHTML = `<strong>Date of Birth:</strong> ${prophet.birthdate}`;
        
        const birthPlace = document.createElement('p');
        birthPlace.innerHTML = `<strong>Place of Birth:</strong> ${prophet.birthplace}`;
        
        const deathDate = document.createElement('p');
        deathDate.innerHTML = `<strong>Date of Death:</strong> ${prophet.death || 'N/A'}`;
        
        const prophetYears = document.createElement('p');
        prophetYears.innerHTML = `<strong>Years as Prophet:</strong> ${prophet.length || 'N/A'}`;
        
        const prophetOrder = document.createElement('p');
        prophetOrder.innerHTML = `<strong>Order:</strong> ${getNumberWithSuffix(prophet.order)} President`;
        
        // Append elements to card content
        cardContent.appendChild(birthDate);
        cardContent.appendChild(birthPlace);
        cardContent.appendChild(deathDate);
        cardContent.appendChild(prophetYears);
        cardContent.appendChild(prophetOrder);
        
        // Append elements to card
        card.appendChild(fullName);
        card.appendChild(portrait);
        card.appendChild(cardContent);
        
        // Add card to the DOM
        cards.appendChild(card);
    });
};

// Helper function to get number with ordinal suffix
function getNumberWithSuffix(number) {
    if (number >= 11 && number <= 13) {
        return number + 'th';
    }
    switch (number % 10) {
        case 1: return number + 'st';
        case 2: return number + 'nd';
        case 3: return number + 'rd';
        default: return number + 'th';
    }
}

// Call the function to get and display the data
getProphetData();
