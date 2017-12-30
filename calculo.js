
/*******/

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function calculo_mental(callback){

var inicio = getRandomInt(0,5);
var salida;
var operacion;

switch(inicio) {
    case "0":
        operacion="1+1";
        break;
    case "1":
        operacion="10+10";
        break;    
    case "2":
        operacion="2+2";
        break;
    case "3":
        operacion="10+2";
        break;
    case "4":
        operacion="5+1";
        break;
    case "5":
        operacion="20+20";
        break;
    default:
        operacion="1+1";
} 
    salida="Empecemos. Te voy a ir indicando operaciones matemáticas para que me indiques el resultado: "+operacion;
    console.log(salida);
    callback(salida);
}


module.exports.calculo_mental = calculo_mental;