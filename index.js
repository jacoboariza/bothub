'use strict';

const express = require('express');

const bodyParser = require('body-parser');
const geo = require("./geo");
const weather = require("./weather");
const dbpedia = require("./dbpedia");
const regalo  = require("./regalo");
const calculo  = require("./calculo");
var os = require('os');
//const OpenAI = require('openai-nodejs');
//const client = new OpenAI(process.env.OPENAI_KEY);
var openai = require("openai-node");
openai.api_key = process.env.OPENAI_KEY; // required



//const chistes = require("./chistes");
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

                if (requestBody.result.action=='input.unknown') {
                    speech = "Esto rula";
                    var pregunta = requestBody.result.resolvedQuery;
                    //client.complete(prompt, {stop: ['\n', '"'], temperature: 0.9})
                    var start_chat_log = 'HUMANO: Hola, ¿cómo estás?'+os.EOL+'CYLON: Estupendamente. ¿En que te puedo ayudar?';
                    
                    var prompt = start_chat_log+os.EOL+'HUMANO: '+pregunta+os.EOL+"CYLON:";
                    var stop = os.EOL+'HUMANO:';


                    openai.Completion.create({
                        engine: "davinci",
                        prompt: prompt,
                        temperature: 0.9,
                        max_tokens: 150,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0.6,
                        n: 1,
                        stream: false,
                        logprobs: null,
                        echo: false,
                        best_of: 1,
                        stop: stop,
                    })
                    .then(completion => {
                        //speech = completion.choices[0].text;
                        //console.log(`Result: ${prompt}${completion.choices[0].text}`);
                        speech = completion.choices[0].text;
                        console.log(speech);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });
                    
                    })
                    .catch(err => console.log(`Error Capturado Fuera de la función async: ${err}`));
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
                
               /* if (requestBody.result.action=='aprender_chiste') {
                    console.log(requestBody.result);
                    chistes.aprender_chiste(requestBody.result.parameters['any'],function(resultado){
                        speech="Guardando...";
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }*/
                
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
                
                if (requestBody.result.action=='calculo_mental') {
                    console.log(requestBody.result);

                    calculo.calculo_mental(function(resultado){
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
                
                if (requestBody.result.action=='Regalo') {
                    console.log(requestBody.result);
                    regalo.propuesta(requestBody.result.parameters['Edades'],
                                     requestBody.result.parameters['Persona'],
                                     requestBody.result.parameters['Genero'],
                                     function(resultado){
                        speech=resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }                
                
                //dbpedia.queEs(requestBody.result.parameters['any'],function(resultado){
              /*  if (requestBody.result.action=='Concepto') {
                    console.log(requestBody.result);
                    console.log("hola");
                    dbpedia.que_cosa_es(requestBody.result.parameters['any'],function(resultado){
                        
                        speech=resultado;
                        console.log(resultado);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });                       
                    });
                }     */
                if (requestBody.result.action=='Concepto') {
                dbpedia.que_cosa_es(requestBody.result.parameters['any'])
                .then(salida => {
                        speech = salida;
                        //res.send(salida);
                        return res.json({
                            speech: speech,
                            displayText: speech,
                            source: 'bothub'
                        });
                })
                .catch(err => console.log(`Error Capturado Fuera de la función async: ${err}`));
                }
                 //dbpedia.queEs(requestBody.result.parameters['any'],function(resultado){
                /*    if (requestBody.result.action=='Concepto') {
                        console.log(requestBody.result);
                        console.log("hola");
                        dbpedia.queEs(requestBody.result.parameters['any'],function(resultado){
                            
                            speech=resultado;
                            console.log(resultado);
                            return res.json({
                                speech: speech,
                                displayText: speech,
                                source: 'bothub'
                            });                       
                        });
                    }*/                       
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
