import { config } from "./config.js";

const APIKEY = config.apiKey;

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

function displayAlert() {
  alert.style.removeProperty('display');

  input.addEventListener('keydown', () => {
    alert.style.display = 'none';
  })
}

//Getting weather info
function setWeather(lat, lon) {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;

  // Getting weather info
  fetch(URL)
    .then(response => response.json())
    .then(json => {
      return json;
    }).then((json) => {
      const URLCITY = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${APIKEY}`;

      //Getting the city name
      fetch(URLCITY)
        .then(response => response.json())
        .then(json => {
          return json;
        }).then((json) => {
          //Displaying the city name in the DOM
          cityHtml.textContent = `${json[0].name}, ${json[0].country.toLowerCase()}`;
        })
      
      //Displaying the data in the DOM
      image.src = `/images/${json.weather[0].main.toLowerCase()}.png`;
      temperature.textContent = `${json.main.temp}°`;
      minMax.textContent = `max ${json.main.temp_max}° - min ${json.main.temp_min}°`;
      weather.textContent = json.weather[0].main;
      clouds.textContent = `clouds ${json.clouds.all}%`;
    });

    document.getElementById('main').hidden = false;
}

//Getting the coordinates from the user input city name
function getCoordinates(event){
  //Get the city name from the user input
  let city = input.value;

  if(checkString(city) === true){
    const URLCOORDS = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKEY}`;

    fetch(URLCOORDS)
      .then(response => response.json())
      .then(json => {
        return json[0]
      }).then((coords) => {
        let lat = coords.lat;
        let lon = coords.lon;

        setWeather(lat, lon);
        setForecast(lat, lon);
      }).catch(() => {
        displayAlert();
      });
  } else {
    displayAlert();
  }

  form.reset();
  event.preventDefault();
}

//Getting the 5 days forecast
function setForecast(lat, lon) {
  const URLFORECAST = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;

  fetch(URLFORECAST)
    .then(response => response.json())
    .then(json => {
      let daysarray = json.list.filter((times) => times.dt_txt.split(' ')[1] === '00:00:00');

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
      });
    })

  document.getElementById('five-days').classList.remove('hide');
}

form.addEventListener('submit', getCoordinates);

//Getting the user location coordinates
const successCallback = (position) => {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  // Displaying forecast info
  setWeather(lat, lon);
  setForecast(lat, lon);
};

const errorCallback = () => {
  document.getElementById('main').hidden = true;
  document.getElementById('five-days').classList.add('hide');
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);