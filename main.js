var apiai = require('apiai');

var app = apiai("aa3cd65957da4ff9a2082296a8fea0cf");

var request = app.textRequest('bothub', {
    sessionId: '<unique session id>'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();