// ===================== CONFIG =====================
const API_KEY = '5653e706ceb01e537c389bdd54d76e21';   // replace with your key
const BASE = 'https://api.openweathermap.org/data/2.5';
let unitSystem = localStorage.getItem('stormUnit') || 'metric';   // metric = °C, imperial = °F
let currentCity = 'London';
let currentWeatherData = null;
let currentForecast = null;

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const dashboard = document.getElementById('weatherDashboard');
const loadingDiv = document.getElementById('loadingSpinner');
const recentContainer = document.getElementById('recentContainer');
const unitToggle = document.getElementById('unitToggle');
const liveClockSpan = document.getElementById('liveClock');

// recent cities storage
let recentCities = JSON.parse(localStorage.getItem('stormsite_recent')) || ['London', 'Sydney', 'Cape Town', 'Vancouver'];

// ===================== HELPERS =====================
function showLoading(show) {
    loadingDiv.classList.toggle('hidden', !show);
    if (show) dashboard.classList.add('hidden');
    else dashboard.classList.remove('hidden');
}

function showErrorToast(msg) {
    const toast = document.createElement('div');
    toast.innerText = `🌊 ${msg}`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#0c4b68';
    toast.style.color = '#d9f2ff';
    toast.style.padding = '0.7rem 1.2rem';
    toast.style.borderRadius = '2rem';
    toast.style.zIndex = '999';
    toast.style.backdropFilter = 'blur(8px)';
    toast.style.border = '1px solid #6fcbff';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

function updateUnitUI() {
    const symbol = unitSystem === 'metric' ? '°C' : '°F';
    unitToggle.innerText = symbol;
    localStorage.setItem('stormUnit', unitSystem);
    if (currentCity) refreshWeather();
}
unitToggle.addEventListener('click', () => {
    unitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    updateUnitUI();
});

async function fetchAPI(endpoint) {
    const url = `${BASE}/${endpoint}&appid=${API_KEY}&units=${unitSystem}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
}

async function getWeatherByCity(city) {
    const current = await fetchAPI(`weather?q=${encodeURIComponent(city)}`);
    const forecast = await fetchAPI(`forecast?q=${encodeURIComponent(city)}`);
    return { current, forecast };
}

async function getWeatherByCoords(lat, lon) {
    const current = await fetchAPI(`weather?lat=${lat}&lon=${lon}`);
    const forecast = await fetchAPI(`forecast?lat=${lat}&lon=${lon}`);
    return { current, forecast };
}

// ===================== RENDER DASHBOARD =====================
function renderDashboard(weather, forecast) {
    const temp = Math.round(weather.main.temp);
    const feels = Math.round(weather.main.feels_like);
    const humidity = weather.main.humidity;
    const wind = weather.wind.speed;
    const pressure = weather.main.pressure;
    const visibility = (weather.visibility / 1000).toFixed(1);
    const iconCode = weather.weather[0].icon;
    const description = weather.weather[0].description;
    const cityName = `${weather.name}, ${weather.sys.country}`;

    // hourly (next 6 entries)
    const hourly = forecast.list.slice(0, 6);
    // daily (unique dates)
    const dailyMap = new Map();
    forecast.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyMap.has(date)) dailyMap.set(date, item);
    });
    const daily = Array.from(dailyMap.values()).slice(0, 5);

    const tempSymbol = unitSystem === 'metric' ? 'C' : 'F';

    let html = `
        <div class="weather-main">
            <div class="weather-row">
                <div>
                    <h2 style="font-size: 2rem;">${cityName}</h2>
                    <p>${new Date().toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' })}</p>
                </div>
                <div class="temp-card" id="tempToggleClick">
                    <span class="temp-digit">${temp}</span><span style="font-size:1.8rem;">°${tempSymbol}</span>
                    <div style="font-size:0.7rem;">↺ tap to switch unit</div>
                </div>
                <div style="font-size: 4rem;">${getWeatherIcon(iconCode)}</div>
            </div>
            <div style="text-align:center; text-transform:capitalize; margin:0.5rem 0;">${description}</div>
            <div class="stats-grid">
                <div class="stat-card">🌡️ Feels like<br><strong>${feels}°${tempSymbol}</strong></div>
                <div class="stat-card">💧 Humidity<br><strong>${humidity}%</strong></div>
                <div class="stat-card">💨 Wind<br><strong>${wind} ${unitSystem === 'metric' ? 'm/s' : 'mph'}</strong></div>
                <div class="stat-card">📊 Pressure<br><strong>${pressure} hPa</strong></div>
                <div class="stat-card">👁️ Visibility<br><strong>${visibility} km</strong></div>
            </div>
        </div>

        <div style="margin: 1rem 0 0.5rem 0;"><strong>⏱️ HOURLY TIDES</strong></div>
        <div class="hourly-scroll">
            ${hourly.map(h => {
                const time = new Date(h.dt * 1000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                const t = Math.round(h.main.temp);
                return `<div class="hour-item">${time}<br>${getWeatherIcon(h.weather[0].icon)}<br><strong>${t}°</strong></div>`;
            }).join('')}
        </div>

        <div style="margin: 1.5rem 0 0.5rem 0;"><strong>📅 5‑DAY CLOUDCAST</strong></div>
        <div class="forecast-grid">
            ${daily.map(day => {
                const date = new Date(day.dt * 1000);
                const dayName = date.toLocaleDateString(undefined, { weekday:'short' });
                const icon = getWeatherIcon(day.weather[0].icon);
                const tempDay = Math.round(day.main.temp);
                return `<div class="forecast-card">
                    <strong>${dayName}</strong> ${date.getDate()}/${date.getMonth()+1}<br>
                    <div style="font-size:2rem;">${icon}</div>
                    <strong>${tempDay}°${tempSymbol}</strong><br>
                    <small>${day.weather[0].description}</small>
                </div>`;
            }).join('')}
        </div>
        <div id="aqiBox" class="stat-card" style="margin-top:1rem;">🌊 Fetching ocean air quality...</div>
    `;
    dashboard.innerHTML = html;
    document.getElementById('tempToggleClick')?.addEventListener('click', () => {
        unitSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
        updateUnitUI();
        refreshWeather();
    });
    // fetch AQI
    fetchAirQuality(weather.coord.lat, weather.coord.lon);
}

async function fetchAirQuality(lat, lon) {
    try {
        const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (aqiRes.ok) {
            const data = await aqiRes.json();
            const aqi = data.list[0].main.aqi;
            const levels = ['Excellent', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
            const text = levels[aqi-1] || 'Unknown';
            document.getElementById('aqiBox').innerHTML = `💨 Air Quality: ${text} (AQI ${aqi}) • Sea breeze calm.`;
        } else {
            document.getElementById('aqiBox').innerHTML = `🌬️ No alerts — clean ocean breeze.`;
        }
    } catch(e) {
        document.getElementById('aqiBox').innerHTML = `🌊 AQI service offline, but the sky is clear.`;
    }
}

function getWeatherIcon(code) {
    const icons = {
        '01d':'☀️','01n':'🌙','02d':'⛅','02n':'☁️','03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
        '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️','11d':'⛈️','11n':'⛈️','13d':'❄️','13n':'❄️','50d':'🌫️','50n':'🌫️'
    };
    return icons[code] || '🌈';
}

// ===================== CLOUD ANIMATION =====================
function generateClouds() {
    const cloudLayer = document.getElementById('cloudLayer');
    cloudLayer.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        const size = 80 + Math.random() * 180;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.5}px`;
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 70}%`;
        cloud.style.animationDuration = `${20 + Math.random() * 30}s`;
        cloud.style.animationDelay = `${Math.random() * 15}s`;
        cloud.style.opacity = 0.4 + Math.random() * 0.4;
        cloudLayer.appendChild(cloud);
    }
}
generateClouds();

// ===================== WEATHER REFRESH =====================
async function refreshWeather() {
    if (!currentCity) return;
    showLoading(true);
    try {
        const { current, forecast } = await getWeatherByCity(currentCity);
        currentWeatherData = current;
        currentForecast = forecast;
        renderDashboard(current, forecast);
    } catch (err) {
        showErrorToast(`Cannot read tides for "${currentCity}"`);
        dashboard.classList.add('hidden');
    } finally {
        showLoading(false);
    }
}

async function performSearch(city) {
    if (!city.trim()) return;
    showLoading(true);
    try {
        const { current, forecast } = await getWeatherByCity(city);
        currentCity = current.name;
        currentWeatherData = current;
        currentForecast = forecast;
        renderDashboard(current, forecast);
        saveRecentCity(current.name);
        cityInput.value = current.name;
    } catch (err) {
        showErrorToast(`City "${city}" not found in ocean maps`);
    } finally {
        showLoading(false);
    }
}

function saveRecentCity(city) {
    recentCities = recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    recentCities.unshift(city);
    if (recentCities.length > 6) recentCities.pop();
    localStorage.setItem('stormsite_recent', JSON.stringify(recentCities));
    renderRecentChips();
}

function renderRecentChips() {
    recentContainer.innerHTML = recentCities.map(c => `<div class="city-chip" data-city="${c}">🌊 ${c}</div>`).join('');
    document.querySelectorAll('.city-chip').forEach(el => {
        el.addEventListener('click', () => performSearch(el.dataset.city));
    });
}

// ===================== GEOLOCATION =====================
function getMyLocation() {
    if (!navigator.geolocation) {
        showErrorToast("Geolocation not supported");
        return;
    }
    showLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const { current, forecast } = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
            currentCity = current.name;
            renderDashboard(current, forecast);
            saveRecentCity(current.name);
            cityInput.value = current.name;
        } catch (err) {
            showErrorToast("Could not fetch weather for your location");
        } finally {
            showLoading(false);
        }
    }, (err) => {
        showErrorToast("Location access denied");
        showLoading(false);
    });
}

// ===================== LIVE CLOCK =====================
function updateClock() {
    const now = new Date();
    liveClockSpan.innerText = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
}
setInterval(updateClock, 1000);
updateClock();

// ===================== INIT =====================
searchBtn.addEventListener('click', () => performSearch(cityInput.value.trim()));
locationBtn.addEventListener('click', getMyLocation);
renderRecentChips();
updateUnitUI();
performSearch('London');
