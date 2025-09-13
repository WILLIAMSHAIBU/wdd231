// Weather information for Timbuktu Chamber of Commerce

// API key for OpenWeatherMap (replace with your actual API key)
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const CITY = 'Timbuktu';
const COUNTRY_CODE = 'ML';
const UNITS = 'imperial'; // Use 'metric' for Celsius

// DOM Elements
const temperatureElement = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const windSpeed = document.getElementById('wind-speed');
const windChill = document.getElementById('wind-chill');

// Function to fetch weather data from OpenWeatherMap API
async function fetchWeatherData() {
    try {
        // In a production environment, you would use the actual API call:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${API_KEY}`);
        // const data = await response.json();
        
        // For demo purposes, we'll use mock data
        // Replace this with the actual API call in production
        const data = await getMockWeatherData();
        
        updateWeatherUI(data);
        calculateWindChill(data.main.temp, data.wind.speed);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError();
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Update temperature
    temperatureElement.textContent = Math.round(data.main.temp);
    
    // Update weather description
    const description = data.weather[0].description;
    weatherDescription.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
    
    // Update wind speed
    windSpeed.textContent = Math.round(data.wind.speed);
}

// Function to calculate wind chill
function calculateWindChill(temperature, windSpeed) {
    // Only calculate wind chill for temperatures at or below 50°F and wind speed above 3 mph
    if (temperature <= 50 && windSpeed > 3) {
        // Formula for wind chill in Fahrenheit
        const windChillValue = 35.74 + (0.6215 * temperature) - (35.75 * Math.pow(windSpeed, 0.16)) + (0.4275 * temperature * Math.pow(windSpeed, 0.16));
        windChill.textContent = Math.round(windChillValue) + '°F';
    } else {
        windChill.textContent = 'N/A';
    }
}

// Function to display error message
function displayError() {
    weatherDescription.textContent = 'Weather data not available';
    temperatureElement.textContent = '--';
    windSpeed.textContent = '--';
    windChill.textContent = 'N/A';
}

// Mock weather data for demo purposes
function getMockWeatherData() {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            const mockData = {
                coord: {
                    lon: -3.0074,
                    lat: 16.7735
                },
                weather: [
                    {
                        id: 800,
                        main: "Clear",
                        description: "clear sky",
                        icon: "01d"
                    }
                ],
                base: "stations",
                main: {
                    temp: 95,
                    feels_like: 92,
                    temp_min: 88,
                    temp_max: 102,
                    pressure: 1012,
                    humidity: 15
                },
                visibility: 10000,
                wind: {
                    speed: 12,
                    deg: 30
                },
                clouds: {
                    all: 0
                },
                dt: Math.floor(Date.now() / 1000),
                sys: {
                    type: 1,
                    id: 1234,
                    country: "ML",
                    sunrise: Math.floor(Date.now() / 1000) - 6 * 3600,
                    sunset: Math.floor(Date.now() / 1000) + 6 * 3600
                },
                timezone: 0,
                id: 2449066,
                name: "Timbuktu",
                cod: 200
            };
            resolve(mockData);
        }, 500);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    
    // Update weather data every 30 minutes
    setInterval(fetchWeatherData, 30 * 60 * 1000);
});

// Add a function to get the current weather condition for other parts of the application
function getCurrentWeather() {
    return {
        temperature: parseInt(temperatureElement.textContent) || 0,
        condition: weatherDescription.textContent || 'Clear',
        windSpeed: parseFloat(windSpeed.textContent) || 0,
        windChill: windChill.textContent === 'N/A' ? null : parseInt(windChill.textContent)
    };
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentWeather,
        calculateWindChill
    };
}
