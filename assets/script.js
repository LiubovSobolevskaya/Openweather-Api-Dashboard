var API_key = '6287ac582e2f7161a8095a421dedeb31';
var city;

// displayCityInfo function re-renders the HTML to display the appropriate content
function displayCityWeather() {

    var cityURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`
    console.log(cityURL)

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function(response) {
        // if (!response){
        //     alert("Please check the city name spelling!")
        //     return;
        // }
        console.log(response[0]);
        var lon = response[0].lon;
        var lat = response[0].lat;
  
        var weatherURL =`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`;
        console.log(weatherURL)
        

        $.ajax({
            url: weatherURL,  
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;
            var icon = response.weather[0].icon;
            var icon_png = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            console.log(temp);
            console.log(humidity);
            console.log(windSpeed);
            //console.log(icon );
            var cityDiv = $('#chosenCity').empty();
            cityDiv.addClass("card");
    
            // Creating an element to have the rating displayed
            var cityName = $("<h2>");
            var spanIcon = $("<span>");
           
            var weatherIcon = $("<img>");
            weatherIcon.attr("src", icon_png)
       
            cityName.text(`${city} (${dayjs().format("MM/DD/YY")})`);
            spanIcon.append(weatherIcon);
            cityName.append(spanIcon);    
            // Displaying the city and the current Date
            cityDiv.append(cityName);
    
            // Creating an element to hold the release year
            var pTemp = $("<p>")
            pTemp.text("Temperature: " + temp + "°F");
    
            // Displaying Temperature
            cityDiv.append(pTemp);
    
   
            var pHumidity = $("<p>")
            pHumidity.text("Humidity: " + humidity + "%");
           
            // Displaying Humidity
            cityDiv.append(pHumidity);

            // Creating an element to hold the plot
            var pWindSpeed= $("<p>")
            pWindSpeed.text("Weend Speed: " + windSpeed + "MPH");
           
            // Displaying Wind Speed
            cityDiv.append(pWindSpeed);

        }); 
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`;
        console.log(forecastURL);
        $.ajax({
            url: forecastURL,  
            method: "GET"
        }).then(function(response) {
            forecast = response.list;
         

            var temperature_max = {};
            var temperature_min= {};
            var humidity = {};
            var windSpeed = {};
            var icon= {};
            var days = [];
            for (var i=0;i<forecast.length; i++){
                
                var day = forecast[i].dt_txt.split(' ')[0]; 
                if (!days.includes(day)){
                    days.push(day);

                }
               
                if (!temperature_max[day]){
                    temperature_max[day] = [];
                }
                if (!temperature_min[day]){
                    temperature_min[day] = [];
                }
                if (!humidity[day]){
                    humidity[day] = [];
                }
                if (!windSpeed[day]){
                    windSpeed[day] = [];
                }
                if (!icon[day]){
                    icon[day] = [];
                }
                temperature_max[day].push(forecast[i].main.temp_max);
                temperature_min[day].push(forecast[i].main.temp_min);
                humidity[day].push(forecast[i].main.humidity);
                windSpeed[day].push(forecast[i].wind.speed);
                icon[day].push(forecast[i].weather[0].icon); 

            }  
            if (days.length>5){
                days.shift()
            }

            console.log(temperature_max);
            console.log(temperature_min);

            function avg(array) {
                var sum = 0;
                for (let i = 0; i < array.length; i++) {
                    sum += array[i];
                }
                return sum / array.length;
            }

            function max(array) {
                var max_value = array[0];
                for (let i = 1; i < array.length; i++) {
                    if (array[i]>max_value){
                        max_value = array[i];
                    }
                }
                return max_value;
            }
            function min(array) {
                var min_value = array[0];
                for (let i = 1; i < array.length; i++) {
                    if (array[i]<min_value){
                        min_value = array[i];
                    }
                }
                return min_value;
            }


            console.log(days);
            moreDaysContainer = $("#more-weather-days").empty();
            for (var i=0; i<days.length; i++){

                var cityCard = $("<div>");
                cityCard.addClass("col-6 col-md-2 col-lg-2 bg-dark text-light");
                day = days[i];
                console.log(day);
  
                var temp_max = max(temperature_max[day]);
            
                var temp_min = min(temperature_min[day]);
    
                var humidity_mean = avg(humidity[day]);
                var windSpeed_max = max(windSpeed[day]);
               
                var countIcons = {}
              
                for (var j=0; j<icon[day].length; j++){
                    var icon_img = icon[day][j];
                    if (!countIcons[icon_img ]){
                        countIcons[icon_img ] = 1;
                    }
                    else{
                        countIcons[icon_img]++;
                    }
                }

                var max_count = countIcons[icon[day][0]];
                var max_icon = icon[day][0];
         
                for (var j=0; j<icon[day].length; j++){
                    var icon_img = icon[day][j];
                    if ( countIcons[icon_img] > max_count){
                        max_count = countIcons[icon_img];
                        max_icon = icon_img
                    }
                }

                var icon_png = `https://openweathermap.org/img/wn/${max_icon}@2x.png`;

                var date = $("<h3>");
                var spanIcon = $("<span>");
                var weatherIcon = $("<img>");
                weatherIcon.attr("src", icon_png)
 
                date.text(day.split('-')[1]+'/'+day.split('-')[2]+'/'+day.split('-')[0]);
                spanIcon.append(weatherIcon);
                date.append(spanIcon);   
                cityCard.append(date);
     
                var pTemp_min = $("<p>")
                pTemp_min.text("Temp min: " + temp_min + "°F");
                // Displaying  min Temperature
                cityCard.append(pTemp_min);
 
                var pTemp_max = $("<p>")
                pTemp_max.text("Temp max: " + temp_max + "°F");
                // Displaying  max Temperature
                cityCard.append(pTemp_max);

                var pHum = $("<p>");
    
                pHum.text("Avg Humidity: " + humidity_mean + "%");
            
                // Displaying Humidity
                cityCard.append(pHum);
     
                // Creating an element to hold the plot
                var pWindSp= $("<p>")
                pWindSp.text("Max Wind Speed: " + windSpeed_max + "MPH");
                // Displaying Wind Speed
                cityCard.append(pWindSp);
                moreDaysContainer.append(cityCard);
              

            }
   

          
        }); 


    });
}

function CityWeather(event){
    event.preventDefault();

    city = $("#city-input").val().trim();
    if (city){
        displayCityWeather();
    }
    $("#city-input").val("");

    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (!storedCities) {
        // If no scores are stored, create a new array
        storedCities = [];
    }
    if (!storedCities.includes(city)){
        storedCities.push(city);
    }
    
    localStorage.setItem("cities", JSON.stringify(storedCities));
    renderButtons()


}
$("#city-search-btn").on("click", CityWeather);


// // Function for displaying  archived cities
function renderButtons() {

    cities = JSON.parse(localStorage.getItem("cities"));
    
    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var newButton = $("<button>");
        // Adding a class of movie-btn to our button
  
        // Adding a data-attribute
        newButton.attr("data-city", cities[i]);
        // Providing the initial button text
        newButton.text(cities[i]);
        newButton.addClass("btn btn-block btn-custom city-btn w-90 ");
        // Adding the button to the buttons-view div
        $("#buttons-view").prepend(newButton);
    }
}
function showCity(){
    city = $(this).attr("data-city");
    displayCityWeather()


}

$(document).on("click", ".city-btn", showCity);
// Calling the renderButtons function to display the intial buttons
renderButtons();