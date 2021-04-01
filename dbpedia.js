/********/



//import util from 'util';
//import { exec } from 'child_process';

var util = require('util')
var exec = require('child_process').exec;

const ParsingClient = require('sparql-http-client/ParsingClient');

const SparqlClient = require('sparql-http-client')

var child;



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

function queEs(concepto, callback){

    
    //var concepto = "Donald Trump";
    var salida;
    var label;
    
    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    var SparqlClient = require('sparql-client');//var SparqlClient = require('sparql-client');//sparql-client
    
    var util = require('util');
    var endpoint = 'http://es.dbpedia.org/sparql';
    
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
    
    
    var client = new SparqlClient(endpoint);
    var resource = '<http://es.dbpedia.org/page/'+concepto+'>'
 
    client.query(query)
        .execute(function(error, results) {

            if (util.inspect(arguments[1].results.bindings.length)>0){
                var salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
                salida = salida.replace("http://dbpedia.org/resource/","");
                salida = salida.replace("\'","");
                salida = salida.substr(5,salida.length-11);

                console.log(salida);
                callback(salida);
            }    
            else{
                queEs2(concepto,function(resultado){
                    callback(resultado);
                });
              
            };
        });
}


async function que_cosa_es(concepto){

    var salida;
    var label;
    
    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    const SimpleClient = require('sparql-http-client/SimpleClient');
    var resource = 'http://es.dbpedia.org/resource/'+concepto+'';
    const endpointUrl = 'http://es.dbpedia.org/sparql';
    const query = `
        SELECT distinct ?concepto ?objeto ?label WHERE {
            ?concepto rdfs:comment ?objeto. 
            ?concepto rdfs:label ?label. 
            FILTER (lang(?label) = 'es' && ?label="${label}"@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 1`

    
    
    const client = new SimpleClient({ endpointUrl })
    /*const response = await client.query.select(query, {
      headers: {
        accept: 'application/sparql-results+xml'
      }
    })*/
    
    const client2 = new ParsingClient({ endpointUrl })
    const bindings = await client2.query.select(query)
    
    await bindings.forEach(row => 
      Object.entries(row).forEach(([key, value]) => {
        if (key=="objeto"){
            //console.log(`${key}: ${value.value} (${value.termType})`);
            salida = value.value;            
        }
      })
    )

    return salida;
    const response = await client.query.select(query);


    
    //return await response.text();
}



function queEs2(concepto, callback){

    var salida;
    var label;
    
    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    var SparqlClient = require('sparql-client'); //var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://es.dbpedia.org/sparql';
    
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
    
    
    var client = new SparqlClient(endpoint);
    var resource = '<http://es.dbpedia.org/page/'+concepto+'>'
 
    client.query(query)
        .execute(function(error, results) {

            if (util.inspect(arguments[1].results.bindings.length)>0){
                var salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
                salida = salida.replace("http://dbpedia.org/resource/","");
                salida = salida.replace("\'","");
                salida = salida.substr(5,salida.length-11);

                console.log(salida);
                callback(salida);
            }    
            else{
                callback("No se que es "+concepto+". Lo siento");
            };
        });
}

/*******/

function alcaldeDe(concepto, callback){

    var salida;
    var label;

    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    var SparqlClient = require('sparql-client'); //var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://dbpedia.org/sparql';
    
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:leaderName ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
    
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto <http://dbpedia.org/property/capital> ?objeto. ?concepto rdf:type <http://dbpedia.org/ontology/Country>. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es)} LIMIT 10";
    
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
    
    console.log("Búsqueda de alcalde: "+concepto);    
    var client = new SparqlClient(endpoint);
    var resource = '<http://dbpedia.org/resource/'+concepto+'>'
 
    client.query(query)
        .execute(function(error, results) {
            if (util.inspect(arguments[1].results.bindings.length)>0){
                var salida = util.inspect(arguments[1].results.bindings[0].objeto.value, null, 20, true);
                salida = salida.replace("http://dbpedia.org/resource/","");
                salida = salida.replace("\'","");
                salida = salida.substr(5,salida.length-11);

                console.log("Resultados");  

                console.log(salida);
                callback(salida);
            }    
            else{
                console.log("Sin resultados");  
            
            };
        });
}

/*******/

function capitalDe(concepto, callback){

    var salida;
    var label;

    concepto = concepto.replace("?","");
    concepto = ucFirstAllWords(concepto);
    label=concepto;    
    concepto = normalize(concepto);
    concepto = concepto.replace("?","");

    var SparqlClient = require('sparql-client'); //var SparqlClient = require('sparql-client');
    var util = require('util');
    var endpoint = 'http://dbpedia.org/sparql';
   
    var query = "SELECT distinct ?concepto, ?objeto, ?label WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";


    var query = "SELECT distinct ?labelCapital WHERE {?concepto rdfs:comment ?objeto. ?concepto rdfs:label ?label. ?concepto rdf:type dbo:Country. ?concepto dbo:capital ?capital. ?capital rdfs:label ?labelCapital. FILTER (lang(?label) = 'es' && ?label='"+label+"'@es && lang(?labelCapital) = 'es'  && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 10";
  
    var client = new SparqlClient(endpoint);
    var resource = '<http://dbpedia.org/resource/'+concepto+'>'
 
    client.query(query)
        .execute(function(error, results) {
            console.log("Resultados");  
            if (util.inspect(arguments[1].results.bindings.length)>0){
                var salida = util.inspect(arguments[1].results.bindings[0].labelCapital.value, null, 20, true);
                salida = salida.replace("http://dbpedia.org/resource/","");
                salida = salida.replace("\'","");
                salida = salida.substr(5,salida.length-11);

                

                console.log(salida);
                callback(salida);
            }    
            else{
                console.log("Sin resultados");  
            
            };
        });
}



module.exports.queEs = queEs;
module.exports.alcaldeDe = alcaldeDe;
module.exports.capitalDe = capitalDe; 
module.exports.que_cosa_es = que_cosa_es;
//module.exports.buscarConcepto = buscarConcepto;
/*const _queEs = queEs;
export { _queEs as queEs };
const _alcaldeDe = alcaldeDe;
export { _alcaldeDe as alcaldeDe };
const _capitalDe = capitalDe;
export { _capitalDe as capitalDe };*/