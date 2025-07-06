/**
 * Configurarea aplicației Weather App
 * Conține toate constantele și setările necesare
 */

const CONFIG = {
    // API Configuration
    API: {
        KEY: 'df82a690d546099262b0fe7811ce2a5e',
        BASE_URL: 'https://api.openweathermap.org/data/2.5/weather',
        UNITS: 'metric', // metric, imperial, kelvin
        LANG: 'ro'
    },
     MAX_HISTORY_ITEMS: 10,

    // UI Configuration
    UI: {
        MAX_RECENT_SEARCHES: 5,
        LOADING_TIMEOUT: 10000, // 10 secunde
        ANIMATION_DURATION: 300
    },

    // Local Storage Keys
    STORAGE: {
        RECENT_SEARCHES: 'weatherAppRecentSearches',
        USER_PREFERENCES: 'weatherAppPreferences'
    },

    // Default locations
    DEFAULT_LOCATIONS: [
        'Oradea',
        'București',
        'Cluj-Napoca',
        'Timișoara',
        'Iași',
        'Constanța'
    ],

    // Weather icons mapping
    WEATHER_ICONS: {
        '01d': '☀️', // clear sky day
        '01n': '🌙', // clear sky night
        '02d': '⛅', // few clouds day
        '02n': '☁️', // few clouds night
        '03d': '☁️', // scattered clouds
        '03n': '☁️', // scattered clouds
        '04d': '☁️', // broken clouds
        '04n': '☁️', // broken clouds
        '09d': '🌧️', // shower rain
        '09n': '🌧️', // shower rain
        '10d': '🌦️', // rain day
        '10n': '🌧️', // rain night
        '11d': '⛈️', // thunderstorm
        '11n': '⛈️', // thunderstorm
        '13d': '❄️', // snow
        '13n': '❄️', // snow
        '50d': '🌫️', // mist
        '50n': '🌫️'  // mist
    },

    // Error messages
    ERRORS: {
        NETWORK: 'Eroare de rețea. Verifică conexiunea la internet.',
        LOCATION_NOT_FOUND: 'Orașul nu a fost găsit. Încearcă din nou.',
        GEOLOCATION_DENIED: 'Accesul la locație a fost refuzat.',
        GEOLOCATION_NOT_SUPPORTED: 'Geolocalizarea nu este suportată.',
        API_ERROR: 'Eroare la obținerea datelor meteorologice.',
        TIMEOUT: 'Cererea a expirat. Încearcă din nou.'
    },

    // Success messages
    MESSAGES: {
        LOCATION_FOUND: 'Locația a fost găsită cu succes!',
        WEATHER_LOADED: 'Datele meteorologice au fost încărcate.',
        SEARCH_SAVED: 'Căutarea a fost salvată în istoric.'
    },
    LOGGING: {
    ENABLED: true,
    LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    MAX_LOGS: 100,
  },
    MOCK_DATA : // 
    {
        "coord": {
            "lon": 21.9333,
            "lat": 47.0667
        },
        "weather": [
            {
            "id": 800,
            "main": "Clear",
            "description": "cer senin",
            "icon": "01d"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 32.8,
            "feels_like": 30.97,
            "temp_min": 32.8,
            "temp_max": 33.02,
            "pressure": 1007,
            "humidity": 23,
            "sea_level": 1007,
            "grnd_level": 990
        },
        "visibility": 10000,
        "wind": {
            "speed": 1.54,
            "deg": 50
        },
        "clouds": {
            "all": 0
        },
        "dt": 1751824365,
        "sys": {
            "type": 2,
            "id": 50396,
            "country": "RO",
            "sunrise": 1751769848,
            "sunset": 1751826572
        },
        "timezone": 10800,
        "id": 671768,
        "name": "Oradea",
        "cod": 200
}   
               
                        
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.API);
Object.freeze(CONFIG.UI);
Object.freeze(CONFIG.STORAGE);
Object.freeze(CONFIG.DEFAULT_LOCATIONS);
Object.freeze(CONFIG.WEATHER_ICONS);
Object.freeze(CONFIG.ERRORS);
Object.freeze(CONFIG.MESSAGES);