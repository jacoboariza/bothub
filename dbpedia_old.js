/********/
var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://dbpedia.org/sparql';


var sys = require('sys')
var exec = require('child_process').exec;
var child;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


/********/

var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÇç", 
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuucc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }      
      return ret.join( '' );
  }
 
})();

function ucFirstAllWords( str )
{
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}
/*******/

function obtener(concepto, propiedad){
    var SparqlClient = require('sparql-client');
    var util = require('util');
    var salida;
    var endpoint = 'http://dbpedia.org/sparql';
    //var query = "SELECT * WHERE { ?concepto (owl:sameAs|^owl:sameAs) ?obj }";
    
    var client = new SparqlClient(endpoint);
    var propiedad_aux;
    var concepto_a_buscar;

    propiedad_aux = "<http://dbpedia.org/property/"+propiedad+">";
    concepto_a_buscar = '<http://dbpedia.org/resource/'+concepto+'>';
    
    var query = "SELECT * FROM <http://dbpedia.org> WHERE {?concepto "+propiedad_aux+" ?objeto} LIMIT 10";
    
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    
    client.query(query)
        .bind('concepto', concepto_a_buscar)
        .execute(function(error, results) {
            //process.stdout.write(util.inspect(vector, null, 20, true)+"\n");
            if (util.inspect(arguments[1].results.bindings.length)>0){
                salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
                salida = salida.replace("http://dbpedia.org/resource/","");
                salida = salida.replace("\'","");
                
                console.log("SALIDAAAAA: " + salida+"\n");
                return salida;
            }else{
                console.log("NOOOOOOOOOOOOOOOOOOOOOOO\n");
            }
    });
}



function buscar(concepto, propiedad, tipo, salida){
    var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://dbpedia.org/sparql';
    var query = "SELECT * WHERE { ?concepto (owl:sameAs|^owl:sameAs) ?obj }";
    var client = new SparqlClient(endpoint);
    var propiedad_aux;
    var concepto_a_buscar;
    var vector = [];
    
    propiedad_aux = "<http://dbpedia.org/property/"+propiedad+">";
    concepto_a_buscar = '<http://dbpedia.org/resource/'+concepto+'>';
    
    console.log("Query to " + endpoint);
    console.log("Query: " + query);
    
    client.query(query)
        .bind('concepto', concepto_a_buscar)
        .execute(function(error, results) {
            vector = arguments[1].results.bindings;
            process.stdout.write(util.inspect(vector, null, 20, true)+"\n");
            for(var i=0; i < vector.length; i++){
                process.stdout.write(i+": "+vector[i].obj.value+"\n");
               buscar2(vector[i].obj.value,propiedad_aux,salida);
            }
    });
}

function buscar2(concepto, propiedad, tipo, salida){
    var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://dbpedia.org/sparql';
    var query = "SELECT * WHERE { ?concepto (owl:sameAs|^owl:sameAs) ?obj }";
    var query = "SELECT * FROM <http://dbpedia.org> WHERE {?concepto <http://dbpedia.org/property/leaderName> ?leaderName} LIMIT 10";
    var client = new SparqlClient(endpoint);
    var propiedad_aux;
    var concepto_a_buscar;
    var vector = [];
    
    propiedad_aux = propiedad;
    concepto_a_buscar = '<'+concepto+'>';
    
    console.log("Propiedad " + propiedad_aux);
    console.log("Concepto: " + concepto_a_buscar);
    
    client.query(query)
        .bind('concepto', concepto_a_buscar)
        .execute(function(error, results) {
            vector = arguments[1].results.bindings;
            process.stdout.write(util.inspect(vector, null, 20, true)+"\n");
            for(var i=0; i < vector.length; i++){
                process.stdout.write(i+": "+vector[i].obj.value+"\n");
               //buscar2(vector[i].obj.value,propiedad_aux,salida);
            }
    });
}


//function buscar(concepto, tipo, salida){
//    var vector = [];
//    sameAs(concepto,tipo,vector);
//    process.stdout.write("Longitud"+this.String(vector.length));
//    for(var i=0; i < vector.length; i++){
//        process.stdout.write(vector[i]);
//    }
//}



if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


controller.hears(['hello', 'hi','hola','ciao','Ciao','buenos días','buenas','Buenos días','Hola'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hola ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hola.');
        }
    });
});

controller.hears(['llamame (.*)', 'mi nombre es (.*)', 'me llamo (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'De acuerdo, a partir de ahora te llamaré ' + user.name );
        });
    });
});


controller.hears(['alcalde de (.*)', 'alcaldesa (.*)', 'alcaldesa (.*)?', 'alcalde (.*)?'], 'direct_message,direct_mention,mention', function(bot, message) {
    var city = message.match[1];
    var salida;
    city = normalize(city);
    city = city.replace("?","");
    var query = "SELECT * FROM <http://dbpedia.org> WHERE {?city <http://dbpedia.org/property/leaderName> ?leaderName} LIMIT 10";
var query2 = "SELECT * FROM <http://dbpedia.org> WHERE {?city <http://dbpedia.org/property/mayor> ?leaderName} LIMIT 10";
    
    var query = "SELECT * WHERE {?city <http://dbpedia.org/property/leaderName> ?leaderName} LIMIT 10";
    var query2 = "SELECT * WHERE {?city <http://dbpedia.org/property/mayor> ?leaderName} LIMIT 10";
    
    var client = new SparqlClient(endpoint);
    var resource = '<http://dbpedia.org/resource/'+city+'>'
    var vector = [];
    var alcalde;
    //buscar(city,"leaderName","resource",vector);

    
    
    process.stdout.write("Empieza la búsqueda"+obtener(city,"leaderName")+"\n");
    //buscar(city,"resource",alcalde);
    process.stdout.write("Finaliza la búsqueda"+"\n");
    //process.stdout.write(util.inspect(vector, null, 20, true)+"\n");1
    
     //console.log("Query to " + endpoint);
    //console.log("Query: " + query);
    client.query(query)
        //.bind('city', 'db:Chicago')
        //.bind('city', 'db:Tokyo')
        //.bind('city', 'db:Casablanca')
        .bind('city', resource)
        .execute(function(error, results) {
        
        if (util.inspect(arguments[1].results.bindings.length)>0){
        var salida = util.inspect(arguments[1].results.bindings[0].leaderName.value, null, 20, true);
        salida = salida.replace("http://dbpedia.org/resource/","");
        salida = salida.replace("\'","");

        //process.stdout.write(util.inspect(arguments[1].results.bindings[0].leaderName.value, null, 20, true)+"\n");1
        process.stdout.write(salida);
        bot.reply(message, 'El alcade de '+city+' es '+salida.substr(5,salida.length-11));
        }else{
            
    client.query(query2)
        //.bind('city', 'db:Chicago')
        //.bind('city', 'db:Tokyo')
        //.bind('city', 'db:Casablanca')
        .bind('city', resource)
        .execute(function(error, results) {
        
        if (util.inspect(arguments[1].results.bindings.length)>0){
        process.stdout.write(util.inspect(arguments[1].results.bindings[0].leaderName.value, null, 20, true)+"\n");1
        bot.reply(message, 'El alcade de ' + city + ' es '+util.inspect(arguments[1].results.bindings[0].leaderName.value, null, 20, true));
        }else{
            bot.reply(message, 'Lo siento, no sabría que contestar a eso. '+resource);
            var sys = require('sys')
            var exec = require('child_process').exec;
            function puts(error, stdout, stderr) { sys.puts(stdout) }
            exec("echo '"+city+"'>> feedback.txt", puts);
        
        //    console.log('Capura: ');
        }
        
        });
        }
        
        });
        //bot.reply(message, 'El alcade de ' + city + ' es '+util.inspect(arguments[1].results.bindings[0].leaderName.value, null, 20, true));
        
});

//controller.hears(['voy a pillar','Voy a pillar'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message,':robot_face: Con esa cara? :joy: :joy: :joy: Pues que quieres que te diga...');
//    });

//controller.hears(['Zambra','zambrana','zambra','Zambrana','kike','Kike'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message,':robot_face: Hombre como no!!! :joy: :joy: :joy: Es nuestro party manager!!...');
//        
//    });


//controller.hears(['cesar','Cesar','César','césar'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message, ':stuck_out_tongue_winking_eye: es un come plátanos. Si lo ves dile que Cristiano es una kk.');
//    });

//controller.hears(['jesus','jesús','Jesús','Jesus'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message, ':stuck_out_tongue_winking_eye: es del atleti, bastante tiene con eso.');
//    });

//controller.hears(['flores','edu','eduardo','Flores','Edu','Eduardo'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message, ':stuck_out_tongue_winking_eye: Puf, pues eso de echarle casera a todo, esas claras que se toma,... no se, es pa matarlo');
//    });

//controller.hears(['alex','Alex'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message, ':stuck_out_tongue_winking_eye: Vi chiedo di fare la barba un poco e non dire parolacce. Ma alla fine è un buon ragazzo.');
//    });

//controller.hears(['Diana Alfonso','diana alfonso','diana','Diana'], 'direct_message,direct_mention,mention', function(bot, message) {
//        bot.reply(message,':robot_face: Hombre como no!!! Es una persona encantadora!!');
//    });

controller.hears(['yessica','Yessica'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Sobre Yessica? La que está haciendo obra en su casa?', [
            {
                pattern: 'si',
                callback: function(response, convo) {
                    convo.say('Puf, vaya con la cocina que ha elegido, la encimera es muy cara y los azulejos no combinan y la cama de matrimonio la quieren poner en el centro de la habitacion porque sino no es FENG SHUI');

                    setTimeout(function() {
                    convo.say('Además te cuento, sabes qué esta dando clases de autoescuela? Por lo visto la profesora le dice que va muy rapido por la ciudad y muy lento por carretera, y que se mete en sentido contrario, jejejeje');
                    convo.next();
                    }, 9000);

                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('Entonces no la conozco de nada');
                convo.next();
            }
        }
        ]);
    });
});




controller.hears(['capital de (.*)', 'Capital de (.*)', 'Capital de (.*)?', 'capital de (.*)?'], 'direct_message,direct_mention,mention', function(bot, message) {
    var concepto = message.match[1];
    var salida;
    var label;
    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");
    var query = "SELECT * FROM <http://dbpedia.org> WHERE {?concepto <http://dbpedia.org/property/capital> ?objeto} LIMIT 10";
    var query = "SELECT * WHERE {?concepto <http://dbpedia.org/property/capital> ?objeto} LIMIT 10";
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto <http://dbpedia.org/property/capital> ?objeto. ?concepto rdf:type <http://dbpedia.org/ontology/Country>. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es)} LIMIT 10";
    
    
    
    
    
    var client = new SparqlClient(endpoint);
    var resource = '<http://dbpedia.org/resource/'+concepto+'>'
    var vector = [];
    var alcalde;
    
    client.query(query)

        //.bind('concepto', resource)
        .execute(function(error, results) {
        
        if (util.inspect(arguments[1].results.bindings.length)>0){
        var salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
        salida = salida.replace("http://dbpedia.org/resource/","");
        salida = salida.replace("\'","");
        salida = salida.replace("_"," ");
        salida = salida.substr(5,salida.length-11);

        process.stdout.write(salida);
        bot.reply(message, 'La capital de '+concepto+' es '+salida);
        }else{
            bot.reply(message, 'No sabría que contestar');
            var sys = require('sys')
            var exec = require('child_process').exec;
            function puts(error, stdout, stderr) { sys.puts(stdout) }
            exec("echo '"+concepto+"'>> feedback.txt", puts);     
            
        }
        
        });

        
});


controller.hears(['chi è (.*)','cosa è (.*)','que sabes de (.*)', 'qué es una (.*)', 'qué es un (.*)', 'Que es un (.*)', 'Que es una (.*)','que es (.*)', 'sabes de (.*)', 'qué es (.*)',  'quién es (.*)', 'quien es (.*)','opinas de la (.*)','opinas del (.*)','opinas de las (.*)','opinas de las (.*)','opinas sobre la (.*)','opinas sobre el (.*)','opinas sobre los (.*)','opinas sobre las (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var concepto = message.match[1];
    var salida;
    var label;
    
    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
    
    
    
    
    
    var client = new SparqlClient(endpoint);
    var resource = '<http://dbpedia.org/resource/'+concepto+'>'
    var vector = [];
    var alcalde;

    
    //if (concepto=="César" || concepto=="cesar"){
    //    bot.reply(message, ':stuck_out_tongue_winking_eye: '+concepto+' es un come plátanos');
    //}else{
    client.query(query)

        //.bind('concepto', resource)
        .execute(function(error, results) {
        
        if (util.inspect(arguments[1].results.bindings.length)>0){
        var salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
        salida = salida.replace("http://dbpedia.org/resource/","");
        salida = salida.replace("\'","");
        salida = salida.substr(5,salida.length-11);

        process.stdout.write("SALIDA"+salida);
        //bot.reply(message, 'Sobre '+label+' te puedo contar lo siguiente: '+salida);
        bot.reply(message, salida);
        }else{
            
        var respuesta = getRandomInt(0,5);
        var respuesta2 = getRandomInt(0,5);
        var cosa;
        switch (respuesta2)
        {
        case 0:
            cosa ="Donald Trump";
            break;
        case 1: 
            cosa ="Rafael Nadal";
            break;        
        case 2: 
            cosa ="Felipe González";            
            break;
        case 3: 
            cosa ="Manuela Carmena";
            break;
        case 4: 
            cosa ="Julio Iglesias";
            break;
        case 5: 
            cosa ="Cristiano Ronaldo";
            break;
        }
        
        
        
        
        switch (respuesta)
        {
        case 0: 
            bot.reply(message,':robot_face: Almacenando <' + concepto + '> en mi base de conocimento... :thinking_face:');
            break;

        case 1: 
            bot.reply(message,'Ups, no puedo comentarte nada sobre <' + concepto + '>, tendría que matarte, :joy: :joy:');
            break;            
        case 2: 
            bot.reply(message,'Ten paciencia, por ahora se pocas cosas, pregúntame la capital de cualquier país, si sabes escribirlo claro!!');
            break;     
        case 3: 
            bot.reply(message,'Eso no lo se, pero me puedes preguntar quién es '+cosa);
            break;     
        case 4: 
            bot.reply(message,'No puedo contestarte, pero que sepas que estoy aprendiendo contigo. Gracias!');
            break;     
        case 5: 
            bot.reply(message,':robot_face: Almacenando <' + concepto + '> en mi base de conocimento... :thinking_face:');
            break;     
        }
            
            
            
            //bot.reply(message, 'Pues la verdad es que sobre el concepto '+label+' no se nada. Por ahora, :-)');
            
        var sys = require('sys')
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        exec("echo '"+label+"'>> feedback.txt", puts);
            
            
        }
        
        });
    //}

        
});






//process.on('uncaughtException', function(err) {
 // bot.reply(message, 'Lo siento, no sabría que contestar a eso.');
 // console.log('Caught exception: ' + err);
//});

controller.hears(['what is my name', 'who am i','quién soy yo','cómo me llamo','quien soy yo','quien soy'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Tu nombre es ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('Todavía no te has presentado!');
                    convo.ask('¿Cómo debo llamarte?', function(response, convo) {
                        convo.ask('¿Quiéres que te llame `' + response.text + '`?', [
                            {
                                pattern: 'si',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! Actualizaré mi base de conocimiento...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Hecho. Te llamaré ' + user.name + ' a partir de ahora.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});


controller.hears(['shutdown','vete a dormir'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Seguro?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['arriba', 'identifiquese', 'quien eres tu', 'como te llamas','Quién eres','Quien eres'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: Soy un bot llamado <@' + bot.identity.name +
             '>. Estoy vivo desde hace ' + uptime + ' en un servidor llamado ' + hostname + '.');

    });

controller.hears(['tonto', 'coño', 'puta','mariquita','gilipollas','me caes mal','idiota','maricon','maricón','marica'], 'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,':robot_face: :stuck_out_tongue_winking_eye: Anda que tu,...');

    });

controller.hears(['listo','guapo','simpático','simpatico','bueno'], 'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,':robot_face: :stuck_out_tongue_winking_eye: Muchas gracias!');

    });

controller.hears(['¿Cuántas Palabrotas sabes?'], 'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,':robot_face: :stuck_out_tongue_winking_eye: Qué fuerte me parece!!! Sinvergüenza!');

    });

controller.hears(['que sabes','qué sabes','Que sabes','Qué sabes'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.reply(message,':robot_face: Seguro que bastante menos que tú, pero dame tiempo');
    });

controller.hears(['como puedo (.*)','cómo puedo (.*)','Como puedo (.*)','Cómo puedo (.*)','donde puedo (.*)','dónde puedo (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var concepto = message.match[1];
    
    concepto = concepto.replace("?","");
    bot.reply(message,"-"+concepto+"-");
    switch (concepto)
    {
    case "abrir una incidencia": 
       bot.reply(message,':robot_face: A través de service now en la URL https://enel.service-now.com/sp');
       break;

    case "acceder a Performance Management","acceder a performance management","acceder a performance": 
       bot.reply(message,':robot_face: A través de la plataforma de Oracle: https://hcry.hcm.em2.oraclecloud.com/hcmCore/faces/HcmFusionHome');
       break;

    default: 
       bot.reply(message,':robot_face: A que estaría bien saberlo, verdad? Ni idea de donde podemos encontrar '+concepto);
       break;
    }
        
    });

controller.hears(['ayuda','ayudar'], 'direct_message,direct_mention,mention', function(bot, message) {
    var respuesta = getRandomInt(0,5);

    
    
    switch (respuesta)
    {
    case 0: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como por ejemplo "quien es el alcalde de Barcelona?"');
       break;
    case 1: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como "que es una Montaña?"');
       break;
    case 2: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como "que es una Montaña?"');
       break;
    case 3: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como "que es una canción?". No se cantar, pero casi mejor.');
       break;
    case 4: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como "que es una Galaxia?"');
       break;
    case 5: 
       bot.reply(message,'Me puedes hacer preguntas sencillas como "quien es Manolo Escobar?"');
       break;
    }
        
    });


controller.hears(['je','ja','ji'], 'direct_message,direct_mention,mention', function(bot, message) {
        bot.reply(message,':robot_face: ¿Qué te hace tanta gracia?');
    });
    
    


controller.hears(['(.*)'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());
        var concepto = message.match[1];

        var sys = require('sys')
        var exec = require('child_process').exec;
        function puts(error, stdout, stderr) { sys.puts(stdout) }
        exec("echo '"+concepto+"'>> feedback.txt", puts);
       
        var respuesta = getRandomInt(0,5);
        var respuesta2 = getRandomInt(0,5);
        var cosa;
        switch (respuesta2)
        {
        case 0:
            cosa ="Donald Trump";
            break;
        case 1: 
            cosa ="Rafael Nadal";
            break;        
        case 2: 
            cosa ="Felipe González";            
            break;
        case 3: 
            cosa ="Manuela Carmena";
            break;
        case 4: 
            cosa ="Julio Iglesias";
            break;
        case 5: 
            cosa ="Cristiano Ronaldo";
            break;
        }
        
        
        
        
        switch (respuesta)
        {
        case 0: 
            bot.reply(message,':robot_face: Almacenando <' + concepto + '> en mi base de conocimento... :thinking_face:');
            break;

        case 1: 
            bot.reply(message,'Ups, no puedo comentarte nada sobre <' + concepto + '>, tendría que matarte, :joy: :joy:');
            break;            
        case 2: 
            bot.reply(message,'Ten paciencia, por ahora se pocas cosas, pregúntame la capital de cualquier país, si sabes escribirlo claro!!');
            break;     
        case 3: 
            bot.reply(message,'Eso no lo se, pero me puedes preguntar quién es '+cosa);
            break;     
        case 4: 
            bot.reply(message,'No puedo contestarte, pero que sepas que estoy aprendiendo contigo. Gracias!');
            break;     
        case 5: 
            bot.reply(message,':robot_face: Almacenando <' + concepto + '> en mi base de conocimento... :thinking_face:');
            break;     
        }
       
        

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}