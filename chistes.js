var sqlite3 = require('sqlite3').verbose();
var util = require('util');


function aprender_chiste(texto, callback){

  //usersDB.serialize(function() {
var db = new sqlite3.Database('./bot.db');
var usersDB = new sqlite3.Database("./bot.db");
var id;
  usersDB.each("SELECT MAX(ID) AS maxid FROM CHISTES; ", function(err, row) {
      id= row.maxid + 1;
      db.run("INSERT into CHISTES(ID,CONTENIDO,CONTADOR) VALUES ('"+id+"','"+texto+"','0')");
      usersDB.close();
      db.close();
      callback();
  });

  //usersDB.each("SELECT CONTENIDO AS contenido FROM CHISTES", function(err, row) {
  //    console.log(row.contenido + ": ");
  //});
//});


}


module.exports.aprender_chiste = aprender_chiste;

/*

db.all("SELECT * FROM CHISTES",
  function(err,rows){
            if(err != null){
                console.log(err);
              }
            console.log(util.inspect(rows));
}
);

db.run("INSERT into CHISTES(ID,CONTENIDO,CONTADOR) VALUES ('1','val','0')");

db.close();*/