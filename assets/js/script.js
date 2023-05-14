const WEATHER_API_BASE_URL = "https://api.openweathermap.org";
const WEATHER_API_KEY = "f23ee9deb4e1a7450f3157c44ed020e1";
const MAX_DAILY_FORECAST = 5;

let recentLocations = [];

function getLocation() {
  const userLocation = locationInput.value.trim();

  if (!userLocation) {
    setLocationError("Please enter a location");
    return;
  }

  lookupLocation(userLocation);
}

function clearError() {
  const errorDisplay = document.getElementById("error");
  errorDisplay.textContent = "";
}

function setLocationError(text) {
  const errorDisplay = document.getElementById("error");
  errorDisplay.textContent = text;

  setTimeout(clearError, 3000);
}

function lookupLocation(search) {
  const apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const { name, country, lat, lon } = data[0];

      const myData = { name, country, lat, lon };

      console.log(myData);

      const weatherApiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${myData.lat}&lon=${myData.lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
      console.log(weatherApiUrl);

      fetch(weatherApiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          displayCurrentWeather(data);

          displayWeatherForecast(data);
        })

      displayWeather(myData);
    })
}

function displayCurrentWeather(weatherData) {
  const { temp, wind_speed, humidity, uvi } = weatherData.current;

  document.getElementById("temp_value").textContent = `${temp}°`;
  document.getElementById("wind_value").textContent = `${wind_speed}MPH`;
  document.getElementById("humid_value").textContent = `${humidity}%`;
  document.getElementById("uvi_value").textContent = `${uvi}`;
}

function displayWeatherForecast(weatherData) {
  const dailyData = weatherData.daily;
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.style.display = 'block';
  const forecastList = document.getElementById('forecast-days');

  forecastList.innerHTML = '';

  for (let i = 0; i < MAX_DAILY_FORECAST; i++) {
    const dailyForecast = dailyData[i];
    const day = new Date(dailyForecast.dt * 1000).toLocaleDateString('en-GB', { weekday: 'long' });
    const temp = `${dailyForecast.temp.day}°`;
    const humidity = `${dailyForecast.humidity}%`;
    const wind = `${dailyForecast.wind_speed}MPH`;

    const newForecast = document.createElement('div');
    newForecast.classList.add('forecast-day');
    newForecast.innerHTML = `<div class="weather-info">
    <div class="date">
    <span>${day}</span>
    </div>
    <div class="temperature">
    <span>${temp}</span>
    </div>
    <div class="wind">
    <span>${wind}</span>
    </div>
    <div class="humidity">
    <span>${humidity}</span>
    </div>
    </div>`;
    forecastList.appendChild(newForecast);
  }
}

const getWeather = (lat, lon) => {

  var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`;
  console.log(apiUrl);
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {

    console.log(data);

    displayCurrentWeather(data);

    displayWeatherForecast(data);

  })

}

const displayWeather = (weatherData) => {
   document.getElementById('location-name').textContent = `${weatherData.name}, ${weatherData.country}`;

   getWeather(weatherData.lat, weatherData.lon);

}

const locationInput = document.getElementById('location');
const searchButton = document.getElementById('search');

searchButton.addEventListener('click', getLocation);