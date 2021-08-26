let apiKey = "01269a22236d927374d59fe33d4e1c3c"
let archive = JSON.parse(window.localStorage.getItem('archive')) || [];
let apiRoot = 'https://api.openweathermap.org'
let currentDate = moment().format('L');
let searchHistory = document.querySelector('#search-history')
let cityInput = document.querySelector('#city-input').value

let searchBtn = document.querySelector('#search-btn');

function listPastSearch(citiesHistory) {
  let li = document.createElement('li')
  li.classList = 'list-group-item list-group-item-action'
  li.textContent = cityInput
  searchHistory.appendChild(li)
}

searchHistory.addEventListener('click', function(event) {
  searchWeather(document.querySelector(this).text());
})
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

  card.classList = 'card card-index';
  cardBody.classList = 'card-body';
  temp.classList = 'card-text'
  humidity.classList = 'card-text'
  wind.classList = 'card-text'
  title.textContent = 'City: ' + data.name + '(' + currentDate + ')';
  temp.textContent = 'Temperature: ' + data.main.temp +'ºF';
  humidity.textContent = 'Humidity: ' + data.main.humidity + '%';
  wind.textContent = 'Wind Speed: ' + data.wind.speed + ' MPH';

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
      let formatDate = moment(forecastData.list[i].dt_txt).format('L')

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

function displayUvIndex(uvData) {
  let forecastBody = document.querySelector('.card-index')
  let uviBtn = document.createElement('button');
  let uvIndex = document.createElement('h6');

  uviBtn.classList = 'btn';
  uvIndex.classList = 'card-text';

  uvIndex.textContent = 'UV Index: ';
  uviBtn.textContent = uvData.current.uvi;

  if (uvData.current.uvi < 4) {
    uviBtn.classList = 'btn-success'
  } else if (uvData.current.uvi < 7) {
    uviBtn.classList = 'btn-warning'
  } else {
    uviBtn.classList = 'btn-danger'
  }

  uvIndex.appendChild(uviBtn);
  forecastBody.appendChild(uvIndex)
}

function fetchForecast(data) {
 let apiUrl = `${apiRoot}/data/2.5/forecast?q=` + data.name + `&appid=` + apiKey + `&units=imperial`
 fetch(apiUrl)
 .then(function(res) {
   return res.json()
 })
 .then(function (forecastData) {
   displayForecast(forecastData)
   if(archive.indexOf(cityInput) === -1) {
     archive.push(cityInput);
     window.localStorage.setItem('archive', JSON.stringify(archive))
     listPastSearch(cityInput)
   }
   console.log(forecastData)
 })
}

function fetchUvIndex(data) {
  let apiUrl = `${apiRoot}/data/2.5/onecall?lat=` + data.coord.lat +'&lon='+ data.coord.lon + `&appid=` + apiKey + `&units=imperial`;
  fetch(apiUrl)
  .then(function(res) {
    return res.json()
  })
  .then(function(uvData) {
    displayUvIndex(uvData)
  })
}

function searchWeather(cityInput) {
  let apiUrl = `${apiRoot}/data/2.5/weather?q=` + cityInput + `&APPID=` + apiKey + `&units=imperial`

  fetch(apiUrl)
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    displayCurrentWeather(data, data.name, data.main.temp, data.main.humidity, data.wind.speed)
    fetchForecast(data)
    fetchUvIndex(data)
    // console.log(data)
  }).catch(function(err) {
    console.log(err)
  })
}

if(archive.length < 0) {
  searchWeather(archive[archive.length - 1]);
}

for(var i = 0; i<archive.length; i++) {
  listPastSearch(archive[i]);
}