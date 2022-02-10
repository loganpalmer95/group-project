// -------------------API's--------------------------------------

var api_key = "6e8138877465eaa1373daf4702c486e7";

// --------------------HTML ELEMENTS-----------------------------
var $btn = document.querySelector(".btn");
var $form = document.querySelector(".form-input");
var $searchCardsContainer = document.querySelector("#search-cards-container");
var $currentWeatherContainer = document.querySelector(
  "#current-weather-container"
);
var $forecastCardContainer = document.querySelector("#forecast-card-container");
var $forecastCard1 = document.querySelector("#forecast-card1");
var $forecastCard2 = document.querySelector("#forecast-card2");
var $forecastCard3 = document.querySelector("#forecast-card3");
var $forecastCard4 = document.querySelector("#forecast-card4");
var $forecastCard5 = document.querySelector("#forecast-card5");

// --------------------------------------------------------------
var userSearch = [];
var lat;
var lon;

// on page reload, clear local storage
localStorage.clear();

// var so we can put it in the event listener parameter at the bottom

// --------------------------FUNCTIONS-----------------------------

// -----------------SAVING SEARCH HISTORY-------------

var formSubmitHandler = function (event) {
  event.preventDefault();
  search = $form.value;
  // getWeather($form.value);
  userSearch.push(search);

  localStorage.setItem("Search History", userSearch);

  $form.value = "";
  getWeather(search);

  return userSearch;
};

// ---------------GET WEATHER DATA---------------------------------
function getWeather(city) {
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  fetch(currentWeatherUrl)
    .then((data) => data.json())
    .then(function (weather) {
      if (weather.cod === "404") {
        alert("No city with that name");
        return;
      }

      createSearchCard(weather.name);
      createCurrentWeather(weather);

      var lat = weather.coord.lat;
      var lon = weather.coord.lon;

      var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
      fetch(onecallUrl)
        .then((data) => data.json())
        .then(function (oneCallData) {});
    });
}

// ----------------CREATE SEARCH HISTORY CARD-----------------
function createSearchCard(cityName) {
  // if unique create card
 
  $("<button>")
    .addClass("cards")
    .text(cityName)
    .appendTo($searchCardsContainer);
  // var $searchCards = document.querySelector(".cards");
  // console.log($searchCards)
}

// ------------------CREATE CURRENT WEATHER CONTAINER-----------
function createCurrentWeather(weather) {
  // clear container
  // clearCurrentWeather();
  $currentWeatherContainer.innerHTML = "";

  // Weather Data
  var weatherData = weather;
  // City Name
  var cityName = weather.name;
  $("<div>")
    .addClass("current-weather")
    .text("Current Weather for " + cityName)
    .appendTo($currentWeatherContainer);
  var $currentWeather = document.querySelector(".current-weather");

  // Icon representing Weather Conditions
  var icon = weather.weather[0].icon;
  var iconSource = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  var $img = document.createElement("img");
  $img.setAttribute("src", iconSource);

  //   Temperature
  //convert Kelvin to farenheit
  var tempKelvin = weather.main.temp;
  var tempF = Math.floor(1.8 * (tempKelvin - 273) + 32) + " ° ";

  //   // Humidity
  var humidity = " Humidity: " + weather.main.humidity;

  //   // Wind speed
  var windspeed = " Windspeed: " + Math.floor(weather.wind.speed) + " MPH ";

  // var uvIndex;
  // oneCallData.current.uvi
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;

  var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
  fetch(onecallUrl)
    .then((data) => data.json())
    .then(function (oneCallData) {
      var uvBackground;

      if (oneCallData.current.uvi <= 2) {
        uvBackground = ".favorable";
      } else if (oneCallData.current.uvi >= 3 && oneCallData.current.uvi <= 5) {
        uvBackground = ".moderate";
      } else {
        uvBackground = ".severe";
      }
      var $uvIndex = " UV Index: " + oneCallData.current.uvi;

      // NEED TO HAVE uvINDEX BE ITS OWN ELEMENT
      // $uvIndex.classList.add(uvBackground);

      $currentWeather.append($img, tempF, humidity, windspeed, $uvIndex);
      createForecast(weatherData);
    });
}

// -----------CREATE 5 DAY FORECAST -----------
// -----------TAKE FROM 5DAY API CALL----------
function createForecast(cityName) {
  // clears containers
  $forecastCard1.innerHTML = "";
  $forecastCard2.innerHTML = "";
  $forecastCard3.innerHTML = "";
  $forecastCard4.innerHTML = "";
  $forecastCard5.innerHTML = "";

  var city = cityName.name;
  var lon = cityName.coord.lon;
  var lat = cityName.coord.lat;
  var onecallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`;
  fetch(onecallUrl)
    .then((data) => data.json())
    .then(function (onecallUrlData) {
      // get 5 day forecast showing


      // Date Variables
      var tempArr = [];
      var displayDateArr = [];
      var humidityArr = [];
      var iconArr = [];
      var iconSourceArr = [];

      for (let i = 0; i <= 4; i++) {
        // Get Date Data
        var dateFormat = parseInt(onecallUrlData.daily[i].dt) * 1000;
        var dateObject = new Date(dateFormat);
        var humanDateFormat = dateObject.toLocaleDateString(
          "en-US",
          { weekday: "long" } + { day: "numeric" }
        );

        displayDateArr.push(humanDateFormat);

        // Get Temp Data
        // Convert Kelvin to Farenheit
        tempArr.push(
          "TEMPERATURE: " +
            Math.floor(1.8 * (onecallUrlData.daily[i].temp.day - 273) + 32) +
            "°"
        );

        // Humidity Data
        humidityArr.push("    HUMIDITY: " + onecallUrlData.daily[i].humidity);

        // Icon Data
        iconArr.push(onecallUrlData.daily[i].weather[0].icon);
        iconSourceArr.push(
          `https://openweathermap.org/img/wn/${iconArr[i]}@2x.png`
        );
      }

      //weather elements images

      var $img1 = document.createElement("img");
      $img1.setAttribute("src", iconSourceArr[0]);

      var $img2 = document.createElement("img");
      $img2.setAttribute("src", iconSourceArr[1]);

      var $img3 = document.createElement("img");
      $img3.setAttribute("src", iconSourceArr[2]);

      var $img4 = document.createElement("img");
      $img4.setAttribute("src", iconSourceArr[3]);

      var $img5 = document.createElement("img");
      $img5.setAttribute("src", iconSourceArr[4]);

      // Append 5 Day Data to HTML elements

      $forecastCard1.append(
        displayDateArr[0],
        $img1,
        tempArr[0],
        humidityArr[0]
      );

      $forecastCard2.append(
        displayDateArr[1],
        $img2,
        tempArr[1],
        humidityArr[1]
      );

      $forecastCard3.append(
        displayDateArr[2],
        $img3,
        tempArr[2],
        humidityArr[2]
      );

      $forecastCard4.append(
        displayDateArr[3],
        $img4,
        tempArr[3],
        humidityArr[3]
      );

      $forecastCard5.append(
        displayDateArr[4],
        $img5,
        tempArr[4],
        humidityArr[4]
      );

      $forecastCard1.classList.add("color");
      $forecastCard2.classList.add("color");
      $forecastCard3.classList.add("color");
      $forecastCard4.classList.add("color");
      $forecastCard5.classList.add("color");
    });
}

$btn.addEventListener("click", formSubmitHandler);

$searchCardsContainer.addEventListener("click", function (e) {
  if (!e.target.matches("button")) {
    return;
  }
  
  // checks for duplicates in search history
  hasDuplicates(localHistory);
  localHistory.push(localStorage.getItem("Search History"));
  var search = e.target.innerHTML;
  getWeather(search);
});
var localHistory = [];

function hasDuplicates (array) {
  return (new Set(array)).size !== array.length
}

