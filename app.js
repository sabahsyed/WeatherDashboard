//PSEUDO CODING
//Accept city name dynamically via # from html
//Present and Future conditons dispakyed and use local storage to save the entered cities
// Properties of teh present city to be displayed are city name, the date,
// an icon representation of weather conditions, the temperature, the humidity, the wind speed, 
//and the UV index.
$( document ).ready(function() {
  var uvIndexValue = document.getElementById("uvIndexStyle")
  console.log( "ready!" );
  var searchedCityName = JSON.parse(localStorage.getItem("searchedCityName"));
  searchCity(searchedCityName);
function weatherURL(city){
var queryURL = "https://api.openweathermap.org/data/2.5/weather?";
var query = "q=" + city ; 
var key = "&appid=6c4d3670e39951bed6938f0465347df7";
return queryURL + query + key ;
}
function forecastURL(city){
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?"
var query = "q=" + city ; 
var key = "&appid=6c4d3670e39951bed6938f0465347df7";
return queryURL + query + key ;
}

$("#submit").on("click", function(){
  event.preventDefault();
  console.log("Submit button clicked");
  searchCity($("#cityName").val());
  
});


function searchCity(city) {

  var queryURL = weatherURL(city);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
   // var searchedCityName = JSON.parse(localStorage.getItem("searchedCityName"));
  if (searchedCityName == null) {
      searchedCityName = [];
    searchedCityName[0] = response.name;
    searchedCityName.push(response.name);
    localStorage.setItem("searchedCityName",JSON.stringify(searchedCityName));
  } else {
    var size = searchedCityName.length;
    console.log("size is : " + size);
    searchedCityName[size] = response.name;
   //searchedCityName.push(response.name);
    //localStorage.setItem("searchedCityName", JSON.stringify(searchedCityName));
  
  console.log(response);
  displayWeather();
  function displayWeather(){
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $("#city").html(response.name);
    $("#currentDate").html(moment().format("DD/MM/YYYY"));
    var iconurl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
    $('#wicon').attr('src', iconurl);
    $("#windSpeed").html("Wind Speed: " + response.wind.speed + "MPH");
    $("#humidity").text("Humidity: " + response.main.humidity + "%");
    $("#temperature").text("Temperature : " + tempF.toFixed(2)+ "℉");
    var x = response.coord.lat;
    var y = response.coord.lon;
    var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + x + "&lon=" + y + "&appid=6c4d3670e39951bed6938f0465347df7";
    console.log(uvIndexURL);
      $.ajax({
        url: uvIndexURL,
        method: "GET"
      }).then(function(uvresponse) {
        console.log("UV index response" + JSON.stringify(uvresponse));
       // $("#uvIndexStyle").html( "UV Index :" +uvresponse[0].value);
       $("#uvIndex").html("UV Index :");
       $("#uvIndexStyle").html(uvresponse[0].value);
       if(uvresponse[0].value > 6){
        $("#uvIndexStyle").css("background-color", "red");
      }else{
        $("#uvIndexStyle").css("background-color", "light-green");
      }
       var uvStyle = uvresponse[0].value;
       
      });
    }
    localStorage.setItem("searchedCityName", JSON.stringify(searchedCityName));
    var a = $("<button>").text(response.name);
    var renderedCities = $("#renderedCities").append(a);
    $("#renderedCities").append("<br/>");
    $(a).on("click", function(){
      displayWeather(a.text());
    
    });
  }
  });

}
  $("#city").on("click", function(city){
   
    console.log("Rendered city was clicked");
    console.log(city.currentTarget.textContent);
    var queryURL = forecastURL(city.currentTarget.textContent);
    console.log(queryURL);
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(res) {
      console.log("I am in 5 day forecast");
      console.log("Day1 Temperature :" + res.list[0].main.temp);
      console.log("Day 1 icon" + res.list[0].weather.icon );
      console.log("Day1 humidity " + res.list[0].main.humidity);
      for(var i = 0 ; i < 5 ; i++){
        var cardClass = $("<div>").addClass("card");
        var carHeaderClass = $("<div>").addClass("card-header");
        var carBodyClass = $("<div>").addClass("card-body");
        var weather = $("<div>").addClass("card-text");
        var humidity = $("<div>").addClass("card-text");
        var tempF = (res.list[i].main.temp - 273.15) * 1.80 + 32;
        var weatherEle = weather.text("Temp : "  + tempF.toFixed(2) + "℉");
        var humidityEle = humidity.text("Humidity : " + res.list[i].main.humidity + "%");
        var img = $('<img id="wicon">');
        var iconurl = "https://openweathermap.org/img/wn/" + res.list[i].weather[0].icon + "@2x.png";
        $(img).attr('src', iconurl);
        var iconEle = $(img).attr('src', iconurl);
        carBodyClass = iconEle.addClass("card-body"); //class added
        var date = moment().add((i+1),"day");
        var nextDay = date.format('MM-DD-YYYY');
        var dateEle = carHeaderClass.text(nextDay);
        console.log("I am the nextday: " + nextDay);
        cardClass.append(dateEle , iconEle , weatherEle , humidityEle);
        $(".card-group").append(cardClass);
      }


    });
});

});

