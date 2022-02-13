//global variables
var form = document.querySelector(".search form")
var input = document.querySelector(".search input")
var list = document.querySelector(".weather-results .cities ")
var apiKey = "87af09b480e9430c23e9eeb789a8fa4f";
var cityWeather = $('#city-weather')

//function to use the user searched city
form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;
  
    function clearPrevousCity() {
        cityWeather.empty();
    }
  
    //api url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;
  
    //gathers api data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { main, name, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
        }.svg`;
        
        //clears any prevous data on site for weather
        clearPrevousCity();

        //creates new elements displaying current weather
        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
          <h2 class="city-name" data-name="${name}">
            <span>${name}</span>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
          <figure>
            <img class="city-icon" src="${icon}" alt="${
          weather[0]["description"]
        }">
            <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
        `;
        li.innerHTML = markup;
        list.appendChild(li);
      });
      
    form.reset();
    input.focus();
  });

 