const API_KEY = "a17cb683298a78d87d6a4374ed4218ce"; //OpenWeatherMap API key
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const cityInput     = document.getElementById("cityInput");
const searchBtn     = document.getElementById("searchBtn");
const locBtn        = document.getElementById("locBtn");
const unitToggleBtn = document.getElementById("unitToggleBtn");
const recentBtn     = document.getElementById("recentBtn");
const recentList    = document.getElementById("recentList");
const messageBox    = document.getElementById("message");
const cityNameEl    = document.getElementById("cityName");
const weatherIconEl = document.getElementById("weatherIcon");
const currentTempEl = document.getElementById("currentTemp");
const humidityEl    = document.getElementById("humidity");
const windEl        = document.getElementById("wind");
const feelsLikeEl   = document.getElementById("feelsLike");
const tempAlertEl   = document.getElementById("tempAlert");
const forecastGrid  = document.getElementById("forecastGrid");

function showMessage(type, text) {
  messageBox.className = "";
  messageBox.classList.add(type);
  messageBox.textContent = text;
  messageBox.classList.remove("hidden");
  setTimeout(() => messageBox.classList.add("hidden"), 4000);
}

let isFahrenheit = false;
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
let lastFetched = null;

const kelvinToC = k => k - 273.15;
function formatTemp(k, today = false) {
  const c = kelvinToC(k);
  if (today && isFahrenheit) return `${(c*9/5+32).toFixed(1)} °F`;
  return `${c.toFixed(1)} °C`;
}