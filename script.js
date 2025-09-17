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