/*var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); }
      else
       {  }
    });
  });
});*/

/*

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });
*/


const { Client }  = require('pg');

const cliente = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

cliente.connect();

cliente.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  //for (let row of res.rows) {
//    console.log(JSON.stringify(row));
 // }
  cliente.end();
});

