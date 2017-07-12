var Forecast = require('forecast');
const geo = require("./geo");

var forecast = new Forecast({
  service: 'darksky',
  key: '0237c0203871ef3aa92d4231fd824e74',
  units: 'celcius',
  lang: 'es'
});


function weatherForecast(ciudad, pais, callback){
    
    geo.getAttribute(ciudad, pais,"latitude",function(latitude){
        geo.getAttribute(ciudad, pais,"longitude",function(longitude){
            forecast.get([latitude, longitude], true, function(err, weather) {
            if(err)
                return console.dir(err);
            else{
                console.dir(weather);
                callback(weather);
            }
            });
        });
    });
}

module.exports.weatherForecast = weatherForecast;