var API_key = '6287ac582e2f7161a8095a421dedeb31';
var city;

// displayCityInfo function re-renders the HTML to display the appropriate content
function displayCityWeather() {

    var cityURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_key}`


    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function(response) {
        // If the response from the API call is empty, display an alert
        if (!$.trim(response)){
            alert("Please check the city name spelling!");
            return;
        }
         // Get the longitude and latitude of the city from the API response
        var lon = response[0].lon;
        var lat = response[0].lat;
        // Build the URL for the weather API call using the longitude, latitude, and API key
        var weatherURL =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`;
        // Make an AJAX call to the weather API using the URL and HTTP GET method
        $.ajax({
            url: weatherURL,  
            method: "GET"
        }).then(function(response) {
            var temp = response.main.temp;
            var humidity = response.main.humidity;
            var windSpeed = response.wind.speed;
            var icon = response.weather[0].icon;
            var icon_png = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            // Clear the previous city information and add a new card to hold the current city information
            var cityDiv = $('#chosenCity').empty();
            cityDiv.addClass("card");
      
            // Create an element to hold the city name and icon
            var cityName = $("<h2>");
            var spanIcon = $("<span>");
           
            var weatherIcon = $("<img>");
            weatherIcon.attr("src", icon_png)
            // Display the city name and current date using the dayjs library
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

            $('#forecastinfo').text('5 Days Forecast:');

        }); 
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_key}`;

        $.ajax({
            url: forecastURL,  
            method: "GET"
        }).then(function(response) {
            forecast = response.list; // Extract the list of forecast data from the response
            var temperature_max = {}; // Create an empty object to store the maximum temperature for each day
            var temperature_min= {}; // Create an empty object to store the minimum temperature for each day
            var humidity = {}; // Create an empty object to store the humidity for each day
            var windSpeed = {}; // Create an empty object to store the wind speed for each day
            var icon= {}; // Create an empty object to store the weather icon for each day
            var days = []; // Create an empty array to store the days for which data is available
            
            // Loop through each item in the forecast data
            for (var i=0;i<forecast.length; i++){
                 // Extract the day from the datetime string and store it in the day variable
                var day = forecast[i].dt_txt.split(' ')[0]; 
                // If the day is not already in the days array, add it
                if (!days.includes(day)){
                    days.push(day);
                }
                 // If there is no entry for the day in the temperature_max object, create an empty array for it
                if (!temperature_max[day]){
                    temperature_max[day] = [];
                }
                // If there is no entry for the day in the temperature_min object, create an empty array for it
                if (!temperature_min[day]){
                    temperature_min[day] = [];
                }
                // If there is no entry for the day in the humidity object, create an empty array for it
                if (!humidity[day]){
                    humidity[day] = [];
                }
                // If there is no entry for the day in the windSpeed object, create an empty array for it
                if (!windSpeed[day]){
                    windSpeed[day] = [];
                }
                // If there is no entry for the day in the icon object, create an empty array for it
                if (!icon[day]){
                    icon[day] = [];
                }
                // Add the temperature_max value for this forecast item to the temperature_max array for the day
                temperature_max[day].push(forecast[i].main.temp_max);
                // Add the temperature_min value for this forecast item to the temperature_min array for the day
                temperature_min[day].push(forecast[i].main.temp_min);
                // Add the humidity value for this forecast item to the humidity array for the day
                humidity[day].push(forecast[i].main.humidity);
                // Add the wind speed value for this forecast item to the windSpeed array for the day
                windSpeed[day].push(forecast[i].wind.speed);
                // Add the weather icon value for this forecast item to the icon array for the day
                icon[day].push(forecast[i].weather[0].icon); 

            }  
             // If there are more than 5 days in the days array, remove the first day
            if (days.length>5){
                days.shift()
            }
            // Define a function to calculate the average of an array of values 
            function avg(array) {
                var sum = 0;
                for (let i = 0; i < array.length; i++) {
                    sum += array[i];
                }
                return sum / array.length;
            }
            // Define a function to calculate the maximum value
            function max(array) {
                var maxValue = array[0];
                for (let i = 1; i < array.length; i++) {
                    if (array[i]>maxValue){
                        maxValue = array[i];
                    }
                }
                return maxValue;
            }
            // Define a function to calculate the min value
            function min(array) {
                var minValue = array[0];
                for (let i = 1; i < array.length; i++) {
                    if (array[i]<minValue){
                        minValue = array[i];
                    }
                }
                return minValue;
            }
            // Select and empty the container for the weather data
            moreDaysContainer = $("#more-weather-days").empty();
            // Loop through each day in the 'days' array
            for (var i=0; i<days.length; i++){

                var cityCard = $("<div>");
                // Add CSS classes to the div to control its layout
                cityCard.addClass("col-6 col-md-2 col-lg-2");
                day = days[i];
                // Calculate the maximum and minimum temperatures for this day
                var temp_max = max(temperature_max[day]);
                var temp_min = min(temperature_min[day]);
                // Calculate the average humidity and maximum wind speed for this day
                var humidity_mean = avg(humidity[day]).toFixed(2);
                var windSpeed_max = max(windSpeed[day]);
                // Create an object to keep track of how many times each weather icon appears
                var countIcons = {}
                // Loop through each weather icon for this day and count how many times each one appears
                for (var j=0; j<icon[day].length; j++){
                    var icon_img = icon[day][j];
                    if (!countIcons[icon_img ]){
                        countIcons[icon_img ] = 1;
                    }
                    else{
                        countIcons[icon_img]++;
                    }
                }
                // Find the most commonly-occurring weather icon for this day 
                var max_count = countIcons[icon[day][0]];
                var max_icon = icon[day][0];
         
                for (var j=0; j<icon[day].length; j++){
                    var icon_img = icon[day][j];
                    if ( countIcons[icon_img] > max_count){
                        max_count = countIcons[icon_img];
                        max_icon = icon_img
                    }
                }
                // Construct the URL for the most commonly-occurring weather icon
                var icon_png = `https://openweathermap.org/img/wn/${max_icon}@2x.png`;
                // Create a new heading element to display the date for this day
                var date = $("<h4>");
                var spanIcon = $("<span>");
                var weatherIcon = $("<img>");
                weatherIcon.attr("src", icon_png)
                // Format the date and add it to the heading element
                date.text(day.split('-')[1]+'/'+day.split('-')[2]+'/'+day.split('-')[0]);
                spanIcon.append(weatherIcon);
                date.append(spanIcon);   
                // Add the date and weather data to the city card div
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
                pWindSp.text("Max Wind Speed: " + windSpeed_max + " MPH");
                // Displaying Wind Speed
                cityCard.append(pWindSp);
                moreDaysContainer.append(cityCard);
              

            }
   
          
        }); 


    });


}

function CityWeather(event) {
    // Prevents the default behavior of the event (submitting a form and reloading the page)
    event.preventDefault(); 

    // Gets the value of an input field with an ID of "city-input", removes any leading/trailing whitespace, and assigns it to the "city" variable
    city = $("#city-input").val().trim();

    if (city && city != "") { // Checks if the "city" variable has a value and is not an empty string
        result = displayCityWeather();
    } else {
        return; // Exits the function if "city" is empty
    }

    $("#city-input").val(""); // Resets the value of the input field with an ID of "city-input" to an empty string

    // Gets the value of an item with a key of "cities" from local storage, parses it from a JSON string into a JavaScript object, and assigns it to the "storedCities" variable
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if (!storedCities) { // Checks if "storedCities" is null or undefined
        storedCities = []; // Initializes an empty array if there is no value stored for the "cities" key in local storage
    }

    if (!storedCities.includes(city)) { // Checks if the "storedCities" array does not already contain the "city" variable
        storedCities.push(city); // Adds the "city" variable to the end of the "storedCities" array using the "push" method
    }

    // Sets the value of an item with a key of "cities" in local storage to the stringified version of the "storedCities" array
    // using the "setItem" method
    localStorage.setItem("cities", JSON.stringify(storedCities));

    renderButtons(); // Calls the "renderButtons" function (not shown in this code snippet), presumably to update a list of buttons/links that allow the user to select previously searched
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