var config = require('./api/config/config.json');
var path = require('path');
var express  = require('express');
var app		 = express();
var http = require('http');
var server = app.listen(config.server.port);
var io = require('socket.io').listen(server);
var db = require('./api/config/mongo_database');
require('./api/config//socket.js').Socket(io, db);
var jwt = require('jsonwebtoken');



app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));


/*Se agrega el routing de la bibloteca de codigo*/
require('./api/config/route.js').route(app, jwt, db);
