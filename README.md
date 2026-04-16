# stormsite.io
A weather forecasting website

# 🌊 STORMSITE — Ocean & Sky Weather

> *Where the forecast meets the horizon.*

**Stormsite** is a beautifully animated, dual‑color weather web application that brings you real‑time current conditions, hourly tides, and a 5‑day cloudcast — all wrapped in a serene **ocean blue & cloud sky** aesthetic.  
Built with pure HTML, CSS, and JavaScript, it uses the OpenWeatherMap API to deliver accurate weather data for any location on Earth.

![Weather Demo](https://stormsiteio.vercel.app/)  

## ✨ Features

- 🌡️ **Live Weather** – temperature, feels like, humidity, wind, pressure, visibility  
- ⏱️ **Hourly Forecast** – next 6 hours at a glance  
- 📅 **5‑Day Forecast** – daily highs, lows, and conditions  
- 🌬️ **Air Quality Index** (AQI) – fetched from OpenWeatherMap’s pollution API  
- 🧭 **Geolocation** – one‑tap weather for your current spot  
- 🔁 **Unit Toggle** – switch between °C / °F, saved in your browser  
- 🕒 **Live Clock** – always shows your local time  
- 🧠 **Recent Cities** – last 6 cities stored in `localStorage`  
- ☁️ **Animated Background** – drifting clouds + gentle wave overlay  
- 📱 **Fully Responsive** – works on mobile, tablet, and desktop  

---

## 🎨 Color Palette

| Role        | Color (Hex)          |
|-------------|----------------------|
| Deep Ocean  | `#0a2f44` → `#1c5a7a` |
| Glass Panels| `rgba(10,55,75,0.6)` |
| Cloud White | `#eef7ff`            |
| Highlight   | `#80c0dd` / `#c3edff` |

---

## 🚀 Live Demo

You can try Stormsite instantly (if hosted) – or run it locally in 2 minutes.

---

## 📦 Getting Started

### 1. Clone or download the repository

```bash
git clone https://github.com/VIBE014/stormsite.git
cd stormsite

2. Get a free API key
Go to OpenWeatherMap

Sign up / log in

Copy your API key (the free tier gives 1,000 calls/day – more than enough)

3. Add your API key
Open script.js and replace the placeholder:

javascript
const API_KEY = 'YOUR_OPENWEATHER_API_KEY';   // 👈 paste your key here
4. Open the app
Simply open index.html in any modern browser (Chrome, Firefox, Edge, Safari).
No build steps, no dependencies – pure web magic.

🧩 Project Structure
stormsite/
├── index.html      # main structure
├── style.css       # ocean/cloud theme + animations
├── script.js       # weather logic, API calls, interactivity
└── README.md       # you're reading it
🌐 API Endpoints Used
Endpoint	Purpose
weather?q={city}	current weather
forecast?q={city}	5‑day / 3‑hour forecast
air_pollution?lat={lat}&lon={lon}	air quality index (AQI)
All requests use your API key and support units=metric or imperial.

🛠️ Built With
HTML5 – semantic layout

CSS3 – Flexbox, Grid, Glassmorphism, keyframe animations

JavaScript (ES6) – async/await, Fetch API, LocalStorage

OpenWeatherMap API – reliable weather data

📸 Preview (Concept)
Current Weather	Hourly & 5‑day
https://stormsiteio.vercel.app//300x200?text=Current+Weather  https://stormsiteio.vercel.app/300x200?text=Hourly+Forecast
🧪 Future Enhancements (Ideas)
🌦️ Dynamic weather icons with subtle particle effects (rain, snow)

🗺️ Mini radar map overlay

📢 Severe weather alerts (via OpenWeatherMap OneCall)

🌙 Dark/light mode toggle (ocean by night / sky by day)

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to help.

📄 License
This project is MIT licensed – feel free to use, modify, and share.

🙏 Acknowledgements
Weather data by OpenWeatherMap

Fonts by Google Fonts (Inter)

Inspired by the calm of the ocean and the vastness of the sky

Made with ☁️ + 🌊 + ⚡
Stay curious, stay weather‑aware.
