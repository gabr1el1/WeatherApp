import { getWeather } from "./weather.js";
import { diffDays } from "./validation.js";
import { Chart } from "chart.js/auto";
function WeatherApp() {
  //DOM
  let locationInput = document.querySelector("input[type='text']");
  let pickInput = document.querySelector("input[type='date']");
  let searchBtn = document.querySelector("button");

  searchBtn.addEventListener("click", requestWeather);

  async function requestWeather() {
    let date1 = new Date();
    let date2 = new Date(pickInput.value);

    try {
      let diff = diffDays(date1, date2);
      let data = await getWeather(locationInput.value, diff);
      displayGraphics(data);
    } catch (error) {
      alert(error.message);
    }
  }

  function displayGraphics(json) {
    displayChanceRain();
    displayTemperature();
    displayWind();
  }

  function displayChanceRain(json) {
    const ctx = document.getElementById("chart-rain").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function displayTemperature(json) {
    console.log(`Temperature: ${json}`);
  }

  const displayWind = function (json) {
    console.log(`Wind: ${json}`);
  };
}

export { WeatherApp };
