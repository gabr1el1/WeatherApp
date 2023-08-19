async function getWeather(location, days = 0) {
  let queryString = "";
  if (days == 0) {
    queryString = `http://api.weatherapi.com/v1/forecast.json?key=22c4f6abe3d941769c6155133230608&q=${location}`;
  } else {
    queryString = `http://api.weatherapi.com/v1/forecast.json?key=22c4f6abe3d941769c6155133230608&q=${location}&days=${days}`;
  }
  let response = await fetch(queryString, { mode: "cors" });
  let json = await response.json();
  return json;
}

export { getWeather };
