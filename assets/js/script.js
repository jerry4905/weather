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
}
$("#button-addon2").on("click", function () {
    getweather();
});
$("#recentSearches").on("click", function (btn) {
    var clickedRecentCIty = $(this).val();
    $("#searchCity").val(clickedRecentCity);
    getWeather();
});

function saveRecent(cityName) {
    var recentSearchesBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    $("#recentSearches").append(recentSearchesBtn);
    var duplicate = verifyNoDup(cityame);
    console.log("are there any duplicates" + duplicate);
    if (!duplicate) {
        recentSearchArr.push(cityName)
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