// Weather information for Blantyre Chamber of Commerce

// API key for OpenWeatherMap (replace with your actual API key)
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const CITY = 'Blantyre';
const COUNTRY_CODE = 'MW'; // Malawi country code
const UNITS = 'metric'; // Using metric for Malawi

// DOM Elements
const temperatureElement = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const forecastContainer = document.getElementById('forecast-container');

// Function to fetch current weather data from OpenWeatherMap API
async function fetchWeatherData() {
    try {
        // For demo purposes, we'll use mock data
        // In production, use the actual API call:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${API_KEY}`);
        // const currentData = await response.json();
        
        // For demo, use mock data
        const currentData = await getMockCurrentWeatherData();
        updateWeatherUI(currentData);
        
        // Fetch forecast data
        await fetchForecastData();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        displayError();
    }
}

// Function to fetch forecast data
async function fetchForecastData() {
    try {
        // In production, use the actual API call:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=${UNITS}&appid=${API_KEY}`);
        // const forecastData = await response.json();
        
        // For demo, use mock forecast data
        const forecastData = await getMockForecastData();
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        // Don't display error for forecast to avoid disrupting the main content
    }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
    // Update temperature
    if (temperatureElement) {
        temperatureElement.textContent = Math.round(data.main.temp);
    }
    
    // Update weather description
    if (weatherDescription) {
        const description = data.weather[0].description;
        weatherDescription.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    }
    
    // Update weather icon
    if (weatherIcon) {
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].main;
    }
    
    // Update additional weather details
    if (windSpeed) {
        windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)}`; // Convert m/s to km/h
    }
    
    if (feelsLike) {
        feelsLike.textContent = `${Math.round(data.main.feels_like)}`;
    }
    
    if (humidity) {
        humidity.textContent = data.main.humidity;
    }
}

// Function to display forecast data
function displayForecast(forecastData) {
    if (!forecastContainer) return;
    
    // Clear any existing content
    forecastContainer.innerHTML = '';
    
    // Get the next 3 days (excluding today)
    const dailyForecasts = [];
    const today = new Date().toDateString();
    
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Skip if it's today or we already have this day
        if (dateString === today || dailyForecasts.some(d => d.date === dateString)) {
            return;
        }
        
        // Add to our array if we don't have 3 days yet
        if (dailyForecasts.length < 3) {
            dailyForecasts.push({
                date: dateString,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                description: item.weather[0].description
            });
        }
    });
    
    // Create forecast cards
    dailyForecasts.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
            <div class="forecast-temp">${day.temp}°C</div>
        `;
        forecastContainer.appendChild(forecastCard);
    });
}

// Function to display error message
function displayError() {
    const weatherSection = document.querySelector('.weather');
    if (weatherSection) {
        weatherSection.innerHTML = '<p>Weather data is currently unavailable. Please check back later.</p>';
    }
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

// Mock current weather data for demo purposes
function getMockCurrentWeatherData() {
    return new Promise((resolve) => {
        const mockData = {
            coord: {
                lon: 35.0,
                lat: -15.8
            },
            weather: [
                {
                    id: 801,
                    main: "Clouds",
                    description: "few clouds",
                    icon: "02d"
                }
            ],
            base: "stations",
            main: {
                temp: 24,
                feels_like: 25,
                temp_min: 22,
                temp_max: 26,
                pressure: 1015,
                humidity: 68
            },
            visibility: 10000,
            wind: {
                speed: 2.57, // m/s
                deg: 150
            },
            clouds: {
                all: 20
            },
            dt: Math.floor(Date.now() / 1000),
            sys: {
                type: 1,
                id: 6864,
                country: "MW",
                sunrise: Math.floor(Date.now() / 1000) - 3600 * 5,
                sunset: Math.floor(Date.now() / 1000) + 3600 * 7
            },
            timezone: 7200,
            id: 931755,
            name: "Blantyre",
            cod: 200
        };
        
        // Simulate network delay
        setTimeout(() => {
            resolve(mockData);
        }, 500);
    });
}

// Mock forecast data for demo purposes
function getMockForecastData() {
    return new Promise((resolve) => {
        const now = Math.floor(Date.now() / 1000);
        const oneDay = 24 * 60 * 60;
        
        // Generate forecast for 5 days (3-hour intervals)
        const forecastItems = [];
        
        // Helper function to generate random temperature in a range
        const randomTemp = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
        
        // Weather conditions for variety
        const weatherConditions = [
            { id: 800, main: 'Clear', description: 'clear sky', icon: '01' },
            { id: 801, main: 'Clouds', description: 'few clouds', icon: '02' },
            { id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03' },
            { id: 500, main: 'Rain', description: 'light rain', icon: '10' },
            { id: 300, main: 'Drizzle', description: 'light intensity drizzle', icon: '09' }
        ];
        
        // Generate 5 days of forecast (8 entries per day)
        for (let day = 0; day < 5; day++) {
            const baseTemp = 22 + day; // Slight variation each day
            
            for (let hour = 0; hour < 24; hour += 3) {
                const timestamp = now + (day * oneDay) + (hour * 3600);
                const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
                const tempVariation = (Math.random() * 6) - 3; // -3 to +3 degree variation
                
                forecastItems.push({
                    dt: timestamp,
                    main: {
                        temp: baseTemp + tempVariation,
                        feels_like: baseTemp + tempVariation + 1,
                        temp_min: baseTemp - 2,
                        temp_max: baseTemp + 2,
                        pressure: 1015,
                        sea_level: 1015,
                        grnd_level: 1000,
                        humidity: 60 + (Math.random() * 20),
                        temp_kf: 0
                    },
                    weather: [
                        {
                            id: condition.id,
                            main: condition.main,
                            description: condition.description,
                            icon: `${condition.icon}d` // 'd' for day, 'n' for night
                        }
                    ],
                    clouds: { all: condition.id === 800 ? 0 : 20 + Math.random() * 60 },
                    wind: {
                        speed: 1 + Math.random() * 5,
                        deg: Math.random() * 360,
                        gust: 0
                    },
                    visibility: 10000,
                    pop: 0,
                    sys: { pod: hour > 6 && hour < 18 ? 'd' : 'n' },
                    dt_txt: new Date(timestamp * 1000).toISOString()
                });
            }
        }
        
        const mockForecast = {
            cod: '200',
            message: 0,
            cnt: forecastItems.length,
            list: forecastItems,
            city: {
                id: 931755,
                name: "Blantyre",
                coord: {
                    lat: -15.8,
                    lon: 35.0
                },
                country: "MW",
                population: 0,
                timezone: 7200,
                sunrise: now - 3600 * 5,
                sunset: now + 3600 * 7
            }
        };
        
        // Simulate network delay
        setTimeout(() => {
            resolve(mockForecast);
        }, 800);
    });
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a page with weather elements
    if (document.querySelector('.weather')) {
        fetchWeatherData();
    }
    
    // Update the time every minute
    setInterval(updateDateTime, 60000);
    updateDateTime();
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
