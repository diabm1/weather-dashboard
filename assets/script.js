const form = document.querySelector("#search-form");
var cityArr = JSON.parse(localStorage.getItem("cityArr")) || [];
cityArr.forEach(function (city) {
  var cityButton = document.createElement("li");
  cityButton.textContent = city;
  cityButton.classList.add("list-group-item");
  document.querySelector(".list-group").append(cityButton);

  cityButton.addEventListener("click", function (e) {
    e.preventDefault();
    getWeatherByCity(city);
  });

  var history = document.getElementById("history");
  history.append(cityButton);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#search-input");
  const inputVal = input.value;
  // console.log(inputVal);

  getWeatherByCity(inputVal);

  if (cityArr.indexOf(inputVal) === -1) {
    cityArr.unshift(inputVal);
    console.log(cityArr);
    localStorage.setItem("cityArr", JSON.stringify(cityArr));
  }

  // var buttonEle = document.createElement("button");
  // buttonEle.innerHTML = inputVal;

  // buttonEle.addEventListener("click", function () {
  //   getWeatherByCity(inputVal);
  // });

  // var history = document.getElementById("history");
  // history.append(buttonEle);
});

function getWeatherByCity(cityName) {
  document.getElementById("forecast").innerHTML = "";
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=040b02cde2ef8c9374d136e39c5109f3&units=imperial`;

  //http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=040b02cde2ef8c9374d136e39c5109f3&units=imperial

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector(".title-container").innerHTML = "";
      document.querySelector(".weather-info").innerHTML = "";
      var cityName = data.name;
      console.log(cityName);
      var cityNameEl = document.createElement("h2");
      cityNameEl.setAttribute("class", "city-title");
      cityNameEl.textContent = cityName;
      var dateEl = document.createElement("p");
      var date = new Date(data.dt * 1000);
      var dateFormatted = `(${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()})`;
      dateEl.textContent = dateFormatted;
      var temp = data.main.temp;
      var tempEl = document.createElement("p");
      tempEl.setAttribute("id", "temp");
      tempEl.textContent = `Temp: ${temp} ℉`;
      var wind = data.wind.speed;
      var windEl = document.createElement("p");
      windEl.setAttribute("id", "wind");
      windEl.textContent = `Wind: ${wind} MPH`;
      var humidity = data.main.humidity;
      var humidityEl = document.createElement("p");
      humidityEl.setAttribute("id", "humidity");
      humidityEl.textContent = `Humidity: ${humidity} %`;
      // var description = data.weather[0].description;
      var icon = data.weather[0].icon;
      var iconEl = document.createElement("img");
      iconEl.setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
      document.querySelector("#today").classList.add("card", "p-2");
      // cityNameEl.appendChild(dateEl)
      document
        .querySelector(".title-container")
        .append(cityNameEl, dateEl, iconEl);
      document
        .querySelector(".weather-info")
        .append(tempEl, windEl, humidityEl);
      // document.getElementById(
      //   "icon"
      // ).src = `http://openweathermap.org/img/w/${icon}.png`;
      // document.getElementById("date").appendChild(dateFormatted, iconEl)
      // document.getElementById("city-title").innerHTML = cityName;
      // document.getElementById("temp").innerHTML = `Temp: ${temp} ℉`;
      // document.getElementById("wind").innerHTML = `Wind: ${wind} MPH`;
      // document.getElementById("humidity").innerHTML = `Humidity: ${humidity} %`;
      // document.getElementById("uv-index").innerHTML = `UV Inndex: ${}`;

      var lat = data.coord.lat;
      var lon = data.coord.lon;

      var uviUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=040b02cde2ef8c9374d136e39c5109f3`;

      //https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=040b02cde2ef8c9374d136e39c5109f3

      fetch(uviUrl)
        .then((response) => response.json())
        .then((dataUvi) => {
          console.log(dataUvi);

          // var uviIndex = dataUvi.current.uvi;
          // console.log(uviIndex)
          // document.getElementById(
          //   "uv-index"
          // ).innerHTML = `UV Index: ${uviIndex}`;

          var uviIndex = dataUvi.current.uvi;
          var uviSpan = document.createElement("p");
          uviSpan.textContent = "UV Index: ";
          var uviEl = document.createElement("button");
          uviEl.setAttribute("id", "uvi");
          uviEl.classList.add("btn");
          uviEl.textContent = uviIndex;
          uviSpan.append(uviEl);
          document.querySelector(".weather-info").append(uviSpan);

          if (uviIndex < 3) {
            uviEl.classList.add("btn-success");
          } else if (uviIndex < 7) {
            uviEl.classList.add("btn-warning");
          } else {
            uviEl.classList.add("btn-danger");
          }
        });
    });

  var forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=040b02cde2ef8c9374d136e39c5109f3&units=imperial`;

  fetch(forcastUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var list = data.list;
      var fiveDayList = [list[0], list[10], list[20], list[30], list[39]];
      for (var i = 0; i < fiveDayList.length; i++) {
        const weather = fiveDayList[i];
        console.log(weather);
        var date = new Date(weather.dt * 1000);
        var dateFormatted = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        var temp = weather.main.temp;
        var wind = weather.wind.speed;
        var humidity = weather.main.humidity;
        // var description = data.weather[0].description;
        var icon = weather.weather[0].icon;

        var dateEle = document.createElement("p");
        dateEle.innerHTML = dateFormatted;

        var iconEle = document.createElement("img");
        iconEle.src = `http://openweathermap.org/img/w/${icon}.png`;

        var tempEle = document.createElement("p");
        tempEle.innerHTML = `Temp: ${temp} ℉`;

        var windEle = document.createElement("p");
        windEle.innerHTML = `Wind: ${wind} MPH`;

        var humidityEle = document.createElement("p");
        humidityEle.innerHTML = `Humidity: ${humidity} %`;

        var forcastContainer = document.createElement("div");
        forcastContainer.style.width = "fit-content";
        forcastContainer.classList.add("card");
        forcastContainer.append(dateEle);
        forcastContainer.append(iconEle);
        forcastContainer.append(tempEle);
        forcastContainer.append(windEle);
        forcastContainer.append(humidityEle);

        document.getElementById("forecast").append(forcastContainer);
      }
    });
}
