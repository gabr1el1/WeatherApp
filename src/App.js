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
      let depuratedDay = {};
      if (index == 0) {
        depuratedDay = {
          astro: dayData.astro,
          day: dayData.day,
          hour: dayData.hour.slice(hour),
        };
      } else {
        depuratedDay = {
          astro: dayData.astro,
          day: dayData.day,
          hour: dayData.hour,
        };
      }

      let cardDay = Card(depuratedDay);
      console.log(depuratedDay);
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
  let optionContent;
  let activeOption = 0;
  function addContent() {
    content.innerHTML = "";
    let barOptions = document.createElement("div");
    barOptions.id = "bar-options";

    let generalOpt = document.createElement("div");
    generalOpt.id = "general-opt";
    generalOpt.innerText = "General forecast";

    let detailOpt = document.createElement("div");
    detailOpt.id = "detail-opt";
    detailOpt.innerText = "Details";

    optionContent = document.createElement("div");
    optionContent.id = "option-content";
    if (activeOption == 0) {
      generalOpt.classList.add("active");
      addGeneral();
    } else {
      detailOpt.classList.add("active");
      addDetail();
    }

    generalOpt.addEventListener("click", function () {
      generalOpt.classList.add("active");
      detailOpt.classList.remove("active");
      activeOption = 0;
      addGeneral();
    });

    detailOpt.addEventListener("click", function () {
      detailOpt.classList.add("active");
      generalOpt.classList.remove("active");
      activeOption = 1;
      addDetail();
    });

    barOptions.append(generalOpt);
    barOptions.append(detailOpt);

    content.append(barOptions);
    content.append(optionContent);

    //content.innerHTML = "";
  }

  function addGeneral() {
    optionContent.innerHTML = "";
  }

  function addDetail() {
    optionContent.innerHTML = "";
    let table = document.createElement("table");
    let tblHeader = document.createElement("tr");
    tblHeader.innerHTML = `<th>Hour</th><th>Condition</th><th>Chance of rain</th><th>Temperature</th>`;
    table.append(tblHeader);

    let html = "";
    dayData.hour.forEach(function (hour) {
      html += `<tr>
      <th>${new Date(hour.time).getHours()}</th>
      <th><image src="${hour.condition.icon}"></th>
      <th>${hour.chance_of_rain}</th>
      <th>${hour.temp_c}</th>
      </tr>`;
    });

    table.innerHTML = table.innerHTML + html;

    optionContent.append(table);
  }

  return { addContent };
}

export { WeatherApp };
