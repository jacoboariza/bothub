var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: 'AIzaSyDrFMQdnNZiDAApm-7vnTO9Bj0xmCE91YQ', // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};

var geocoder = NodeGeocoder(options);


function getLatitude(ciudad, pais, callback){
    geocoder.geocode('{city:"'+ciudad+'" country: "'+pais+'"}')
        .then(function(resultado){
            callback(resultado[0].latitude);
        })
        .catch(function(error){
            console.log(error);
            callback(error);
        });
}
function getLongitude(ciudad, pais, callback){
    geocoder.geocode('{city:"'+ciudad+'" country: "'+pais+'"}')
        .then(function(resultado){
            callback(resultado[0].longitude);
        })
        .catch(function(error){
            console.log(error);
            callback(error);
        });
}
function getAttribute(ciudad, pais, atributo, callback){
    geocoder.geocode('{city:"'+ciudad+'" country: "'+pais+'"}')
        .then(function(resultado){
            console.log(ciudad+": "+resultado[0][atributo]);
            callback(resultado[0][atributo]);
        })
        .catch(function(error){
            console.log("Error: "+error);
            callback(error);
        });
}


module.exports.getLatitude  = getLatitude; 
module.exports.getLongitude = getLongitude;
module.exports.getAttribute = getAttribute;
