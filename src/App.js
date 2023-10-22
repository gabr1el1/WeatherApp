import { getWeather } from "./weather.js";
import { format, parseISO, set } from "date-fns";
/*
TODO: 
ADD MORE weather conditions
PUT LOADING IMAGE before data shows     
*/

function WeatherApp() {
  let data,
    hour,
    latitude,
    longitude,
    tmZn,
    hourWeatherText,
    dayLight,
    isSunset,
    sunsetStr,
    hourWeatherIcon,
    activeCard,
    tempUnits,
    hourSunrise,
    minuteSunrise,
    hourSunset,
    minuteSunset,
    currentLocation,
    cardsDays = [];
  //DOM
  let hourTag = document.querySelector(".hour");
  let locationInput = document.querySelector("input[type='text']");
  let searchBtn = document.querySelector("#btnSearchLoc");
  let userLocBtn = document.querySelector("#btnUserLoc");
  let swtchToggle = document.querySelector(".switch-toggle");
  let swtch = document.querySelector(".switch");

  swtchToggle.addEventListener("click", changeUnits);
  swtch.addEventListener("click", changeUnits.bind(swtchToggle));
  function changeUnits(e) {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
      tempUnits = "F";
    } else {
      this.classList.add("active");
      tempUnits = "C";
    }

    refreshGraphics();
    e.stopPropagation();
    //console.log(this);
  }

  searchBtn.addEventListener("click", async function () {
    data = await requestWeather(locationInput.value);
    hour = new Date(data.location.localtime).getHours();
    displayGraphics();

    console.log(data);
    console.log(hour);
  });
  userLocBtn.addEventListener("click", weatherByLocation);
  locationInput.addEventListener("keyup", async function (e) {
    if (e.key == "Enter") {
      currentLocation = locationInput.value;
      data = await requestWeather(currentLocation);
      hour = new Date(data.location.localtime).getHours();
      displayGraphics();

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
      currentLocation = coord;
      /*
      timeZone = await fetch(
        `http://api.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=gabrielhg`,
        { mode: "cors" }
      );
      timeZone = await timeZone.json();
      timeZone = timeZone.gmtOffset;
      */
      hour = new Date().getHours();
      data = await requestWeather(currentLocation);
      locationInput.value = data.location.name;
      displayGraphics(data);
    }
    //
    getLocation();
  }

  async function requestWeather(location) {
    try {
      data = await getWeather(location, 3);
      tmZn = data.location.tz_id;
      sunsetStr = data.forecast.forecastday[0].astro.sunset;
      console.log(`sunrise ${hourSunrise} : ${minuteSunrise}`);
      console.log(`sunset ${hourSunset} : ${minuteSunset}`);
      startInterval();
      console.log(data);
      return data;
    } catch (error) {
      alert(error.message);
    }
  }

  function displayGraphics() {
    let barDays = document.querySelector("#bar-days");
    barDays.style.backgroundColor = "transparent";
    barDays.innerHTML = "";
    cardsDays = [];
    data.forecast.forecastday.forEach(function (dayData, index) {
      let depuratedDay = {};
      if (index == 0) {
        depuratedDay = {
          astro: dayData.astro,
          day: dayData.day,
          hour: dayData.hour.slice(hour),
        };
        hourWeatherText = depuratedDay.hour[0].condition.text;
        hourWeatherIcon = depuratedDay.hour[0].condition.icon;
        console.log(hourWeatherText);
      } else {
        depuratedDay = {
          astro: dayData.astro,
          day: dayData.day,
          hour: dayData.hour,
        };
      }

      cardsDays.push(Card(depuratedDay));
      console.log(depuratedDay);
      let day = document.createElement("div");
      day.classList.add("weather-day");
      day.innerText = format(parseISO(dayData.date), "PP");
      if (index == 0) {
        day.classList.add("selected-day");
        activeCard = 0;
        cardsDays[activeCard].addContent(tempUnits);
        changeStyles();
      }
      day.addEventListener("click", function () {
        Array.from(document.querySelectorAll(".weather-day"))[
          activeCard
        ].classList.remove("selected-day");
        day.classList.add("selected-day");
        activeCard = index;
        cardsDays[activeCard].addContent(tempUnits);
        changeStyles();
      });
      barDays.append(day);
    });
  }

  function refreshGraphics() {
    cardsDays[activeCard].addContent(tempUnits);
  }

  async function changeStyles() {
    document.body.className = "";
    hourWeatherText = hourWeatherText.toLowerCase();

    if (dayLight) {
      document.body.classList.add("day");
    } else if (!dayLight) {
      document.body.classList.add("night");
    } else if (isSunset) {
      document.body.classList.add("sunset");
    }

    if (hourWeatherText == "clear") {
      document.body.classList.add("clear");
    }
    if (hourWeatherText == "sunny") {
      document.body.classList.add("sunny");
    }
    if (hourWeatherText == "cloudy") {
      document.body.classList.add("cloudy");
    }
    if (hourWeatherText == "partly cloudy") {
      document.body.classList.add("partly-cloudy");
    }
    if (hourWeatherText == "mist") {
      document.body.classList.add("mist");
    }
    if (hourWeatherText == "overcast") {
      document.body.classList.add("overcast");
    }
    if (hourWeatherText == "fog") {
      document.body.classList.add("fog");
    }

    if (hourWeatherText.includes("rain")) {
      document.body.classList.add("rain");
    }

    if (hourWeatherText.includes("shower")) {
      document.body.classList.add("shower");
    }

    if (hourWeatherText.includes("thunder")) {
      document.body.classList.add("thunder");
    }

    if (hourWeatherText.includes("snow")) {
      document.body.classList.add("snow");
    }

    if (hourWeatherText.includes("sleet")) {
      document.body.classList.add("sleet");
    }

    document.querySelector("#icon-weather").src = hourWeatherIcon;
  }

  function startInterval() {
    setInterval(function () {
      let d = new Date();
      let time12Locale = `${d.toLocaleString("en-US", {
        timeZone: tmZn,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}`;

      let time24Locale = `${d.toLocaleString("en-US", {
        timeZone: tmZn,
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}`;

      let time12Parts = time12Locale.split(":").map(function (hourPart) {
        return parseInt(hourPart);
      });

      let time24Parts = time24Locale.split(":").map(function (hourPart) {
        return parseInt(hourPart);
      });

      let sunset24Parts = sunsetStr.split(":");
      sunset24Parts[0] = parseInt(sunset24Parts[0]);
      sunset24Parts.push(sunset24Parts[1].split(" ")[1]);
      sunset24Parts[1] = parseInt(sunset24Parts[1].split(" ")[0]);

      let hour12Locale = time12Parts[0];
      let minute12Locale = time12Parts[1];
      let second12Locale = time12Parts[2];

      let hour24Locale = time24Parts[0];
      let minute24Locale = time24Parts[1];
      let second24Locale = time24Parts[2];

      let hourSunset24Locale = sunset24Parts[0] + 12;
      let minuteSunset24Locale = sunset24Parts[1];
      let secondSunset24Locale = sunset24Parts[2];

      if (minute12Locale == 0 && second12Locale == 0) {
        cardsDays[0].dayData.hour = cardsDays[0].dayData.hour.slice(1);
        hourWeatherText = cardsDays[0].dayData.hour[0].condition.text;
        refreshGraphics();
      }

      if (hour12Locale == 23 && minute12Locale == 59 && second12Locale == 59) {
        requestWeather(currentLocation);
      }

      let isDay = cardsDays[0].dayData.hour[0].is_day;
      if (isDay) {
        if (
          isDay &&
          hour24Locale == hourSunset24Locale &&
          minute24Locale >= minuteSunset24Locale
        ) {
          isSunset = true;
          dayLight = false;
        } else {
          isSunset = false;
          dayLight = true;
        }
      } else {
        dayLight = false;
        isSunset = false;
      }

      changeStyles();

      document.querySelector("span.hour").innerText = `${time12Locale}`;
    }, 1000);
  }

  weatherByLocation();
}

function Card(dayData) {
  let content = document.querySelector("#card-content");
  let optionContent;
  let activeOption = 1;
  let units;
  function addContent(tempUnits) {
    units = tempUnits;
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
    optionContent.className = "general";

    let generalCondition = document.createElement("div");
    generalCondition.id = "condition-tile";
    let generalAstro = document.createElement("div");
    generalAstro.id = "astro-tile";
    let generalTemperature = document.createElement("div");
    generalTemperature.id = "temperature-tile";
    let generalRain = document.createElement("div");
    generalRain.id = "rain-tile";

    generalCondition.innerHTML = `
    <h2>Condition</h2>
    ${dayData.day.condition.text}
    <img src="${dayData.day.condition.icon}">
    `;

    generalAstro.innerHTML = `
    <h2>Astro <i class="fa-solid fa-sun"></i></h2>
    <h3>Sunrise</h3>
    <p>Sunrise ${dayData.astro.sunrise}</p>
    <h3>Sunset</h3>
    <p>Sunset ${dayData.astro.sunset}</p>
    `;
    let genTempHtml = `
    <h2>Temperature <i class="fa-solid fa-temperature-three-quarters"></i></h2>
    <h3>Average</h3>`;
    if (units == "C") {
      genTempHtml += `
      <p>${dayData.day.avgtemp_c} °C</p>
      <h3>Maximum</h3>
      <p>${dayData.day.maxtemp_c} °C</p>
      <h3>Minimum</h3>
      <p>${dayData.day.mintemp_c} °C</p>
      `;
    } else {
      genTempHtml += `
      <p>${dayData.day.avgtemp_f} °F</p>
      <h3>Maximum</h3>
      <p>${dayData.day.maxtemp_f} °F</p>
      <h3>Minimum</h3>
      <p>${dayData.day.mintemp_f} °F</p>
      `;
    }

    generalTemperature.innerHTML = genTempHtml;

    generalRain.innerHTML = `
    <h2>Rain <i class="fa-solid fa-cloud-rain"></i></h2>
    <h3>Chance of rain</h3>
    <p>${dayData.day.daily_chance_of_rain} %</p>
    <h3>Precipitaion</h3>
    <p>${dayData.day.totalprecip_mm} mm</p>
    `;

    optionContent.append(generalCondition);
    optionContent.append(generalAstro);
    optionContent.append(generalTemperature);
    optionContent.append(generalRain);
  }

  function addDetail() {
    optionContent.innerHTML = "";
    optionContent.className = "detail";
    let table = document.createElement("table");
    let tblHeader = document.createElement("thead");
    tblHeader.innerHTML = `<thead><tr><th>Hour</th><th>Condition</th><th>Chance of rain</th><th>Precipitation</th><th>Temperature</th></tr></thead>`;
    table.append(tblHeader);

    let html = "";
    dayData.hour.forEach(function (hour) {
      html += `<tr>
      <th>${(function () {
        let hourWthr = new Date(hour.time).getHours();
        if (hourWthr == 0) {
          hourWthr = `12 AM`;
        } else if (hourWthr == 12) {
          hourWthr = `12 PM`;
        } else {
          hourWthr = hourWthr >= 12 ? `${hourWthr % 12} PM` : `${hourWthr} AM`;
        }
        return hourWthr;
      })()}</th>
      <th>
      <div>${hour.condition.text}</div>
      <div><img src="${hour.condition.icon}"></th></div>
      <th>${hour.chance_of_rain} %</th>
      <th>${hour.precip_mm} mm</th>
      `;

      if (units == "C") {
        html += `
        <th>${hour.temp_c} °C</th>
        </tr>
        `;
      } else {
        html += `
        <th>${hour.temp_f} °F</th>
        </tr>
        `;
      }
    });

    table.innerHTML = table.innerHTML + html;

    optionContent.append(table);
  }

  return { addContent, dayData };
}

export { WeatherApp };
