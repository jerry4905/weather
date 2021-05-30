var recentSearchArr = [];


function getWeather() {
    var searchCity = $("#searchCity").val();
    saveRecent(searchCity);

    //fetch api 
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
         searchCity +
        "&appid=8f62257571888eedbb0ada9d2502e1fa"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log("api response", response);
        });
};
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

    function verifyNoDup(cityName){
        for(var i=0; i<recentSearchArr.length; i++) {
            if (cityName === recentSearchArr[i] || cityName == "undefined") {
                return true;
            } else {
                return false;
            }
        }
    }
   
}


//getWeather();