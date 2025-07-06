/**
 * Weather Service - Gestionează toate operațiunile legate de API-ul meteo
 */

class WeatherService {
    constructor() {
        this.apiKey = CONFIG.API.KEY;
        this.baseUrl = CONFIG.API.BASE_URL;
        this.units = CONFIG.API.UNITS;
        this.lang = CONFIG.API.LANG;
    }

    /**
     * Obține vremea pentru un oraș specificat
     * @param {string} city - Numele orașului
     * @returns {Promise<Object>} - Datele meteorologice
     */
    async getWeatherByCity(city) {
        try {
            // Pentru demo, returnăm date simulate
            if (this.apiKey === 'demo_key') {
                return this.getSimulatedWeatherData(city);
            }

            const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather by city:', error);
            throw new Error(CONFIG.ERRORS.API_ERROR);
        }
    }

    /**
     * Obține vremea pentru coordonate geografice
     * @param {number} lat - Latitudine
     * @param {number} lon - Longitudine
     * @returns {Promise<Object>} - Datele meteorologice
     */
    async getWeatherByCoordinates(lat, lon) {
        try {
            // Pentru demo, returnăm date simulate
            if (this.apiKey === 'demo_key') {
                return this.getSimulatedWeatherData('Locația ta');
            }

            const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            throw new Error(CONFIG.ERRORS.API_ERROR);
        }
    }

    /**
     * Procesează și formatează datele meteorologice
     * @param {Object} data - Datele brute de la API
     * @returns {Object} - Datele procesate
     */
    processWeatherData(data) {
        return {
            location: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            icon: this.getWeatherIcon(data.weather[0].icon),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
            windDirection: data.wind.deg || 0,
            visibility: data.visibility || 0,
            sunrise: data.sys.sunrise * 1000, // Convert to milliseconds
            sunset: data.sys.sunset * 1000,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Obține iconița corespunzătoare pentru vremea actuală
     * @param {string} iconCode - Codul iconului de la API
     * @returns {string} - Emoji-ul corespunzător
     */
    getWeatherIcon(iconCode) {
        return CONFIG.WEATHER_ICONS[iconCode] || '🌤️';
    }

    /**
     * Generează date meteorologice simulate pentru demonstrație
     * @param {string} city - Numele orașului
     * @returns {Object} - Date simulate
     */
    getSimulatedWeatherData(city) {
        const weatherTypes = [
            { icon: '01d', description: 'senin', temp: 25, humidity: 45 },
            { icon: '02d', description: 'parțial înnorat', temp: 22, humidity: 55 },
            { icon: '03d', description: 'înnorat', temp: 18, humidity: 65 },
            { icon: '10d', description: 'ploios', temp: 15, humidity: 85 },
            { icon: '11d', description: 'furtună', temp: 16, humidity: 90 },
            { icon: '13d', description: 'ninsoare', temp: -2, humidity: 75 },
            { icon: '50d', description: 'ceață', temp: 12, humidity: 95 }
        ];

        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const baseTemp = randomWeather.temp;
        const temp = baseTemp + Math.floor(Math.random() * 8 - 4); // ±4 grade variație
        
        const now = new Date();
        const sunrise = new Date(now);
        sunrise.setHours(6, 30 + Math.floor(Math.random() * 60), 0);
        
        const sunset = new Date(now);
        sunset.setHours(18, 30 + Math.floor(Math.random() * 120), 0);

        return {
            location: city,
            country: 'RO',
            temperature: temp,
            feelsLike: temp + Math.floor(Math.random() * 6 - 3),
            description: randomWeather.description,
            icon: this.getWeatherIcon(randomWeather.icon),
            humidity: randomWeather.humidity + Math.floor(Math.random() * 20 - 10),
            pressure: 1013 + Math.floor(Math.random() * 40 - 20),
            windSpeed: Math.floor(Math.random() * 25 + 5),
            windDirection: Math.floor(Math.random() * 360),
            visibility: Math.floor(Math.random() * 5000 + 5000),
            sunrise: sunrise.getTime(),
            sunset: sunset.getTime(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Obține locația curentă a utilizatorului
     * @returns {Promise<Object>} - Coordonatele utilizatorului
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error(CONFIG.ERRORS.GEOLOCATION_NOT_SUPPORTED));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: CONFIG.UI.LOADING_TIMEOUT,
                maximumAge: 300000 // 5 minute cache
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = CONFIG.ERRORS.GEOLOCATION_DENIED;
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Locația nu este disponibilă.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = CONFIG.ERRORS.TIMEOUT;
                            break;
                        default:
                            errorMessage = 'Eroare necunoscută la obținerea locației.';
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }

    /**
     * Validează numele unui oraș
     * @param {string} city - Numele orașului
     * @returns {boolean} - True dacă numele este valid
     */
    validateCityName(city) {
        if (!city || typeof city !== 'string') {
            return false;
        }

        const trimmed = city.trim();
        return trimmed.length >= 2 && trimmed.length <= 50;
    }

    /**
     * Formatează numele orașului pentru afișare
     * @param {string} city - Numele orașului
     * @returns {string} - Numele formatat
     */
    formatCityName(city) {
        return city.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
}