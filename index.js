'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const geo = require("./geo");
const weather = require("./weather");
const dbpedia = require("./dbpedia");
/*var NodeGeocoder = require('node-geocoder');

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
*/


const restService = express();
restService.use(bodyParser.json());
console.log('Init');

restService.all('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }

                if (requestBody.result.action=='prueba2') {
                    speech += 'Resusltado personalizado '+requestBody.result.parameters['geo-city'];

                }

                if (requestBody.result.action=='prueba') {
                    speech += 'Resusltado personalizado '+requestBody.result.parameters['geo-city'];
                    /*geocoder.geocode('29 champs elysée paris', function(err, res,callback) {
                        
                        console.log(res);
                        callback(res);
                    });*/
                }
                if (requestBody.result.action=='GetLatitude') {
                      geo.getAttribute(requestBody.result.parameters['geo-city'],"Spain","latitude",function(resultado){
                        speech="La latitud de "+requestBody.result.parameters['geo-city']+ " es "+resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });
                    });
                }
                
                if (requestBody.result.action=='GetLongitude') {
                    geo.getAttribute(requestBody.result.parameters['geo-city'],"Spain","longitude",function(resultado){
                        speech="La longitud de "+requestBody.result.parameters['geo-city']+ " es "+resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });
                    });
                }
                if (requestBody.result.action=='WeatherForecast') {
                    console.log(requestBody.result);
                    weather.weatherForecast(requestBody.result.parameters['geo-city'],"Spain",function(resultado){
                        speech=resultado.currently.summary+" ahora en "+requestBody.result.parameters['geo-city']+" con una temperatura de "+resultado.currently.temperature+ " grados centígrados";
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }
                if (requestBody.result.action=='AlcaldeDe') {
                    console.log(requestBody.result);
                    console.log("alcalde");
                    dbpedia.alcaldeDe(requestBody.result.parameters['geo-city'],function(resultado){
                        speech=resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }
                
                if (requestBody.result.action=='CapitalDe') {
                    console.log(requestBody.result);
                    dbpedia.capitalDe(requestBody.result.parameters['geo-country'],function(resultado){
                        speech=resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }
                if (requestBody.result.action=='Concepto') {
                    console.log(requestBody.result);
                    dbpedia.queEs(requestBody.result.parameters['any'],function(resultado){
                        speech=resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }                
                
            }
        }

        //console.log('result:+ ', speech);

        /*return res.json({
            speech: speech,
            displayText: speech,
            source: 'bothub'
        });*/
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening "+restService.mountpath);
});
