var recentSearchArr = [];

function getWeather() {
    var searchCity = $("#searchCity").val();
    saveRecent(searchCity);

    //fetch api 
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=london" +
        //searchCity +
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
    getweather();
});
$("#recentSearches").on("click", ".btn", function (btn) {
    var clickedRecentCity = $(this).val();
    $("#searchCity").val(clickedRecentCity);
    getWeather();
});

function saveRecent(cityName) {
    var recentSearchBtn = $("<input>", {
        type: "button",
        value: cityName,
        class: "btn btn-lg",
    });
    $("#recentSearches").append(recentSearchBtn);
    var duplicate = verifyNoDup(cityName);
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
getWeather();