async function getWeather(location) {
  let queryString = `https://api.weatherapi.com/v1/forecast.json?key=22c4f6abe3d941769c6155133230608&q=${location}&days=3`;
  try {
    let response = await fetch(queryString, { mode: "cors" });
    if (response.status == 200) {
      let json = await response.json();
      return json;
    } else {
      throw Error("Bad request");
    }
  } catch (error) {
    alert(error.message);
  }
}

/*
fetch(`http://api.weatherapi.com/v1/forecast.json?key=22c4f6abe3d941769c6155133230608&q=Tlajomulco&days=3`, {mode: 'cors'})
    .then(function(response) {
      return response.json();
    }).then(function(response){
      console.log(response)
    })

*/

export { getWeather };
