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

function updateBackground(condition) {
  const body = document.body;
  body.className = "min-h-screen text-slate-800 font-sans";
  // Decide background based on condition
  const c = condition.toLowerCase();
  if (c.includes("clear")) body.classList.add("bg-sunny");
  else if (c.includes("cloud")) body.classList.add("bg-cloudy");
  else if (c.includes("rain")) body.classList.add("bg-rainy");
  else if (c.includes("thunder")) body.classList.add("bg-stormy");
  else if (c.includes("snow")) body.classList.add("bg-snowy");
}

function handleAlerts(tempC) {
  tempAlertEl.className = "hidden";
  if (tempC > 40) { tempAlertEl.textContent="⚠️ Extreme heat!"; tempAlertEl.classList.add("hot"); tempAlertEl.classList.remove("hidden"); }
  else if (tempC < 0) { tempAlertEl.textContent="❄️ Freezing conditions!"; tempAlertEl.classList.add("cold"); tempAlertEl.classList.remove("hidden"); }
}

/*Recents*/
function saveRecent(city) {
  if (!city) return;
  recentCities = recentCities.filter(c => c.toLowerCase()!==city.toLowerCase());
  recentCities.unshift(city);
  if (recentCities.length>10) recentCities.pop();
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecents();
}
function renderRecents() {
  recentList.innerHTML="";
  if (!recentCities.length) { recentList.classList.add("hidden"); return; }
  recentCities.forEach((city,i)=>{
    const li=document.createElement("li");
    li.className="flex justify-between items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer";
    const span=document.createElement("span");
    span.textContent=city;
    span.className="font-medium text-slate-700";
    span.addEventListener("click",()=>{fetchWeather(city);recentList.classList.add("hidden");});
    const remove=document.createElement("button");
    remove.textContent="✕"; remove.className="text-slate-400 hover:text-red-500 text-sm";
    remove.addEventListener("click",(e)=>{e.stopPropagation();recentCities.splice(i,1);localStorage.setItem("recentCities",JSON.stringify(recentCities));renderRecents();});
    li.append(span,remove); recentList.appendChild(li);
  });
  recentList.classList.remove("hidden");
}

/*API*/
async function fetchWeather(city) {
  if (!city) return showMessage("error","Enter a city");
  try {
    const res=await fetch(`${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
    if(!res.ok) throw new Error("City not found");
    const data=await res.json();
    lastFetched=data;
    updateCurrent(data);
    saveRecent(data.name);
    fetchForecast(data.coord.lat,data.coord.lon);
  } catch(e){ showMessage("error",e.message);}
}
async function fetchWeatherByCoords(lat,lon){
  try{
    const res=await fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if(!res.ok) throw new Error("Location fetch failed");
    const data=await res.json();
    lastFetched=data;
    updateCurrent(data);
    saveRecent(data.name);
    fetchForecast(lat,lon);
  }catch(e){showMessage("error",e.message);}
}
async function fetchForecast(lat,lon){
  try{
    const res=await fetch(`${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if(!res.ok) throw new Error("Forecast unavailable");
    const data=await res.json();
    const map={};
    data.list.forEach(item=>{
      const key=new Date(item.dt*1000).toLocaleDateString();
      if(!map[key]) map[key]=item;
    });
    updateForecast(Object.values(map).slice(0,5));
  }catch(e){showMessage("error",e.message);}
}

function updateCurrent(data){
  cityNameEl.textContent=data.name;
  const tempK=data.main.temp, feelsK=data.main.feels_like, tempC=kelvinToC(tempK);
  currentTempEl.textContent=formatTemp(tempK,true);
  feelsLikeEl.textContent=formatTemp(feelsK,true);
  humidityEl.textContent=`${data.main.humidity}%`;
  windEl.textContent=`${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Set weather icon using OpenWeatherMap's icon code
  weatherIconEl.innerHTML = `<img src="${iconUrl}" alt="${data.weather[0].description}" class="w-16 h-16">`;

  updateBackground(data.weather[0].main);
  handleAlerts(tempC);
}
function updateForecast(days){
  forecastGrid.innerHTML="";
  days.forEach(item=>{
    const d=new Date(item.dt*1000);
    const label=d.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
    const card=document.createElement("div");
    card.className="forecast-card";
    card.innerHTML=`
      <h4 class="font-semibold text-sky-700">${label}</h4>
      <div class="my-2">
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
            alt="${item.weather[0].description}"
            class="mx-auto w-12 h-12">
      </div>

      <p class="font-bold">${formatTemp(item.main.temp,false)}</p>
      <p class="text-slate-500 text-sm">💨 ${item.wind.speed} m/s</p>
      <p class="text-slate-500 text-sm">💧 ${item.main.humidity}%</p>`;
    forecastGrid.appendChild(card);
  });
}
