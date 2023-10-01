import { da } from "date-fns/locale";
import { getWeather } from "./weather.js";
import { add, format, parse, parseISO } from "date-fns";
function WeatherApp() {
  let data, hour, latitude, longitude, activeCard;
  //DOM
  let locationInput = document.querySelector("input[type='text']");
  let searchBtn = document.querySelector("#btnSearchLoc");
  let userLocBtn = document.querySelector("#btnUserLoc");

  searchBtn.addEventListener("click", async function () {
    data = await requestWeather(locationInput.value);
    hour = new Date(data.location.localtime).getHours();
    displayGraphics(data);

    console.log(data);
    console.log(hour);
  });
  userLocBtn.addEventListener("click", weatherByLocation);
  locationInput.addEventListener("keyup", async function (e) {
    if (e.key == "Enter") {
      data = await requestWeather(locationInput.value);
      hour = new Date(data.location.localtime).getHours();
      displayGraphics(data);

      console.log(data);
      console.log(hour);
    }
  });

  function weatherByLocation() {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(usePosition);
      } else {
        alert("Your browser does not support geolocation");
      }
    }

    async function usePosition(position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      let coord = `${latitude},${longitude}`;
      /*
      timeZone = await fetch(
        `http://api.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=gabrielhg`,
        { mode: "cors" }
      );
      timeZone = await timeZone.json();
      timeZone = timeZone.gmtOffset;
      */
      hour = new Date().getHours();

      data = await requestWeather(coord);
      locationInput.value = data.location.name;
      displayGraphics(data);

      console.log(coord);
      console.log(hour);
      console.log(data);
    }

    getLocation();
  }

  async function requestWeather(location) {
    try {
      data = await getWeather(location, 3);
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  function displayGraphics(data) {
    let barDays = document.querySelector("#bar-days");
    barDays.style.backgroundColor = "transparent";
    barDays.innerHTML = "";

    data.forecast.forecastday.forEach(function (dayData, index) {
      let cardDay = Card(dayData);
      let day = document.createElement("div");
      day.classList.add("weather-day");
      day.innerText = format(parseISO(dayData.date), "PP");
      if (index == 0) {
        day.classList.add("selected-day");
        activeCard = 0;
        cardDay.addContent();
      }
      day.addEventListener("click", function () {
        Array.from(document.querySelectorAll(".weather-day"))[
          activeCard
        ].classList.remove("selected-day");
        day.classList.add("selected-day");
        activeCard = index;
        cardDay.addContent();
      });
      barDays.append(day);
    });
  }

  weatherByLocation();
}

function Card(dayData) {
  let content = document.querySelector("#card-content");

  function addContent() {
    content.innerHTML = "";
    let barOptions = document.createElement("div");
    barOptions.classList.add("bar-options");

    let generalOpt = document.createElement("div");
    generalOpt.classList.add("general-opt");

    let hoursOpt = document.createElement("div");
    hoursOpt.classList.add("hours-opt");

    let optionContent = document.createElement("div");
    optionContent.classList.add("option-content");

    content.append(barOptions);
    content.append(optionContent);

    //content.innerHTML = "";
  }

  function addGeneral() {}

  function addHours() {}

  return { addContent };
}

export { WeatherApp };
