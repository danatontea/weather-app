/**
 * Weather App - Aplicația principală
 * Coordonează toate componentele și gestionează logica aplicației
 */

class WeatherApp {
    constructor() {
        this.weatherService = new WeatherService();
        this.uiController = new UIController();
        this.recentSearches = [];
        this.currentWeatherData = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Inițializează aplicația
     */
    async init() {
        try {
            // Load saved data
            this.loadRecentSearches();
            this.loadUserPreferences();
            
            // Setup UI event listeners
            this.setupEventListeners();
            
            // Display recent searches
            this.uiController.displayRecentSearches(
                this.recentSearches, 
                (city) => this.searchWeather(city)
            );
            
            // Load initial weather data
            await this.loadInitialWeather();
            
            this.isInitialized = true;
            console.log('Weather App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Weather App:', error);
            this.uiController.showError('Eroare la inițializarea aplicației.');
        }
    }

    /**
     * Configurează event listeners
     */
    setupEventListeners() {
        this.uiController.setupEventListeners({
            onSearch: (city) => this.searchWeather(city),
            onLocationRequest: () => this.requestCurrentLocation()
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K pentru focus pe search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.uiController.elements.searchInput.focus();
            }
            
            // Escape pentru a închide erori
            if (e.key === 'Escape') {
                this.uiController.hideError();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.uiController.showSuccess('Conexiunea la internet a fost restabilită.');
        });

        window.addEventListener('offline', () => {
            this.uiController.showError('Conexiunea la internet a fost pierdută.');
        });
    }

    /**
     * Caută vremea pentru un oraș specificat
     * @param {string} city - Numele orașului
     */
    async searchWeather(city) {
        if (!city || this.uiController.isLoadingActive()) {
            return;
        }

        // Validate input
        const validation = this.uiController.validateInput(city);
        if (!validation.isValid) {
            this.uiController.showError(validation.message);
            return;
        }

        const formattedCity = this.uiController.formatCityName(validation.value);
        
        try {
            this.uiController.showLoading(`Caută vremea pentru ${formattedCity}...`);
            
            // Get weather data
            const weatherData = await this.weatherService.getWeatherByCity(formattedCity);
            
            // Display weather data
            this.uiController.displayWeather(weatherData);
            
            // Update favicon
            this.uiController.updateFavicon(weatherData.icon);
            
            // Save to recent searches
            this.addToRecentSearches(formattedCity);
            
            // Update current weather data
            this.currentWeatherData = weatherData;
            
            // Update page title
            document.title = `${weatherData.temperature}°C în ${weatherData.location} - Weather App`;
            
            console.log('Weather data loaded successfully for:', formattedCity);
            
        } catch (error) {
            console.error('Error searching weather:', error);
            this.uiController.showError(error.message || CONFIG.ERRORS.API_ERROR);
        }
    }

    /**
     * Solicită locația curentă a utilizatorului
     */
    async requestCurrentLocation() {
        if (this.uiController.isLoadingActive()) {
            return;
        }

        try {
            this.uiController.showLoading('Obțin locația ta...');
            
            // Get current location
            const location = await this.weatherService.getCurrentLocation();
            
            this.uiController.showLoading('Caută vremea pentru locația ta...');
            
            // Get weather for current location
            const weatherData = await this.weatherService.getWeatherByCoordinates(
                location.latitude, 
                location.longitude
            );
            
            // Display weather data
            this.uiController.displayWeather(weatherData);
            
            // Update favicon
            this.uiController.updateFavicon(weatherData.icon);
            
            // Update current weather data
            this.currentWeatherData = weatherData;
            
            // Update page title
            document.title = `${weatherData.temperature}°C în ${weatherData.location} - Weather App`;
            
            this.uiController.showSuccess('Locația ta a fost găsită cu succes!');
            
            console.log('Current location weather loaded successfully');
            
        } catch (error) {
            console.error('Error getting current location:', error);
            this.uiController.showError(error.message || CONFIG.ERRORS.GEOLOCATION_DENIED);
        }
    }

    /**
     * Încarcă vremea inițială (oraș implicit)
     */
    async loadInitialWeather() {
        try {
            // Check if we have a saved last search
            const lastSearch = localStorage.getItem('weatherAppLastSearch');
            const defaultCity = lastSearch || CONFIG.DEFAULT_LOCATIONS[0];
            
            await this.searchWeather(defaultCity);
            
        } catch (error) {
            console.error('Error loading initial weather:', error);
            // If initial load fails, just show the interface without weather data
        }
    }

    /**
     * Adaugă un oraș la lista de căutări recente
     * @param {string} city - Numele orașului
     */
    addToRecentSearches(city) {
        try {
            // Remove if already exists
            const existingIndex = this.recentSearches.indexOf(city);
            if (existingIndex > -1) {
                this.recentSearches.splice(existingIndex, 1);
            }
            
            // Add to beginning
            this.recentSearches.unshift(city);
            
            // Keep only max recent searches
            if (this.recentSearches.length > CONFIG.UI.MAX_RECENT_SEARCHES) {
                this.recentSearches = this.recentSearches.slice(0, CONFIG.UI.MAX_RECENT_SEARCHES);
            }
            
            // Save to storage
            this.saveRecentSearches();
            
            // Update UI
            this.uiController.displayRecentSearches(
                this.recentSearches, 
                (city) => this.searchWeather(city)
            );
            
            // Save as last search
            localStorage.setItem('weatherAppLastSearch', city);
            
        } catch (error) {
            console.error('Error adding to recent searches:', error);
        }
    }

    /**
     * Încarcă căutările recente din localStorage
     */
    loadRecentSearches() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE.RECENT_SEARCHES);
            if (stored) {
                this.recentSearches = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
            this.recentSearches = [];
        }
    }

    /**
     * Salvează căutările recente în localStorage
     */
    saveRecentSearches() {
        try {
            localStorage.setItem(
                CONFIG.STORAGE.RECENT_SEARCHES, 
                JSON.stringify(this.recentSearches)
            );
        } catch (error) {
            console.error('Error saving recent searches:', error);
        }
    }

    /**
     * Încarcă preferințele utilizatorului
     */
    loadUserPreferences() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE.USER_PREFERENCES);
            if (stored) {
                const preferences = JSON.parse(stored);
                
                // Apply theme
                if (preferences.theme) {
                    this.uiController.updateTheme(preferences.theme);
                }
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    }

    /**
     * Salvează preferințele utilizatorului
     * @param {Object} preferences - Preferințele de salvat
     */
    saveUserPreferences(preferences) {
        try {
            const existing = localStorage.getItem(CONFIG.STORAGE.USER_PREFERENCES);
            const current = existing ? JSON.parse(existing) : {};
            
            const updated = { ...current, ...preferences };
            
            localStorage.setItem(
                CONFIG.STORAGE.USER_PREFERENCES, 
                JSON.stringify(updated)
            );
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }

    /**
     * Șterge toate căutările recente
     */
    clearRecentSearches() {
        this.uiController.showConfirmModal(
            'Ești sigur că vrei să ștergi toate căutările recente?',
            () => {
                this.recentSearches = [];
                this.saveRecentSearches();
                this.uiController.displayRecentSearches([], null);
                this.uiController.showSuccess('Căutările recente au fost șterse.');
            }
        );
    }

    /**
     * Reîmprospătează datele meteorologice curente
     */
    async refreshWeather() {
        if (!this.currentWeatherData) {
            return;
        }

        try {
            this.uiController.showLoading('Actualizez datele meteorologice...');
            
            const weatherData = await this.weatherService.getWeatherByCity(
                this.currentWeatherData.location
            );
            
            this.uiController.displayWeather(weatherData);
            this.currentWeatherData = weatherData;
            
            this.uiController.showSuccess('Datele meteorologice au fost actualizate.');
            
        } catch (error) {
            console.error('Error refreshing weather:', error);
            this.uiController.showError('Eroare la actualizarea datelor.');
        }
    }

    /**
     * Exportă datele meteorologice curente
     * @returns {Object} - Datele pentru export
     */
    exportWeatherData() {
        if (!this.currentWeatherData) {
            return null;
        }

        return {
            location: this.currentWeatherData.location,
            temperature: this.currentWeatherData.temperature,
            description: this.currentWeatherData.description,
            timestamp: this.currentWeatherData.timestamp,
            exported_at: new Date().toISOString()
        };
    }

    /**
     * Obține statusul aplicației
     * @returns {Object} - Statusul aplicației
     */
    getAppStatus() {
        return {
            initialized: this.isInitialized,
            hasWeatherData: !!this.currentWeatherData,
            recentSearchesCount: this.recentSearches.length,
            isLoading: this.uiController.isLoadingActive()
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.weatherApp = new WeatherApp();
        
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            if (window.weatherApp && window.weatherApp.uiController) {
                window.weatherApp.uiController.showError('A apărut o eroare neașteptată.');
            }
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            if (window.weatherApp && window.weatherApp.uiController) {
                window.weatherApp.uiController.showError('A apărut o eroare neașteptată.');
            }
        });
        
    } catch (error) {
        console.error('Error initializing Weather App:', error);
    }
});