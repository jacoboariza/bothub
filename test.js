const express = require('express');
const dbpedia = require("./dbpedia");
const rdf = require('rdf-ext');
const app = express();
const port = 3000;
var util = require('util');
const ParsingClient = require('sparql-http-client/ParsingClient');

const SparqlClient = require('sparql-http-client')

//const newEngine = require('@comunica/actor-init-sparql').newEngine;
//const myEngine = newEngine();


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
            console.log(`${key}: ${value.value} (${value.termType})`);
            salida = value.value;            
        }
      })
    )

    return salida;
    const response = await client.query.select(query);


    
    //return await response.text();
}





async function buscarConcepto3(concepto){
    var label=concepto;    
    const endpointUrl = 'http://es.dbpedia.org/sparql';
    const query = `
        SELECT distinct ?concepto ?objeto ?label WHERE {
            ?concepto rdfs:comment ?objeto. 
            ?concepto rdfs:label ?label. 
            FILTER (lang(?label) = 'es' && ?label="${label}"@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 1`

    const client = new SparqlClient({ endpointUrl })
    try {
        const stream = await client.query.select(query);
   
       // row = client.query.select(query);
        var valor;
        
        stream.on('data', row => {
            Object.entries(row).forEach(([key, value]) => {
            //console.log(`${key}: ${value.value} (${value.termType})`);
            valor = value.value;
            console.log ("leyendo datos");
            console.log(valor);
            })
        })

        stream.on('error', err => {
            console.error("Error:"+err)
        })
        
        stream.on('end', () => {
            console.log ("Fin");
            
        })
        const dataset = rdf.dataset();
        await dataset.import(stream)

        for (const quad of dataset) {
          console.log(`${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`)
        }

        stream.on('end', () => {
            res.render('search',{searchterm: searchterm, wikiDescription: comment });
          })


        require("util").inspect.defaultOptions.depth = null;
        console.log(stream);
        //console.log(Object.entries(stream).values().forEach);
    } catch (e) {
      throw `Manejo intero del error. Error original: ${e}`;
    }
}


  const buscarConcepto4 = async (concepto) => {

    var label=concepto;    
    const endpointUrl = 'http://es.dbpedia.org/sparql';
    const query = `
    SELECT distinct ?concepto ?objeto ?label WHERE {
        ?concepto rdfs:comment ?objeto. 
        ?concepto rdfs:label ?label. 
        FILTER (lang(?label) = 'es' && ?label="${label}"@es && (lang(?objeto) = 'es' || lang(?objeto) = 'en'))} LIMIT 1`

    const client = new SparqlClient({ endpointUrl })
try {
    const stream = await client.query.select(query);
    //console.log("Query lanzada: "+label);
    var valor;

    stream.on('data', row => {
        Object.entries(row).forEach(([key, value]) => {
        console.log(`${key}: ${value.value} (${value.termType})`);
        valor = value.value;
        res.send(valor);
//        console.log("Salida ("+value.termType+"): "+valor);
//  console.log("Entra para mostrar resultados");
        })
    })

    stream.on('error', err => {
        console.error("Error:"+err)
    })
    //return "salida_jar";
/*
const bindings = await result.bindings();
valor = bindings[0].get('?concepto').value;
console.log("Valor: "+valor);

console.log(bindings[0].get('?concepto').termType);
*/
  
} catch (e) {
  throw `Manejo intero del error. Error original: ${e}`;
}
}



app.get('/:variable', (req, res) => {
    //res.send('<b>Hello World!</b>')
    //buscarConcepto3("Galaxia")

    /*que_cosa_es("Galaxia",function(resultado){
        speech=resultado;
        console.log(resultado);
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'bothub'
        });                       
    });*/
    var variable = req.params.variable;
    var concepto = variable;
    var resultado;
    var resource = 'http://es.dbpedia.org/resource/'+concepto+'';
    que_cosa_es(concepto)
    .then(salida => {
            speech = salida;
            res.send(salida);
            return res.json({
                speech: speech,
                displayText: speech,
                source: 'bothub'
            });
    })
    .catch(err => console.log(`Error Capturado Fuera de la función async: ${err}`));


    /*
    buscarConcepto3("Galaxia", function(resultado){
        speech=resultado;
        res.send(resultado);
        console.log(resultado);
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'bothub'
        });

    });*/

/*
    dbpedia.buscarConcepto("galaxia",function(resultado){
    speech=resultado;
    res.send(resultado);
    console.log(resultado);
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'bothub'
    });                       
    });
*/

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
