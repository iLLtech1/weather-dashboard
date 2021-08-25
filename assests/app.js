let apiKey = "01269a22236d927374d59fe33d4e1c3c"
let searchHistroy = JSON.parse(window.localStorage.getItem('search-history')) || [];
let apiRoot = 'https://api.openweathermap.org'
// let currentDate = moment().format('L');

let searchBtn = document.querySelector('#search-btn');

searchBtn.addEventListener('click', function(event) {
  event.preventDefault();
  let cityInput = document.querySelector('#city-input').value
  cityInput.value = '';
  searchWeather(cityInput);
})

function displayCurrentWeather(data) {
  let weatherToday = document.querySelector('#weather-today')
  weatherToday.innerHTML = '';
  let card = document.createElement('div');
  let cardBody = document.createElement('div');
  let title = document.createElement('h2');
  let temp = document.createElement('h6');
  let humidity = document.createElement('h6');
  let wind = document.createElement('h6');
  let img = document.createElement('img');

  img.setAttribute('src', 'https://openweathermap.org/img/w/'+data.weather[0].icon + '.png')

  card.classList = 'card';
  cardBody.classList = 'card-body';
  temp.classList = 'card-text'
  humidity.classList = 'card-text'
  wind.classList = 'card-text'
  title.textContent = data.name;
  temp.textContent = data.main.temp;
  humidity.textContent = data.main.humidity;
  wind.textContent = data.wind.speed;

  title.appendChild(img)
  card.appendChild(title);
  card.appendChild(temp);
  card.appendChild(humidity);
  card.appendChild(wind);
  weatherToday.appendChild(card)
}

function displayForecast(forecastData) {
  let forecast = document.querySelector('#forecast')
  console.log(forecastData.list)
  for (i=0; i < forecastData.list.length; i++) {
    if(forecastData.list[i].dt_txt.indexOf('15:00:00') !== -1) {
      let col = document.createElement('div');
      let card = document.createElement('div');
      let body = document.createElement('div');
      let img = document.createElement('img');
      let forecastTemp = document.createElement('p');
      let forecastHumid = document.createElement('p');
      let forecastDates = document.createElement('p')
      let formatDate = moment(forecastData.list[i].dt_txt.format('L'))

      col.classList = 'col-md-2';
      card.classList = 'card bg-primary text-white';
      body.classList = 'card-body p-2';
      img.setAttribute('src', 'https://openweathermap.org/img/w/' + forecastData.list[i].weather[0].icon + '.png')
      forecastTemp.classList = 'card-text'
      forecastHumid.classList = 'card-text';
      forecastDates.classList = 'card-text';

      forecastTemp.textContent = 'Temp: '+ forecastData.list[i].main.temp_max + 'ºF';
      forecastHumid.textContent = 'Humidity: ' + forecastData.list[i].main.humidity + '%';
      forecastDates.textContent = formatDate;

      body.appendChild(img)
      body.appendChild(forecastDates)
      body.appendChild(forecastTemp);
      body.appendChild(forecastHumid);
      card.appendChild(body);
      col.appendChild(card);
      forecast.appendChild(col)
    }
  }
}

function fetchForecast(data) {
 let apiUrl = `${apiRoot}/data/2.5/forecast?q=` + data.name + `&appid=` + apiKey + `&units=imperial`
 fetch(apiUrl)
 .then(function(res) {
   return res.json()
 })
 .then(function (forecastData) {
   displayForecast(forecastData)
   console.log(forecastData)
 })
}

function searchWeather(cityInput) {
  let { lat } = cityInput;
  let { lon } = cityInput;
  let apiUrl = `${apiRoot}/data/2.5/weather?q=` + cityInput + `&APPID=` + apiKey + `&units=imperial`

  fetch(apiUrl)
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    displayCurrentWeather(data, data.name, data.main.temp, data.main.humidity, data.wind.speed)
    fetchForecast(data)
    // console.log(data)
  }).catch(function(err) {
    console.log(err)
  })
}