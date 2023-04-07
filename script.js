const API_KEY = "74c606af1b6f26de866db286dabb1909";
const UNITS = "metric";

const iconMap = new Map([
  ["01d", "wi-day-sunny"],
  ["01n", "wi-night-clear"], //clear sky
  ["02d", "wi-day-cloudy"],
  ["02n", "wi-night-alt-cloudy"], //few clouds
  ["03d", "wi-cloud"],
  ["03n", "wi-cloud"], //scattered clouds
  ["04d", "wi-cloudy"],
  ["04n", "wi-cloudy"], //broken clouds
  ["09d", "wi-showers"],
  ["09n", "wi-showers"], //shower rain
  ["10d", "wi-rain"],
  ["10n", "wi-rain"], //rain
  ["11d", "wi-thunderstorm"],
  ["11n", "wi-thunderstorm"], //thunderstorm
  ["13d", "wi-snowflake-cold"],
  ["13n", "wi-snowflake-cold"], //snow
  ["50d", "wi-fog"],
  ["50n", "wi-fog"], //mist
]);

let city = "Hawaje";

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault(); //blokowanie domyślnej akcji

  city = event.target.city.value;
  console.log(city);

  Promise.all([fetchWeather(city), fetchForecast(city)])

    .then(transformData)
    .then(update)
    .catch(function (error) {
      console.log(error);
    });
});

function fetchWeather(city) {
  return fetchData("https://api.openweathermap.org/data/2.5/weather", city);
}
function fetchForecast(city) {
  return fetchData("https://api.openweathermap.org/data/2.5/forecast", city);
}

function fetchData(url, city) {
  return fetch(`${url}?q=${city}&appid=${API_KEY}&units=${UNITS}`).then(
    function (response) {
      if (response.status !== 200) {
        throw new Error(
          "Looks like there was a problem. Status Code: " + response.status
        );
      }

      return response.json();
    }
  );
}

const cityname = "Kraków";
function changeCityName(cityName, country = "PL") {
  const cityNameElement = document.querySelector("h1");
  cityNameElement.innerHTML = cityName + "<small>," + country + "</small>";
}

function changeCityName2({ city, country }) {
  const element = document.querySelector("h1");

  element.innerHTML = `${city}, <small>${country}</small>`;
}

function changeWeather({ icon, temp }) {
  const weatherElement = document.querySelector(".weather");
  weatherElement.innerHTML = `<div class="weather-icon">
    <i class="wi ${icon}"></i></div>
    <div class="weather-temp">${temp}&deg; C</div>`;
}

function changePressureHumidity({ humidity, pressure }) {
  const pressureHumidity = document.querySelector(".card.air");
  pressureHumidity.innerHTML = `<div><i class="wi wi-humidity"></i>${humidity}%</div>
    <div><i class="wi wi-barometer"></i>${pressure} hPa</div>`;
}

function changeWind({ wind: { deg, speed } }) {
  const pressureHumidity = document.querySelector(".card.wind");
  pressureHumidity.innerHTML = `<div><i class="wi wi-direction-down-right"></i>${deg}&deg;</div>
  <div><i class="wi wi-strong-wind"></i> ${speed} m/s</div>`;
}

function changeForecast({ forecast }) {
  const element1 = document.querySelector(".forecast");
  let html = "";
  forecast.forEach(function (element) {
    html += `<li class="card card--centered">
    <div>${element.hour}</div>
    <i class="wi ${element.icon}"></i>
    <div>${element.temp}&deg; C</div>
  </li>`;
  });
  element1.innerHTML = html;
}
//potrzebna była wcześniej jak dawaliśmy na sztywno
// const forecast = [
//   {
//     hour: "03:00",
//     icon: "wi-day-sunny",
//     temp: 13,
//   },
//   {
//     hour: "06:00",
//     icon: "wi-day-sunny",
//     temp: 23,
//   },
//   {
//     hour: "09:00",
//     icon: "wi-day-sunny",
//     temp: 28,
//   },
//   {
//     hour: "12:00",
//     icon: "wi-day-sunny",
//     temp: 29,
//   },
// ];

function transformData([weatherData, forecastData]) {
  console.log(forecastData);
  return {
    city: weatherData.name,
    country: weatherData.sys.country,
    icon: iconMap.get(weatherData.weather[0].icon),
    temp: weatherData.main.temp,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    wind: weatherData.wind,
    forecast: forecastData.list.slice(0, 4).map(function (element) {
      const date = new Date(element.dt * 1000);
      return {
        hour: element.dt_txt.substr(11, 5), //substr działa podobnie jak slice, wycina kawałek strnga (od ktorego znaku, ile znaków)
        icon: iconMap.get(element.weather[0].icon),
        temp: element.main.temp,
      };
    }), //slice wycina od ktorego elementu i po przecinku ile elementów
  };
}
function update(data) {
  changeCityName2(data);
  changeWeather(data);
  changePressureHumidity(data);
  changeWind(data);
  changeForecast(data);
}
