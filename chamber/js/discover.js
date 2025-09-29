document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const visitorMessage = document.querySelector('#visitor-message');

    // Fetch data for attraction cards
    async function fetchAttractions() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayAttractions(data.attractions);
        } catch (error) {
            console.error('Error fetching attractions:', error);
            gallery.innerHTML = '<p>Sorry, we could not load the attractions at this time.</p>';
        }
    }

    // Display attraction cards
    function displayAttractions(attractions) {
        gallery.innerHTML = ''; // Clear loading/error message
        attractions.forEach(attraction => {
            const card = document.createElement('div');
            card.classList.add('card');

            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = attraction.image;
            img.alt = attraction.name;
            img.loading = 'lazy';
            figure.appendChild(img);

            const cardContent = document.createElement('div');
            cardContent.classList.add('card-content');

            const name = document.createElement('h2');
            name.textContent = attraction.name;

            const address = document.createElement('address');
            address.textContent = attraction.address;

            const description = document.createElement('p');
            description.textContent = attraction.description;

            const button = document.createElement('button');
            button.textContent = 'Learn More';
            button.classList.add('btn');

            cardContent.appendChild(name);
            cardContent.appendChild(address);
            cardContent.appendChild(description);
            cardContent.appendChild(button);

            card.appendChild(figure);
            card.appendChild(cardContent);

            gallery.appendChild(card);
        });
    }

    // Handle visitor message
    function handleVisitorMessage() {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

        if (!lastVisit) {
            visitorMessage.textContent = 'Welcome! Let us know if you have any questions.';
        } else {
            const timeDifference = now - lastVisit;
            const daysDifference = Math.floor(timeDifference / oneDay);

            if (daysDifference < 1) {
                visitorMessage.textContent = 'Back so soon! Awesome!';
            } else {
                const dayText = daysDifference === 1 ? 'day' : 'days';
                visitorMessage.textContent = `You last visited ${daysDifference} ${dayText} ago.`;
            }
        }

        localStorage.setItem('lastVisit', now);
    }

    fetchAttractions();
    handleVisitorMessage();
});
