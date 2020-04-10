//PSEUDO CODING
//Accept city name dynamically via # from html
//Present and Future conditons dispakyed and use local storage to save the entered cities
// Properties of teh present city to be displayed are city name, the date,
// an icon representation of weather conditions, the temperature, the humidity, the wind speed, 
//and the UV index.

function weatherURL(city){
var queryURL = "http://api.openweathermap.org/data/2.5/weather?";
var query = "q=" + city ; 
var key = "&appid=6c4d3670e39951bed6938f0465347df7";
return queryURL + query + key ;
}
function forecastURL(city){
var queryURL = "http://api.openweathermap.org/data/2.5/forecast?"
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
  //$("#renderedCities").val(localStorage.getItem(city));
  // var searchedCityName = JSON.parse(localStorage.getItem("searchedCityName"));
  // if (searchedCityName == null) {
  //    searchedCityName = [];
  //   searchedCityName[0] = city;
  // } else {
  //   var size = searchedCityName.length;
  //   searchedCityName[size] = city;
  // }

  var queryURL = weatherURL(city);
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var searchedCityName = JSON.parse(localStorage.getItem("searchedCityName"));
  if (searchedCityName == null) {
      searchedCityName = [];
    searchedCityName[0] = response.name;
  } else {
    var size = searchedCityName.length;
    console.log("size is : " + size);
    searchedCityName[size] = response.name;
  }
  console.log(response);
  var tempF = (response.main.temp - 273.15) * 1.80 + 32;
  $("#city").html(response.name);
  $("#currentDate").html(moment().format("DD/MM/YYYY"));
  var iconurl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
  $('#wicon').attr('src', iconurl);
  $("#windSpeed").html("Wind Speed: " + response.wind.speed + "MPH");
  $("#humidity").text("Humidity: " + response.main.humidity + "%");
  $("#temperature").text("Temperature : " + tempF.toFixed(2)+ "℉");
  // $("#uvIndex").html("UV Index: " + uvresponse[0].value);
  var x = response.coord.lat;
  var y = response.coord.lon;
  var uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + x + "&lon=" + y + "&appid=6c4d3670e39951bed6938f0465347df7";
  console.log(uvIndexURL);
    $.ajax({
      url: uvIndexURL,
      method: "GET"
    }).then(function(uvresponse) {
      console.log("UV index response" + JSON.stringify(uvresponse));
      console.log(uvresponse[0].value);
      if(uvresponse[0].value > 6){
        $("#uvIndexStyle").css("background-color", "red");
      }else{
        $("#uvIndexStyle").css("background-color", "light-green");
      }
      $("#uvIndexStyle").html( uvresponse[0].value);
      
    });
  localStorage.setItem(searchedCityName, JSON.stringify(response.name));
  var a = $("<button>").text(response.name);
  var renderedCities = $("#renderedCities").append(a);
  $("#renderedCities").append("<br/>");
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
      console.log("I am in 5 day forecast :" + JSON.stringify(res));
    });
    $("#day1Date").html(moment().add(1, 'days').calendar());
    $("#day2Date").html(moment().add(2, 'days').calendar());
    $("#day3Date").html(moment().add(3, 'days').calendar());
    $("#day4Date").html(moment().add(4, 'days').calendar());
    $("#day5Date").html(moment().add(5, 'days').calendar());
});
// var forecast = forecastURL(city);
//   function forecast5day(city){
//     console.log("Inside forecast");
//     $.ajax({
//       url: forecast,
//       method: "GET"
//     }).then(function(forecastResponse) {
//       console.log("Forecast response" + forecastResponse);
//       $("#day1Date").html(moment().add(1, 'days').calendar());
//       $("#day2Date").html(moment().add(2, 'days').calendar());
//       $("#day3Date").html(moment().add(3, 'days').calendar());
//       $("#day4Date").html(moment().add(4, 'days').calendar());
//       $("#day5Date").html(moment().add(5, 'days').calendar());
//     });
//   }