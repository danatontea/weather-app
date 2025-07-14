# Weather App 🌤️

O aplicație web modernă pentru afișarea informațiilor meteorologice, construită cu HTML, CSS și JavaScript vanilla.

## ✨ Funcționalități

- **Vremea curentă**: Afișează temperatura, descrierea vremii și iconițe sugestive
- **Informații detaliate**: Umiditate, presiune, viteza vântului, vizibilitate, ora răsăritului și apusului
- **Localizare**: Obține automat locația utilizatorului
- **Căutare**: Caută vremea pentru orice oraș din lume
- **Istoric**: Salvează și afișează căutările recente
- **Design responsive**: Funcționează perfect pe desktop și mobile
- **Interfață intuitivă**: Design modern cu animații și efecte vizuale

## 🚀 Instalare și Folosire

### Cerințe preliminare
- Browser web modern (Chrome, Firefox, Safari, Edge)
- Conexiune la internet
- Cheie API de la [OpenWeatherMap](https://openweathermap.org/api) (opțional pentru date reale)

### Instalare rapidă

1. **Clonează repository-ul**:
```bash
git clone https://github.com/username/weather-app.git
cd weather-app
```

2. **Deschide aplicația**:
```bash
# Deschide index.html în browser
open index.html
# sau
start index.html
```

3. **Pentru API real** (opțional):
   - Creează un cont pe [OpenWeatherMap](https://openweathermap.org/api)
   - Obține cheia API gratuită
   - Editează `modules/config.js` și înlocuiește `demo_key` cu cheia ta:
   ```javascript
   API: {
       KEY: 'your_api_key_here',
       // ...
   }
   ```

## 📁 Structura Proiectului

```
weather-app/
├── index.html              # Pagina principală
├── styles.css              # Stiluri CSS
├── app.js                  # Logica principală a aplicației
├── modules/
│   ├── config.js          # Configurări și constante
│   ├── weather-service.js # Serviciu pentru API meteo
│   └── ui-controller.js   # Controller pentru interfața utilizator
└── README.md              # Documentația proiectului
```

## 🔧 Configurare

### Modificarea setărilor

Editează `modules/config.js` pentru a personaliza aplicația:

```javascript
const CONFIG = {
    API: {
        KEY: 'your_api_key',      // Cheia API
        UNITS: 'metric',          // metric, imperial, kelvin
        LANG: 'ro'                // Limba pentru descrieri
    },
    UI: {
        MAX_RECENT_SEARCHES: 5,   // Numărul maxim de căutări recente
        LOADING_TIMEOUT: 10000    // Timeout pentru încărcare (ms)
    }
};
```

### Personalizarea stilurilor

Modifică `styles.css` pentru a schimba aspectul aplicației:

```css
/* Schimbă culorile principale */
body {
    background: linear-gradient(135deg, #your-color 0%, #your-color2 100%);
}

/* Personalizează cardurile */
.weather-card {
    border-radius: 20px; /* Colțuri mai rotunjite */
    box-shadow: 0 15px 35px rgba(0,0,0,0.3); /* Umbră mai pronunțată */
}
```

## 🎯 Cum să folosești aplicația

### 1. Căutarea vremii pentru un oraș
- Introdu numele orașului în câmpul de căutare
- Apasă "Caută" sau Enter
- Vremea va fi afișată pe card

### 2. Folosirea locației curente
- Apasă butonul "📍 Locația mea"
- Permite accesul la locație în browser
- Vremea pentru locația ta va fi afișată

### 3. Căutări recente
- Orașele căutate recent apar sub formularul de căutare
- Apasă pe orice oraș din istoric pentru a revedea vremea

### 4. Scurtături de tastatură
- `Ctrl/Cmd + K`: Focus pe câmpul de căutare
- `Escape`: Închide mesajele de eroare

## 🛠️ Dezvoltare

### Adăugarea de noi funcționalități

1. **Adăugarea unui nou serviciu**:
```javascript
// În modules/weather-service.js
async getWeatherForecast(city) {
    // Implementarea pentru prognoză pe mai multe zile
}
```

2. **Modificarea interfței**:
```javascript
// În modules/ui-controller.js
displayForecast(forecastData) {
    // Logica pentru afișarea prognozei
}
```

3. **Actualizarea configurației**:
```javascript
// În modules/config.js
FORECAST: {
    DAYS: 5,
    HOURS: 24
}
```
4. **Design Patterns**:

- **Modular Architecture** - Separarea responsabilităților
- **Service Layer** - Abstracție pentru API-uri externe
- **Observer Pattern** - Event-driven updates
- **Singleton Pattern** - Instanțe unice pentru servicii

5. ** Tools & Workflow**:

- **Git/GitHub** - Control versiuni și colaborare
- **VS Code** - Environment de dezvoltare
- **GitHub Pages** - Hosting gratuit

6. **APIs & Services**:

- **OpenWeatherMap API** - Date meteo în timp real
- **Geolocation API** - Detectarea automată a locației
- **IP Geolocation API** - Fallback pentru locație


### Testarea aplicației

1. **Testare manuală**:
   - Testează pe diferite device-uri și browsere
   - Verifică funcționalitatea offline
   - Testează cu și fără permisiuni de locație

2. **Debugging**:
   - Deschide Developer Tools (F12)
   - Verifică Console pentru erori
   - Monitorizează Network tab pentru API calls

## 🌐 Deployment

### GitHub Pages

1. **Push către GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Activează GitHub Pages**:
   - Mergi la Settings > Pages
   - Selectează `main` branch
   - Aplicația va fi disponibilă la `https://username.github.io/weather-app`

### Netlify

1. **Conectează repository-ul**:
   - Creează cont pe [Netlify](https://netlify.com)
   - Conectează repository-ul GitHub
   - Deploy automat la fiecare push

2. **Configurare custom domain** (opțional):
   - Adaugă domeniul personalizat în setările Netlify
   - Configurează DNS records

## 📱 Compatibilitate

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

##