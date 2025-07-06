/**
 * UI Controller - Gestionează toate interacțiunile cu interfața utilizatorului
 */

class UIController {
    constructor() {
        this.elements = {};
        this.isLoading = false;
        this.initializeElements();
    }

    /**
     * Inițializează referințele către elementele DOM
     */
    initializeElements() {
        this.elements = {
            // Form elements
            searchForm: document.getElementById('searchForm'),
            searchInput: document.getElementById('searchInput'),
            locationBtn: document.getElementById('locationBtn'),
            
            // Display elements
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            weatherCard: document.getElementById('weatherCard'),
            
            // Recent searches
            recentSearches: document.getElementById('recentSearches'),
            recentItems: document.getElementById('recentItems'),
            
            // Weather display elements
            location: document.getElementById('location'),
            weatherIcon: document.getElementById('weatherIcon'),
            temperature: document.getElementById('temperature'),
            description: document.getElementById('description'),
            feelsLike: document.getElementById('feelsLike'),
            
            // Weather details
            humidity: document.getElementById('humidity'),
            pressure: document.getElementById('pressure'),
            windSpeed: document.getElementById('windSpeed'),
            visibility: document.getElementById('visibility'),
            sunrise: document.getElementById('sunrise'),
            sunset: document.getElementById('sunset')
        };
    }

    /**
     * Configurează event listeners pentru elementele UI
     * @param {Object} callbacks - Obiect cu callback-urile pentru evenimente
     */
    setupEventListeners(callbacks) {
        // Search form submission
        this.elements.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = this.elements.searchInput.value.trim();
            if (city && callbacks.onSearch) {
                callbacks.onSearch(city);
            }
        });

        // Location button click
        this.elements.locationBtn.addEventListener('click', () => {
            if (callbacks.onLocationRequest) {
                callbacks.onLocationRequest();
            }
        });

        // Input validation
        this.elements.searchInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const isValid = value.length >= 2 && value.length <= 50;
            
            // Visual feedback pentru validare
            if (value.length > 0) {
                e.target.style.borderColor = isValid ? '#28a745' : '#dc3545';
            } else {
                e.target.style.borderColor = '#ddd';
            }
        });

        // Enter key pentru recent searches
        this.elements.recentItems.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('recent-item')) {
                e.target.click();
            }
        });
    }

    /**
     * Afișează starea de loading
     * @param {string} message - Mesaj optional de loading
     */
    showLoading(message = 'Se încarcă datele meteorologice...') {
        this.isLoading = true;
        this.elements.loading.querySelector('div').textContent = `🔄 ${message}`;
        this.elements.loading.classList.remove('hidden');
        this.elements.weatherCard.classList.add('hidden');
        this.elements.error.classList.add('hidden');
        
        // Disable form during loading
        this.elements.searchInput.disabled = true;
        this.elements.locationBtn.disabled = true;
    }

    /**
     * Ascunde starea de loading
     */
    hideLoading() {
        this.isLoading = false;
        this.elements.loading.classList.add('hidden');
        
        // Enable form
        this.elements.searchInput.disabled = false;
        this.elements.locationBtn.disabled = false;
    }

    /**
     * Afișează mesaj de eroare
     * @param {string} message - Mesajul de eroare
     */
    showError(message) {
        this.elements.error.textContent = message;
        this.elements.error.classList.remove('hidden');
        this.hideLoading();
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.elements.error.classList.add('hidden');
        }, 5000);
    }

    /**
     * Ascunde mesajul de eroare
     */
    hideError() {
        this.elements.error.classList.add('hidden');
    }

    /**
     * Afișează datele meteorologice
     * @param {Object} weatherData - Datele meteorologice procesate
     */
    displayWeather(weatherData) {
        try {
            // Update main weather info
            this.elements.location.textContent = weatherData.location;
            this.elements.weatherIcon.textContent = weatherData.icon;
            this.elements.temperature.textContent = `${weatherData.temperature}°C`;
            this.elements.description.textContent = weatherData.description;
            this.elements.feelsLike.textContent = `Se simte ca ${weatherData.feelsLike}°C`;
            
            // Update weather details
            this.elements.humidity.textContent = `${weatherData.humidity}%`;
            this.elements.pressure.textContent = `${weatherData.pressure} hPa`;
            this.elements.windSpeed.textContent = `${weatherData.windSpeed} km/h`;
            this.elements.visibility.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
            
            // Format sunrise and sunset times
            this.elements.sunrise.textContent = new Date(weatherData.sunrise).toLocaleTimeString('ro-RO', {
                hour: '2-digit',
                minute: '2-digit'
            });
            this.elements.sunset.textContent = new Date(weatherData.sunset).toLocaleTimeString('ro-RO', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Show weather card and hide loading
            this.hideLoading();
            this.elements.weatherCard.classList.remove('hidden');
            this.elements.error.classList.add('hidden');
            
            // Clear search input
            this.elements.searchInput.value = '';
            
            // Add entrance animation
            this.elements.weatherCard.style.animation = 'fadeIn 0.5s ease-in';
            
        } catch (error) {
            console.error('Error displaying weather data:', error);
            this.showError('Eroare la afișarea datelor meteorologice.');
        }
    }

    /**
     * Afișează lista de căutări recente
     * @param {Array} searches - Lista căutărilor recente
     * @param {Function} onItemClick - Callback pentru click pe item
     */
    displayRecentSearches(searches, onItemClick) {
        this.elements.recentItems.innerHTML = '';
        
        if (searches.length === 0) {
            this.elements.recentSearches.style.display = 'none';
            return;
        }
        
        this.elements.recentSearches.style.display = 'block';
        
        searches.forEach((city, index) => {
            const item = document.createElement('div');
            item.className = 'recent-item';
            item.textContent = city;
            item.tabIndex = 0; // Make keyboard accessible
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Caută vremea pentru ${city}`);
            
            // Click handler
            item.addEventListener('click', () => {
                if (onItemClick) {
                    onItemClick(city);
                }
            });
            
            // Keyboard handler
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onItemClick) {
                        onItemClick(city);
                    }
                }
            });
            
            this.elements.recentItems.appendChild(item);
        });
    }

    /**
     * Afișează un mesaj de success
     * @param {string} message - Mesajul de success
     */
    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(successElement);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            successElement.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (successElement.parentNode) {
                    successElement.parentNode.removeChild(successElement);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Validează input-ul utilizatorului
     * @param {string} input - Input-ul de validat
     * @returns {Object} - Rezultatul validării
     */
    validateInput(input) {
        const trimmed = input.trim();
        
        if (!trimmed) {
            return {
                isValid: false,
                message: 'Te rog introdu numele unui oraș.'
            };
        }
        
        if (trimmed.length < 2) {
            return {
                isValid: false,
                message: 'Numele orașului trebuie să aibă cel puțin 2 caractere.'
            };
        }
        
        if (trimmed.length > 50) {
            return {
                isValid: false,
                message: 'Numele orașului este prea lung.'
            };
        }
        
        // Check for invalid characters
        const invalidChars = /[<>]/;
        if (invalidChars.test(trimmed)) {
            return {
                isValid: false,
                message: 'Numele orașului conține caractere nevalide.'
            };
        }
        
        return {
            isValid: true,
            value: trimmed
        };
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

    /**
     * Afișează tooltip pentru un element
     * @param {HTMLElement} element - Elementul pentru care se afișează tooltip
     * @param {string} message - Mesajul tooltip
     */
    showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            white-space: nowrap;
            transform: translateX(-50%);
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = '50%';
        tooltip.style.top = '-40px';
        
        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 2000);
    }

    /**
     * Actualizează tema aplicației
     * @param {string} theme - Tema ('light' sau 'dark')
     */
    updateTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        // Save theme preference
        localStorage.setItem('weatherAppTheme', theme);
    }

    /**
     * Obține tema salvată
     * @returns {string} - Tema salvată sau 'light' ca default
     */
    getSavedTheme() {
        return localStorage.getItem('weatherAppTheme') || 'light';
    }

    /**
     * Afișează un modal de confirmare
     * @param {string} message - Mesajul de confirmare
     * @param {Function} onConfirm - Callback pentru confirmare
     * @param {Function} onCancel - Callback pentru anulare
     */
    showConfirmModal(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <p>${message}</p>
                    <div class="modal-buttons">
                        <button class="btn btn-primary confirm-btn">Da</button>
                        <button class="btn btn-secondary cancel-btn">Nu</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            if (onConfirm) onConfirm();
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            if (onCancel) onCancel();
        });
        
        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(modal);
                if (onCancel) onCancel();
            }
        });
    }

    /**
     * Ascunde cardul meteorologic
     */
    hideWeatherCard() {
        this.elements.weatherCard.classList.add('hidden');
    }

    /**
     * Resetează formularul
     */
    resetForm() {
        this.elements.searchInput.value = '';
        this.elements.searchInput.style.borderColor = '#ddd';
    }

    /**
     * Verifică dacă aplicația este în modul loading
     * @returns {boolean}
     */
    isLoadingActive() {
        return this.isLoading;
    }

    /**
     * Adaugă animații la elementele specificate
     * @param {HTMLElement} element - Elementul de animat
     * @param {string} animationType - Tipul animației
     */
    addAnimation(element, animationType) {
        element.style.animation = `${animationType} 0.5s ease-in-out`;
        
        // Remove animation after completion
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    /**
     * Actualizează favicon-ul în funcție de vremea actuală
     * @param {string} weatherIcon - Iconul vremii
     */
    updateFavicon(weatherIcon) {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(weatherIcon, 16, 16);
        
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = canvas.toDataURL();
        
        if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(favicon);
        }
    }
}