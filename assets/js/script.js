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
        });

      displayWeather(myData);
    });
}
