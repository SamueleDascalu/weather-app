import * as api from "./api.js";

const date = document.getElementById('date');
const form = document.getElementById('form');
const input = document.getElementById('inputData');
const alert = document.getElementById('alert');
const image = document.getElementById('image');
const cityHtml = document.getElementById('city');
const temperature = document.getElementById('temperature');
const minMax = document.getElementById('min-max-temp');
const weather = document.getElementById('weather');
const clouds = document.getElementById('clouds-percentage');

let days = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  6: 'SAT'
}

// Create a date object
let objDate = new Date();
let day = objDate.getDate();
let month = objDate.toLocaleString('default', {month: 'short'});

// Display the date in the DOM
date.textContent = `${month} ${day}`;

function returnDay(day) {
  return days[day];
}

function checkString(str) {
  //User input validation (only letters and spaces)
  return /^[A-Za-z\s]*$/.test(str);
}

async function renderWeather(data, city) {
  let weatherData = await data;
  let cityName = await city;

  cityHtml.textContent = `${cityName[0].name}`;
  image.src = `/images/${weatherData.weather[0].main.toLowerCase()}.png`;
  weather.textContent = `${weatherData.weather.main}`;
  temperature.textContent = `${weatherData.main.temp}°`;
  minMax.textContent = `max ${weatherData.main.temp_max}° - min ${weatherData.main.temp_min}°`;
  weather.textContent = weatherData.weather[0].main;
  clouds.textContent = `clouds ${weatherData.clouds.all}%`;
}

async function renderForecast(data) {
  let forecast = await data;

  let daysarray = forecast.list.filter((times) => times.dt_txt.split(' ')[1] === '00:00:00');

  let fiveDaysList = daysarray.map((element) => {
  let card = document.createElement('div');
  card.classList.add('card');

  let dayNumber = new Date(element.dt_txt).getDay();

    card.innerHTML = `
      <div class="day-container-five">
        <p class="day">${returnDay(dayNumber)}</p>
      </div>
      <div class="icon-container-five">
        <img class="images" src="/images/${element.weather[0].main.toLowerCase()}.png">
      </div>
      <div class="temperature-container-five">
        <p class="temperature-five">${element.main.temp.toFixed(1)}°</p>
      </div>
    `;

    return card;
    })

    const cardsContainer = document.getElementById('cards-container');

    if(cardsContainer !== ''){
    cardsContainer.innerHTML = '';
    }

    fiveDaysList.forEach(element => {
    cardsContainer.append(element);

    document.getElementById('five-days').classList.remove('hide');
  });
}

// Getting user geolocation if exists
if(navigator.geolocation) {
  //Getting the user location coordinates
  const successCallback = async (position) => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    
    //Getting weather info from api module
    let weather = api.getWeatherData(lat, lon);
    let forecast = api.getForecastData(lat, lon);
    let cityName = api.getCityName(lat, lon);

    renderWeather(weather, cityName);
    renderForecast(forecast);
  };

  const errorCallback = () => {
    document.getElementById('main').hidden = true;
    document.getElementById('five-days').classList.add('hide');
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

async function getCityInfo(data) {
  let info = await data;
  
  try{
    let lat = info[0].lat;
    let lon = info[0].lon;
    let cityName = info;

    let weather = api.getWeatherData(lat, lon);
    let forecast = api.getForecastData(lat, lon);

    renderWeather(weather, cityName);
    renderForecast(forecast);
  }catch{
    displayAlert();
  }
}

function displayAlert() {
  alert.style.removeProperty('display');

  input.addEventListener('keydown', () => {
    alert.style.display = 'none';
  })
}

function getUserInput(event){
  let userInput = input.value;

  if(checkString(userInput) === true){
    let city = api.getCityInfo(userInput);

    getCityInfo(city);
  } else {
    displayAlert();
  }

  form.reset();
  event.preventDefault();
}

form.addEventListener('submit', getUserInput);
