var recentSearchArr = [];


function getWeather() {
    var searchCity = $("#searchCity").val();
    saveRecent(searchCity);

    //fetch api 
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchCity +
        "&appid=8f62257571888eedbb0ada9d2502e1fa"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log("api response", response);
            let tempK = parseFloat(response.main.temp);
            // convert Kelvin to Farenheit
            let tempF = ((tempK - 273.15) * 9 / 5) + 32;
            let humidity = response.main.humidity;
            let windspeed = response.wind.speed;
            let country = response.sys.country;

            // The latitude and longitude are pulled from the first endpoint so they can be used as search parameters in the second enpoint (which gets the UV index and future forecase).
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            latitude = lat;
            longitude = lon;

            $('#currentIcon').attr('src', 'https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png');
            $('#currentIcon').attr('style', 'height: 70px; width: 70px; margin-top: -8px;');
            $('#currentTemp').text(`Temperature: ${tempF.toFixed(1)} °F`);
            $('#currentHumidity').text(`Humidity: ${humidity}%`);
            $('#currentWindSpeed').text(`Wind Speed: ${windspeed} MPH`);

             // This function call gets the UV index and future forecast
             getUvAndFutureWeather();
        });
};

function getUvAndFutureWeather() {
       //fetch api 
    fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly&appid=8f62257571888eedbb0ada9d2502e1fa"
        
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log("api response2", response);
            // This logic determines what color the UV Index will be.
            currentUvIndexVal = $('<span>');
            if (currentUvIndex <= 3){
                uvIndexVal.attr('class', 'badge badge-success');
            } else if (currentUvIndex > 3 && currentUvIndex <= 6){
                uvIndexVal.attr('class', 'badge badge-warning');
            } else if (currentUvIndex > 6 && currentUvIndex <= 7){
                uvIndexVal.attr('class', 'badge badge-warning');
                uvIndexVal.attr('style', 'background-color: orange;');
            } else if (currentUvIndex> 7 && currentUvIndex <= 10){
                uvIndexVal.attr('class', 'badge badge-danger');
            } else if (currentUvIndex >= 10){
                uvIndexVal.attr('class', 'badge badge-danger');
                uvIndexVal.attr('style', 'background-color: purple;');
            }
            $('#currentUvIndex').text(`UV Index: `);
            currentUvIndexVal.text(currentUvIndex);
            $('#currentUvIndex').append(currentUvIndexVal);

            // This empties the forecastCards Div so it can be populated with new information every time this function is called.
            $('#futureCards').empty();

            fiveDayForecast = $('<h2>');
            fiveDayForecast.text('5-Day Forecast:');
            $('#futureCards').prepend(fiveDayForecast);
            
            hrTag = $('<hr>');
            $('#futureCards').prepend(hrTag);

            // This iterates through the 5 forecast cards and populates each with information for the next 5 days.
            for (let i = 1; i < 6; i++){
                // Taken from the moment.js documentation, this converts the response.daily.dt value to a readable date.
                let timestamp = moment.unix(response.daily[i].dt).format("MM/DD/YYYY");
                // creates all of the elements in each of the forecast cards and gives the cards necessary attributes and values.
                let forecastCardDiv = $('<div>');
                let forecastCard = $('<div>');
                let forecastDate = $('<h5>');
                let forecastTemp = $('<p>');
                let forecastHumidity = $('<p>');
                let forecastIcon = $('<img>');
                forecastCardDiv.attr('class', 'card text-white bg-primary mb-3');
                forecastCardDiv.attr('style', 'max-width: 18rem; float: left; width: 180px; height: 235px; margin-right:10px;');
                forecastCardDiv.attr('id', `card${i}`);
                
                forecastCard.attr('class', 'card-body');
                forecastCardDiv.append(forecastCard);
                
                forecastDate.attr('class', 'card-title');

                forecastDate.text(timestamp);
                forecastIcon.attr('src', 'https://openweathermap.org/img/wn/' + response.daily[i].weather[0].icon + '@2x.png');
                let forecastTempK = response.daily[i].temp.max;
                let forecastTempF = ((forecastTempK - 273.15)*9/5) + 32;
                forecastTemp.text(`Temp: ${forecastTempF.toFixed(1)} °F`);
                forecastHumidity.text(`Humidity: ${response.daily[i].humidity}%`);
                
                forecastCard.append(forecastDate);
                forecastCard.append(forecastIcon);
                forecastCard.append(forecastTemp);
                forecastCard.append(forecastHumidity);
                
                $('#futureCards').append(forecastCardDiv);   
            }


        })}
$("#button-addon2").on("click", function () {
    getWeather();
});
$("#recentSearches").on("click", ".btn", function (btn) {
    var clickedRecentCity = $(this).val();
    $("#searchCity").val(clickedRecentCity);
    getWeather();
});

// display resuls on page
function displayResults(cityName) {
    console.log(cityName)
    var today = moment().format('MMMM Do YYYY')

    // update current day information form search 
    $("#currentDate").text(today);
    $("#currentTemp").text("Temp:");
    $("#currentWindSpeed").text("Wind:");
    $("#currentHumidity").text("Humidity:");
    $("#currentUvIndex").text("UV:");
};

// save search results
function saveRecent(cityName) {
    //create button for cityName searched
    var recentSearchBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    displayResults();
    //update city name 
    $("#currentCity").text(cityName);

    $("#recentSearches").append(recentSearchBtn);
    // check to see if cityName duplcate
    var duplicate = verifyNoDup(cityName);
    console.log("duplicate check" + duplicate);
    if (!duplicate) {
        recentSearchArr.push(cityName)
        // save to local storage 
        localStorage.setItem("recentCities", JSON.stringify(recentSearchArr));
        return;
    }

    function verifyNoDup(cityName) {
        for (var i = 0; i < recentSearchArr.length; i++) {
            if (cityName === recentSearchArr[i] || cityName == "undefined") {
                return true;
            } else {
                return false;
            }
        }
    }

}


//getWeather();