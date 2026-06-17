import { useEffect, useState } from "react";
import "./index.css";

// format unit timestamp to time string
function formatTime(unix, timezone) {
  const localMs = (unix + timezone) * 1000;
  const date = new Date(localMs);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  })
    .format(date)
    .toLowerCase();
}

//map owm weather id to emoji & adding condition class
function getConditionMeta(id) {
  if (id >= 200 && id < 300) return { icon: "⛈️", cls: "cond-thunder" };
  if (id >= 300 && id < 400) return { icon: "🌧️", cls: "cond-rain" };
  if (id >= 500 && id < 600) return { icon: "🌧️", cls: "cond-rain" };
  if (id >= 600 && id < 700) return { icon: "❄️", cls: "cond-snow" };
  if (id >= 700 && id < 800) return { icon: "🌫️", cls: "cond-mist" };
  if (id === 800) return { icon: "☀️", cls: "cond-clear" };
  if (id > 800) return { icon: "⛅", cls: "cond-cloud" };
  return { icon: "🌡️", cls: "" };
}

//map temperature to bar percentage
function tempToPercent(temp, unit) {
  const min = unit === "metric" ? -10 : 14; //cold end
  const max = unit === "metric" ? 45 : 113; //hot end
  const clamped = Math.min(Math.max(temp, min), max);
  return Math.round(((clamped - min) / (max - min)) * 100);
}

//formatting todays date
function formatdate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

//fetch function
async function fetchWeather(city, unit) {
  //calling openweather api
  const key = import.meta.env.VITE_WEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${key}`;
  const res = await fetch(url);

  //error handling
  if (!res.ok) {
    if (res.status === 404)
      throw new Error("City not found. Check spelling and try agani.");
    throw new Error("Something went wrong. Please try again.");
  }

  //convert response to json
  const d = await res.json();
  // console.log("API Response:", d);

  //convert weather metadata
  const { icon, cls } = getConditionMeta(d.weather[0].id);

  return {
    city: d.name,
    country: d.sys.country,
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    high: Math.round(d.main.temp_max),
    low: Math.round(d.main.temp_min),
    conditon: d.weather[0].description
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    icon,
    humidity: `${d.main.humidity}%`,
    wind: `${Math.round(unit === "metric" ? d.wind.speed * 3.6 : d.wind.speed)} ${unit === "metric" ? "km/h" : "mph"}`,
    visibility: `${(d.visibility / 1000).toFixed(1)} km`,
    pressure: `${d.main.pressure} hPa`,
    sunrise: formatTime(d.sys.sunrise, d.timezone),
    sunset: formatTime(d.sys.sunset, d.timezone),
    updated: `Updated at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
    condClass: cls,
    tempBar: tempToPercent(Math.round(d.main.temp), unit),
  };
}

// fetchWeather("Delhi", "metric")
//   .then(data => console.log(data))
//   .catch(err => console.error(err));

export default function App() {
  //state declarations
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [status, setStatus] = useState("idle");
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  //update body class according to weather
  useEffect(() => {
    document.body.className = weather?.condClass ?? "";
  }, [weather]);

  //search handler
  async function handleSearch() {
    const trimmed = city.trim();
    if (!trimmed) return;

    setStatus("loading");
    setWeather(null);

    try {
      const data = await fetchWeather(trimmed, unit);
      setWeather(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  //re-fetch when unit changes
  async function handleUnitToggle(newUnit) {
    if (newUnit === unit) return;
    setUnit(newUnit);
    if (weather) {
      setStatus("loading");
      try {
        const data = await fetchWeather(weather.city, newUnit);
        setWeather(data);
        setStatus("success");
      } catch (err) {
        setErrorMsg(err.message);
        setStatus("error");
      }
    }
  }

  //enter key handler
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <>
      {/* <!-- ═══ SEARCH BAR ═══ --> */}
      <header className="top-bar">
        <div className="brand">
          <span className="brand-dot"></span>
          <span className="brand-name">ATMOS</span>
        </div>
        <div className="search-wrap">
          <input
            type="text"
            id="cityInput"
            className="city-input"
            placeholder="Enter city…"
            autoComplete="off"
            maxLength={60}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch} className="search-btn" id="searchBtn" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="6.5"
                cy="6.5"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M10 10L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="unit-toggle">
          <button
            className="unit-btn active"
            id="btnC"
            data-unit="metric"
            onClick={() => handleUnitToggle("metric")}
          >
            °C
          </button>
          <span className="unit-sep">/</span>
          <button
            className="unit-btn"
            id="btnF"
            data-unit="imperial"
            onClick={() => handleUnitToggle("imperial")}
          >
            °F
          </button>
        </div>
      </header>

      {/* <!-- ═══ MAIN ═══ --> */}
      <main className="app-main" id="appMain">
        {/* <!-- IDLE / LANDING STATE --> */}
        {status === "idle" && (
          <section className="idle-state" id="idleState">
            <p className="idle-eyebrow">point of origin</p>
            <h1 className="idle-headline">
              Where are
              <br />
              <em>you?</em>
            </h1>
            <p className="idle-sub">Type a city above to get the forecast.</p>
          </section>
        )}

        {/* <!-- LOADING STATE --> */}
        {status === "loading" && (
          <section className="loading-state" id="loadingState">
            <div className="loading-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="loading-text">Fetching atmosphere…</p>
          </section>
        )}

        {/* <!-- ERROR STATE --> */}
        {status === "error" && (
          <section className="error-state" id="errorState">
            <p className="error-code">404</p>
            <p className="error-msg" id="errorMsg">
              City not found. Check spelling and try again.
            </p>
          </section>
        )}

        {/* <!-- WEATHER DISPLAY --> */}
        {status === "success" && weather && (
          <section className="weather-display" id="weatherDisplay">
            {/* <!-- LEFT COLUMN --> */}
            <div className="col-left">
              <div className="location-block">
                <p className="location-eyebrow" id="wCountry">
                  {weather.country}
                </p>
                <h2 className="location-city" id="wCity">
                  {weather.city}
                </h2>
                <p className="location-date" id="wDate">
                  {formatdate()}
                </p>
              </div>

              {/* <!-- GIANT TEMP — the signature hero element --> */}
              <div className="temp-hero">
                <span className="temp-value" id="wTemp">
                  {weather.temp}
                </span>
                <span className="temp-unit" id="wUnit">
                  {unit === "metric" ? "°C" : "°F"}
                </span>
              </div>

              <div className="condition-row">
                <span className="condition-icon" id="wIcon">
                  {weather.icon}
                </span>
                <span className="condition-label" id="wCondition">
                  {weather.conditon}
                </span>
              </div>

              <p className="feels-like">
                Feels like {weather.feelsLike}{unit === "metric" ? "°C" : "°F"}
              </p>
            </div>

            {/* <!-- DIVIDER --> */}
            <div className="col-divider"></div>

            {/* <!-- RIGHT COLUMN — detail grid --> */}
            <div className="col-right">
              <p className="detail-section-label">// conditions</p>

              <div className="detail-grid">
                {[
                  {label: "Humidity", value: weather.humidity},
                  {label: "Wind", value: weather.wind},
                  {label: "Visibility", value: weather.visibility},
                  {label: "Pressure", value: weather.pressure},
                  {label: "Sunrise", value: weather.sunrise},
                  {label: "Sunset", value: weather.sunset},
                  {label: "High", value: `${weather.high}${unit === "metric" ? "°C" : "°F"}`},
                  {label: "Low", value: `${weather.low}${unit === "metric" ? "°C" : "°F"}`},
                ].map(({label, value}) => (
                  <div className="detail-cell" key={label}>
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>

              {/* <!-- WEATHER CONDITION BAR --> */}
              <div className="condition-bar" id="conditionBar">
                <div 
                  className="condition-fill" id="conditionFill"
                  style={{width: `${weather.tempBar}%`}}
                >
                </div>
              </div>
              <div className="condition-bar-labels">
                <span>Cold</span>
                <span>Mild</span>
                <span>Warm</span>
                <span>Hot</span>
              </div>

              <p className="data-source">
                Data via OpenWeatherMap · <span id="wUpdated">—</span>
              </p>
            </div>
          </section>
        )}
      </main>

      {/* <!-- ═══ FOOTER RULE ═══ --> */}
      <footer className="site-footer">
        <div className="footer-rule"></div>
        <div className="footer-inner">
          <span className="footer-copy">ATMOS © 2026</span>
          <span className="footer-note">Built with React + OWM API</span>
        </div>
      </footer>
    </>
  );
}
