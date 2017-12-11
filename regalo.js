
/*******/

function propuesta(edades, persona, genero, callback){

    var salida;
    var base = "https://regalador.com/es/regalos/";
    var gen;
    
    if (genero=="Masculino")
        gen="nino";
    else
        gen="nina";
    
    
switch(edades) {
    case "1 año":
        base=base+gen+"/1-ano/";
        break;
    case "2 años":
        base=base+gen+"/2-anos/";
        break;
    case "3 años":
        base=base+gen+"/3-anos/";
        break;
    case "4-5 años":
        base=base+gen+"/4-5-anos/";
        break;
    case "6-8 años":
        base=base+gen+"/6-8-anos/";
        break;
    case "9-11 años":
        base=base+gen+"/9-11-anos/";
        break;
    case "mas de 12 años":
        if (genero=="Masculino")
            gen="chicos";
        else
            gen="chicas";
        base=base+gen+"/";
        break;
    case "bebé":
        base="https://regalador.com/es/regalos/ninos/#/dfclassic/query=bebe"
        break;    
    case "adulto":
        if (genero=="Masculino")
            gen="hombre";
        else
            gen="mujer";
        base=base+gen+"/";
        break;    
    case "persona mayor":
        if (genero=="Masculino")
            base="https://regalador.com/es/regalos/hombre/mas-de-50-anos/";
        else
            base="https://regalador.com/es/regalos/mujer/mas-de-50-anos/";
        break;    
    case "joven":
        if (genero=="Masculino")
            gen="chicos";
        else
            gen="chicas";
        base=base+gen+"/";
        break;    
    default:
        base="https://regalador.com/es/regalos/originales";
} 
    salida="Veamos que podemos encontrar para tu "+persona+". Mira a ver que te parece esto: "+base;
    console.log(salida);
    callback(salida);
}


module.exports.propuesta = propuesta;