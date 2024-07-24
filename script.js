const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");



const API_KEY= " 3ba091ea7aec602b0a9ffc5edb3f0c66 "; //api key for open weather app

 const createWeatherCard = (cityName,weatherItem, index) => {
    if(index === 0){   //html for main weather card
        return`<div class="details">
        <h2> ${cityName} (${weatherItem.dt_txt.split("")[0]})</h2>
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C </h4>
        <h4>Wind:${weatherItem.wind.speed } M/S</h4>
        <h4> Humidity: ${weatherItem.main.humidity } % </h4>
    </div>
    <div class="icon">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4>${weatherItem.weather[0].description} </h4>
    </div>`;
    }
    else{   //html for the other five day forecast card
        return`<li class="card">
        <h3> (${weatherItem.dt_txt.split("")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
        <h4> Temp:${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C </h4>
        <h4>Wind:${weatherItem.wind.speed } M/S</h4>
        <h4> Humidity: ${weatherItem.main.humidity } % </h4>
    </li>`;
    }

   
 }


    const  getWeatherDetails = (cityName, lat, lon) =>{
        const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt={cnt}&appid=${API_KEY}`;
   
   
   
   
   
   
        fetch( WEATHER_API_URL).then(res => res.json()).then(data =>{
             //fillter the forecast to get only one forecast per day
            
             const uniqueForecastDays =[];
             const fiveDaysForecast = data.list.filter( forecost => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if( !uniqueForecastDays .includes(forecastDate)){
                    return uniqueForecastDays.push(forecastDate);
                }
             });

             //clearing previous weather data
             cityInput.value = " ";
             currentWeatherDiv.innerHTML=" ";
             weatherCardsDiv.innerHTML = " ";
          
             //creating weather cards and adding them to the DOM
              fiveDaysForecast .forEach((weatherItem , index)=> {
                if(index === 0){
                    currentWeatherDiv.insertAdjacentElement("beforeend",createWeatherCard(cityName, weatherItem, index));
                }else{
                    weatherCardsDiv.insertAdjacentElement("beforeend",createWeatherCard(cityName, weatherItem, index));
                }

               
              });

}).catch(() => {
    alert=("An error occured while fetching the weather forecast!");
});
    }

    const getCityCoordinates = () =>{   
    const cityName = cityInput.value.trim();   //get user entered city name and remove extre space
    if(!cityName) return; //return cityname is empty
   const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

//get entered city coordinates (latitude ,longtitude and name) from the Api response
   fetch( GEOCODING_API_URL).then(res => res.json()).then(data => {
    if(!data.length) return alert=(`No Coordinates found for ${cityName}`);
   
}).catch(() => {
    alert=("An error occured while fetching the coordinates!")
});


}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition (
        
            position => {
                const{ latitude , longitude } =position.coords;
                const REVERSE_GEOCOADING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
               
               //Get city name from coordinates using reverse geocoding Api
                fetch( REVERSE_GEOCOADING_URL).then(res => res.json()).then(data =>{
                    const{name} =data[0];
                    getWeatherDetails(name, latitude,longitude); 

                }).catch(() => {
                    alert=("An error occured while fetching the city!")
                });
    },
    
        error => {   // Show alert if user denied the location permission 
            if(error.code === error.PERMISSION_DENIED) {
                   alert ("Geolocation request denied.please reset location permission to grand access again.");
            }
            
        }
    );
}

 



locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());


