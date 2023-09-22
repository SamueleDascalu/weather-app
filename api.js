import { config } from "./config.js";

const APIKEY = config.apiKey;

// Get coordinates (latitude and longitude | city name) for a specific city
export async function getCityInfo(city) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKEY}`;

  let response = await fetch(url);
  let info = response.json();
  return await info;
}

// Get data for the current day weather
export async function getWeatherData(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;
  
  let response = await fetch(url);
  let weather = await response.json();
  return await weather;
}

// Get data for the five days forecast
export async function getForecastData(lat, lon) {
  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`;

  let response = await fetch(url);
  let forecast = response.json();
  return await forecast;
}

// Get the city name using latitude and longitude
export async function getCityName(lat, lon) {
  let url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&&appid=${APIKEY}`;

  let response = await fetch(url);
  let cityName = response.json();
  return await cityName;
}