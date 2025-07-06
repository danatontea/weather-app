export class Logger {
  constructor() {
    // Inițializează array-ul de log-uri
    this.logs = [];
    
    // Configurația logger-ului
    this.config = {
      maxLogs: 1000,           // Limita numărului de log-uri în memorie
      enableDebug: true,       // Activează/dezactivează debug logging
      enableConsole: true,     // Activează/dezactivează output-ul în consolă
      timestampFormat: 'HH:mm:ss.SSS' // Format pentru timestamp
    };
    
    // Nivelurile de logging cu priorități
    this.levels = {
      DEBUG: { name: 'DEBUG', priority: 0, color: '#6B7280' },
      INFO:  { name: 'INFO',  priority: 1, color: '#3B82F6' },
      WARN:  { name: 'WARN',  priority: 2, color: '#F59E0B' },
      ERROR: { name: 'ERROR', priority: 3, color: '#EF4444' }
    };
    
    // Nivelul minim de logging (poate fi configurat)
    this.minLevel = this.levels.DEBUG;
    
    console.log('🚀 Logger Service initialized');
  }

  /**
   * Loghează mesaje de debug - pentru informații detaliate în timpul dezvoltării
   * @param {string} message - Mesajul de debug
   * @param {*} data - Date opționale pentru context
   */
  debug(message, data = null) {
    if (this.config.enableDebug && this._shouldLog(this.levels.DEBUG)) {
      this._log(this.levels.DEBUG, message, data);
    }
  }

  /**
   * Loghează informații generale - pentru evenimente importante
   * @param {string} message - Mesajul informativ
   * @param {*} data - Date opționale pentru context
   */
  info(message, data = null) {
    if (this._shouldLog(this.levels.INFO)) {
      this._log(this.levels.INFO, message, data);
    }
  }

  /**
   * Loghează warning-uri - pentru situații care necesită atenție
   * @param {string} message - Mesajul de warning
   * @param {*} data - Date opționale pentru context
   */
  warn(message, data = null) {
    if (this._shouldLog(this.levels.WARN)) {
      this._log(this.levels.WARN, message, data);
    }
  }

  /**
   * Loghează erori - pentru erori și excepții
   * @param {string} message - Mesajul de eroare
   * @param {Error|*} error - Obiectul de eroare sau date pentru context
   */
  error(message, error = null) {
    if (this._shouldLog(this.levels.ERROR)) {
      // Extrage stack trace dacă error este o instanță de Error
      const errorData = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error;
      
      this._log(this.levels.ERROR, message, errorData);
    }
  }

  /**
   * Metodă privată pentru verificarea dacă un nivel de logging trebuie procesat
   * @param {Object} level - Nivelul de logging de verificat
   * @returns {boolean} - True dacă trebuie logat
   */
  _shouldLog(level) {
    return level.priority >= this.minLevel.priority;
  }

  /**
   * Metodă privată pentru formatarea și stocarea log-urilor
   * @param {Object} level - Nivelul de logging
   * @param {string} message - Mesajul de logat
   * @param {*} data - Date opționale
   */
  _log(level, message, data) {
    // Creează timestamp-ul
    const timestamp = this._formatTimestamp();
    
    // Creează obiectul log
    const logEntry = {
      timestamp: new Date(),
      level: level.name,
      message: message,
      data: data,
      id: this._generateLogId()
    };
    
    // Adaugă în array-ul de log-uri
    this.logs.push(logEntry);
    
    // Limitează numărul de log-uri în memorie
    this._limitLogs();
    
    // Afișează în consolă dacă este activat
    if (this.config.enableConsole) {
      this._logToConsole(level, timestamp, message, data);
    }
  }

  /**
   * Formatează timestamp-ul pentru afișare
   * @returns {string} - Timestamp formatat
   */
  _formatTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  /**
   * Generează un ID unic pentru fiecare log
   * @returns {string} - ID-ul log-ului
   */
  _generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limitează numărul de log-uri în memorie
   */
  _limitLogs() {
    if (this.logs.length > this.config.maxLogs) {
      const excess = this.logs.length - this.config.maxLogs;
      this.logs.splice(0, excess);
    }
  }

  /**
   * Afișează log-ul în consolă cu formatare colorată
   * @param {Object} level - Nivelul de logging
   * @param {string} timestamp - Timestamp-ul formatat
   * @param {string} message - Mesajul
   * @param {*} data - Date opționale
   */
  _logToConsole(level, timestamp, message, data) {
    const formattedMessage = `[${timestamp}] [${level.name}] ${message}`;
    
    // Folosește diferite metode de console în funcție de nivel
    switch (level.name) {
      case 'DEBUG':
        console.debug(
          `%c${formattedMessage}`,
          `color: ${level.color}; font-weight: normal;`,
          data ? data : ''
        );
        break;
      case 'INFO':
        console.info(
          `%c${formattedMessage}`,
          `color: ${level.color}; font-weight: bold;`,
          data ? data : ''
        );
        break;
      case 'WARN':
        console.warn(
          `%c${formattedMessage}`,
          `color: ${level.color}; font-weight: bold;`,
          data ? data : ''
        );
        break;
      case 'ERROR':
        console.error(
          `%c${formattedMessage}`,
          `color: ${level.color}; font-weight: bold;`,
          data ? data : ''
        );
        break;
    }
  }

  /**
   * Returnează toate log-urile stocate
   * @returns {Array} - Array-ul cu toate log-urile
   */
  getLogs() {
    return [...this.logs]; // Returnează o copie pentru a evita modificările externe
  }

  /**
   * Returnează log-urile filtrate după nivel
   * @param {string} level - Nivelul pentru filtrare (DEBUG, INFO, WARN, ERROR)
   * @returns {Array} - Array-ul cu log-urile filtrate
   */
  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level.toUpperCase());
  }

  /**
   * Returnează log-urile din ultimele N minute
   * @param {number} minutes - Numărul de minute
   * @returns {Array} - Array-ul cu log-urile recente
   */
  getRecentLogs(minutes = 10) {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoffTime);
  }

  /**
   * Șterge toate log-urile din memorie
   */
  clearLogs() {
    const count = this.logs.length;
    this.logs = [];
    console.log(`🧹 Cleared ${count} log entries`);
  }

  /**
   * Afișează toate log-urile stocate în consolă
   */
  show() {
    console.group('📋 All Stored Logs');
    
    if (this.logs.length === 0) {
      console.log('No logs available');
    } else {
      this.logs.forEach((log, index) => {
        const level = this.levels[log.level];
        const timestamp = this._formatTimestamp();
        console.log(
          `%c[${log.timestamp.toLocaleTimeString()}] [${log.level}] ${log.message}`,
          `color: ${level.color}; font-weight: ${log.level === 'DEBUG' ? 'normal' : 'bold'};`,
          log.data ? log.data : ''
        );
      });
    }
    
    console.groupEnd();
  }

  /**
   * Exportă log-urile ca JSON
   * @returns {string} - Log-urile în format JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Configurează logger-ul
   * @param {Object} options - Opțiuni de configurare
   */
  configure(options = {}) {
    this.config = { ...this.config, ...options };
    
    // Actualizează nivelul minim dacă este specificat
    if (options.minLevel && this.levels[options.minLevel.toUpperCase()]) {
      this.minLevel = this.levels[options.minLevel.toUpperCase()];
    }
    
    this.info('Logger configuration updated', this.config);
  }

  /**
   * Returnează statistici despre log-uri
   * @returns {Object} - Statistici detaliate
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byLevel: {},
      memoryUsage: this.logs.length / this.config.maxLogs * 100,
      oldestLog: this.logs[0]?.timestamp || null,
      newestLog: this.logs[this.logs.length - 1]?.timestamp || null
    };

    // Calculează statistici per nivel
    Object.keys(this.levels).forEach(level => {
      stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
    });

    return stats;
  }
}

// Exportă o instanță unică (Singleton pattern)
export const logger = new Logger();

// Expune logger-ul global pentru debugging rapid
window.logs = {
  // Afișează toate log-urile
  show: () => logger.show(),
  
  // Șterge toate log-urile
  clear: () => logger.clearLogs(),
  
  // Obține toate log-urile
  get: () => logger.getLogs(),
  
  // Obține log-urile după nivel
  level: (level) => logger.getLogsByLevel(level),
  
  // Obține log-urile recente
  recent: (minutes) => logger.getRecentLogs(minutes),
  
  // Obține statistici
  stats: () => logger.getStats(),
  
  // Exportă log-urile
  export: () => logger.exportLogs(),
  
  // Configurează logger-ul
  config: (options) => logger.configure(options),
  
  // Acces direct la metodele de logging
  debug: (msg, data) => logger.debug(msg, data),
  info: (msg, data) => logger.info(msg, data),
  warn: (msg, data) => logger.warn(msg, data),
  error: (msg, error) => logger.error(msg, error)
};

// Mesaj de inițializare
logger.info('Logger service is ready! Use window.logs for quick access.');

// Exemplu de utilizare în comentarii:
/*
// Utilizare de bază:
logger.debug('Debugging user interaction', { userId: 123, action: 'click' });
logger.info('User logged in successfully', { username: 'john_doe' });
logger.warn('API response time is high', { responseTime: 2500 });
logger.error('Failed to save user data', new Error('Database connection failed'));

// Utilizare prin interfața globală:
window.logs.info('Quick log from console');
window.logs.show();  // Afișează toate log-urile
window.logs.clear(); // Șterge toate log-urile
window.logs.stats(); // Obține statistici

// Configurare:
logger.configure({
  maxLogs: 500,
  enableDebug: false,
  minLevel: 'INFO'
});
*/