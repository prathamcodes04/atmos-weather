# ATMOS 🌦️

ATMOS is a modern weather forecasting web application built with React and OpenWeather API. It provides real-time weather information with a clean, atmospheric UI and dynamic weather-based themes.

## 🚀 Live Demo

Add your Vercel deployment link here:

https://your-vercel-url.vercel.app

---

## ✨ Features

- 🔍 Search weather by city name
- 🌡️ Current temperature display
- 🤗 Feels-like temperature
- 💧 Humidity information
- 💨 Wind speed tracking
- 👀 Visibility status
- 📊 Atmospheric pressure
- 🌅 Sunrise & Sunset timings
- 🌍 Country and location details
- 🔄 Celsius / Fahrenheit toggle
- 🎨 Dynamic weather-based themes
- ⚡ Fast and responsive UI
- 🚨 Error handling for invalid cities
- ⏳ Loading states during API requests

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript (ES6+)
- CSS3

### API
- OpenWeather API

### Deployment
- Vercel

---

## 📂 Project Structure

```text
atmos-weather/
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/prathamcodes04/atmos-weather.git
```

### Navigate to Project Folder

```bash
cd atmos-weather
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variable

Create a `.env` file in the root directory:

```env
VITE_WEATHER_KEY=YOUR_OPENWEATHER_API_KEY
```

### Run Development Server

```bash
npm run dev
```

The application will start on:

```text
http://localhost:5173
```

---

## 🔑 Getting an OpenWeather API Key

1. Create an account at https://openweathermap.org
2. Generate an API key
3. Add the key to your `.env` file

---

## 📸 Screenshots

### Home Screen

Add screenshot here:

```text
screenshots/home.png
```

### Weather Display

Add screenshot here:

```text
screenshots/weather.png
```

---

## 🧠 Learning Outcomes

Through this project I learned:

- React Hooks (`useState`, `useEffect`)
- API Integration using Fetch API
- Async/Await and Error Handling
- Conditional Rendering
- Environment Variables in Vite
- Responsive UI Development
- State Management in React
- Deployment using Vercel

---

## 🔮 Future Improvements

- 5-Day Weather Forecast
- Weather Charts & Analytics
- Geolocation Support
- Search History
- Favorite Cities
- Dark / Light Theme Toggle
- Progressive Web App (PWA)

---

## 👨‍💻 Author

**Pratham Gupta**

- GitHub: https://github.com/prathamcodes04
- LinkedIn: Add your LinkedIn profile link

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star on GitHub.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
